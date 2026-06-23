-- ============================================================
-- Big Auction – Production Migration Script (MySQL 8.0+)
-- Covers changes in commit: 3e1dd7a
-- Safe to re-run — all statements use IF NOT EXISTS.
-- ============================================================

-- ── 1. users – new profile columns ───────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_verified TINYINT(1)  NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS language       VARCHAR(10)  NOT NULL DEFAULT 'en';

-- ── 2. wallets – reward credits balance ──────────────────────
ALTER TABLE wallets
    ADD COLUMN IF NOT EXISTS reward_credits DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- ── 3. bids – auto bid flag ───────────────────────────────────
ALTER TABLE bids
    ADD COLUMN IF NOT EXISTS auto_bid TINYINT(1) NOT NULL DEFAULT 0;

-- ── 4. auto_bid_configs (new table) ──────────────────────────
CREATE TABLE IF NOT EXISTS auto_bid_configs (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    auction_id BIGINT        NOT NULL,
    user_id    BIGINT        NOT NULL,
    increment  DECIMAL(12,2) NOT NULL,
    max_limit  DECIMAL(12,2) NOT NULL,
    enabled    TINYINT(1)    NOT NULL DEFAULT 1,
    created_at DATETIME(6)   NULL,
    updated_at DATETIME(6)   NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_auto_bid_configs_auction_user (auction_id, user_id),
    CONSTRAINT fk_auto_bid_configs_auction FOREIGN KEY (auction_id) REFERENCES auctions(id),
    CONSTRAINT fk_auto_bid_configs_user    FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 5. favourites (new table) ────────────────────────────────
CREATE TABLE IF NOT EXISTS favourites (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    user_id    BIGINT      NOT NULL,
    product_id BIGINT      NOT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_favourites_user_product (user_id, product_id),
    CONSTRAINT fk_favourites_user    FOREIGN KEY (user_id)    REFERENCES users(id),
    CONSTRAINT fk_favourites_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 6. user_addresses (new table) ───────────────────────────
CREATE TABLE IF NOT EXISTS user_addresses (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    user_id       BIGINT       NOT NULL,
    label         VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    phone         VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city          VARCHAR(255) NOT NULL,
    country       VARCHAR(255) NOT NULL,
    emirate       VARCHAR(255) NULL,
    po_box        VARCHAR(255) NULL,
    is_default    TINYINT(1)   NOT NULL DEFAULT 0,
    created_at    DATETIME(6)  NULL,
    updated_at    DATETIME(6)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 7. wishlist_items (new table) ───────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_items (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    user_id    BIGINT        NOT NULL,
    brand      VARCHAR(255)  NOT NULL,
    item_model VARCHAR(255)  NOT NULL,
    budget_min DECIMAL(12,2) NULL,
    budget_max DECIMAL(12,2) NULL,
    notes      TEXT          NULL,
    photo_url  VARCHAR(255)  NULL,
    status     VARCHAR(50)   NOT NULL DEFAULT 'SUBMITTED',
    created_at DATETIME(6)   NULL,
    updated_at DATETIME(6)   NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_wishlist_items_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
