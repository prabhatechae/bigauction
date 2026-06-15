package com.bigauction.big_auction.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Logs one line per request: method, path, response status, duration, the
 * authenticated user (if any) and client IP. Only /api/** and /ws are logged —
 * static assets and uploaded images are skipped to keep the log readable.
 *
 * <p>No @Order is set, so this runs at the lowest precedence — i.e. innermost,
 * after Spring Security has populated the SecurityContext — which is why the
 * authenticated user is available here.
 */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long durationMs = System.currentTimeMillis() - start;
            String query = request.getQueryString();
            log.info("{} {}{} -> {} ({} ms) user={} ip={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    query != null ? "?" + query : "",
                    response.getStatus(),
                    durationMs,
                    currentUser(),
                    clientIp(request));
        }
    }

    /** Only log API and WebSocket traffic; skip the React app and uploaded images. */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return !(uri.startsWith("/api") || uri.startsWith("/ws"));
    }

    private String currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return "anonymous";
        }
        return auth.getName();
    }

    /** Honour the X-Forwarded-For header set by Nginx so we log the real client IP. */
    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
