# BigAuction — Deployment Guide

Deploy BigAuction as a **monolith** (single executable JAR serving both the React UI
and the Spring Boot API) to a **Hostinger VPS** using **systemd + Nginx + Let's Encrypt SSL**.

- **Backend:** Spring Boot 4.0.6, Java 21, MySQL, WebSocket (STOMP/SockJS at `/ws`)
- **Frontend:** React 19 + Vite, bundled into the JAR's `classpath:/static`
- **Architecture:** Nginx (:443) → reverse-proxy → Spring Boot (:8080) → MySQL (:3306)

Everything is same-origin, so there is **no CORS** to manage and WebSockets run over `wss://`.

---

## 1. Build the artifact (on your Mac)

The `prod` Maven profile builds the React app (pinned Node 22 / npm 11) and bundles it
into the JAR. The default build skips the frontend so day-to-day backend dev stays fast.

```bash
cd bigauction_backend
./mvnw clean package -Pprod
```

Output: `bigauction_backend/target/big-auction-0.0.1-SNAPSHOT.jar` (fully self-contained).

> Local dev is unaffected: `./mvnw spring-boot:run` (backend) and `npm run dev` in
> `bigauction_web` (frontend on :5173) still work via the `VITE_API_URL` / `VITE_WS_URL`
> dev fallbacks.

---

## 2. Server prerequisites (on the VPS)

Assumes Ubuntu 22/24, SSH access as `root`, and your domain's DNS **A record already
points at the VPS IP**. Replace `bigauction.com` with your real domain throughout.

```bash
apt update && apt upgrade -y
apt install -y openjdk-21-jre-headless nginx mysql-server certbot python3-certbot-nginx
adduser --system --group bigauction          # service account, no login shell
mkdir -p /opt/bigauction
```

---

## 3. MySQL database

```bash
mysql_secure_installation        # answer Y to the hardening prompts
```

> **Note:** On Ubuntu, the MySQL `root` account uses `auth_socket` authentication by
> default — it has no password and you log in simply as the OS root user via the local
> socket. The message *"Skipping password set for root as authentication with auth_socket
> is used by default"* is expected and not an error. Connect with `sudo mysql` (no `-p`).
> This only affects the `root` login method; the `bigauction` app user below uses normal
> password authentication, which is what the app connects with.

```bash
sudo mysql <<'SQL'
CREATE DATABASE bigauction CHARACTER SET utf8mb4;
CREATE USER 'bigauction'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG';
GRANT ALL PRIVILEGES ON bigauction.* TO 'bigauction'@'localhost';
FLUSH PRIVILEGES;
SQL
```

---

## 4. Externalized secrets

All sensitive config is read from the environment (see `application.properties`), with
dev-only fallbacks. Create `/opt/bigauction/.env`:

```bash
cat > /opt/bigauction/.env <<'ENV'
DB_URL=jdbc:mysql://localhost:3306/bigauction?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=bigauction
DB_PASSWORD=CHANGE_ME_STRONG
JWT_SECRET=REPLACE_WITH_LONG_RANDOM_STRING
ENV

chmod 600 /opt/bigauction/.env
chown bigauction:bigauction /opt/bigauction/.env
```

Generate a strong JWT secret with:

```bash
openssl rand -base64 48
```

| Variable          | Required | Notes                                              |
|-------------------|----------|----------------------------------------------------|
| `DB_URL`          | yes      | JDBC URL for MySQL                                  |
| `DB_USERNAME`     | yes      | DB user                                             |
| `DB_PASSWORD`     | yes      | DB password                                         |
| `JWT_SECRET`      | yes      | Long random string; never commit this              |
| `JWT_EXPIRATION_MS` | no     | Token lifetime in ms (default `86400000` = 24h)    |

---

## 5. Upload the JAR

From your Mac:

```bash
scp bigauction_backend/target/big-auction-0.0.1-SNAPSHOT.jar \
    root@YOUR_VPS_IP:/opt/bigauction/app.jar
```

---

## 6. systemd service

```bash
cat > /etc/systemd/system/bigauction.service <<'UNIT'
[Unit]
Description=BigAuction
After=network.target mysql.service

[Service]
User=bigauction
WorkingDirectory=/opt/bigauction
EnvironmentFile=/opt/bigauction/.env
ExecStart=/usr/bin/java -Xmx1g -jar /opt/bigauction/app.jar
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now bigauction
journalctl -u bigauction -f        # watch startup; Ctrl-C to exit
```

Verify locally on the VPS — this should return HTML:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/    # expect 200
```

> The `WorkingDirectory` is `/opt/bigauction`, so uploaded images land in
> `/opt/bigauction/uploads/images` (from `app.upload.dir`). They persist across restarts.

---

## 7. Nginx reverse proxy (with WebSocket support)

```bash
cat > /etc/nginx/sites-available/bigauction <<'NGINX'
server {
    listen 80;
    server_name bigauction.com www.bigauction.com;
    client_max_body_size 12M;          # matches the 10MB upload limit

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket / SockJS support for /ws
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
    }
}
NGINX

ln -s /etc/nginx/sites-available/bigauction /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 8. HTTPS (free, auto-renewing)

```bash
certbot --nginx -d bigauction.com -d www.bigauction.com
```

Certbot rewrites the Nginx config for SSL and installs a renewal timer. The `wss://`
WebSocket works automatically thanks to the upgrade headers above.

---

## 9. Firewall

Open only what's needed; keep the app and DB ports private.

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'      # 80 + 443
ufw enable
```

Ports **8080** (app) and **3306** (MySQL) should **not** be publicly reachable — only
Nginx (local) and the app (local) use them.

---

## Redeploying a new version

```bash
# on your Mac:
cd bigauction_backend
./mvnw clean package -Pprod
scp target/big-auction-0.0.1-SNAPSHOT.jar root@YOUR_VPS_IP:/opt/bigauction/app.jar

# on the VPS:
systemctl restart bigauction
```

---

## Smoke tests (after deploy)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://bigauction.com/                 # 200 (UI)
curl -s -o /dev/null -w "%{http_code}\n" https://bigauction.com/login            # 200 (SPA route)
curl -s -o /dev/null -w "%{http_code}\n" https://bigauction.com/api/auctions     # 200 (public API)
curl -s -o /dev/null -w "%{http_code}\n" https://bigauction.com/api/wallet       # 401 (protected API)
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `journalctl -u bigauction` shows `Communications link failure` | MySQL not running, or wrong `DB_*` in `.env`. Check `systemctl status mysql`. |
| `PlaceholderResolutionException: ... app.jwt.secret` | `JWT_SECRET` missing from `.env` and no fallback. Ensure `.env` is loaded. |
| `Port 8080 was already in use` | An old instance is still running: `systemctl stop bigauction` / `pkill -f app.jar`. |
| UI loads but API calls fail with 404/CORS | Confirm requests go to `/api/...` (relative). The `prod` build sets this via `.env.production`. |
| WebSocket won't connect | Verify the Nginx `Upgrade`/`Connection` headers are present and you're on `https`/`wss`. |
| `502 Bad Gateway` from Nginx | App isn't up on :8080. Check `systemctl status bigauction`. |

---

## Architecture notes

- **Monolith:** `WebMvcConfig` serves the React build from `classpath:/static` with an
  `index.html` fallback for client-side (React Router) routes. The fallback resolver runs
  at the lowest precedence, so `/api/**` controllers and the `/ws` WebSocket handler are
  never shadowed.
- **Security:** `/api/**` requires JWT auth (except the explicitly public endpoints in
  `SecurityConfig`); all UI/static paths are public.
- **Uploads:** served from disk at `/uploads/**`; image URLs are stored relative so they
  work on any host.
