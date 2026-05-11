package com.chatgpt.ai.exception;

/**
 * Exception thrown when Ollama API communication fails.
 * Used for connection errors, timeouts, and API errors.
 */
public class OllamaException extends RuntimeException {

    public OllamaException(String message) {
        super(message);
    }

    public OllamaException(String message, Throwable cause) {
        super(message, cause);
    }
}
