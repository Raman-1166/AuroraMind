package com.chatgpt.ai.exception;

/**
 * Exception thrown when input validation fails.
 * Used for invalid messages, empty prompts, etc.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
