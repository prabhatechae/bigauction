package com.bigauction.big_auction.exception;

import org.springframework.http.HttpStatus;

/**
 * General application exception that carries an HTTP status.
 * Throw this anywhere in the service layer — GlobalExceptionHandler converts it to a proper response.
 */
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
