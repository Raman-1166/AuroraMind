package com.chatgpt.ai.service;

import com.chatgpt.ai.exception.ValidationException;
import org.springframework.stereotype.Service;

/**
 * Service for validating user input.
 * Ensures messages are valid before sending to Ollama.
 */
@Service
public class ValidationService {

    private static final int MAX_MESSAGE_LENGTH = 2000;
    private static final int MIN_MESSAGE_LENGTH = 1;

    /**
     * Validate a message before sending to AI.
     * Checks for empty, whitespace-only, and length constraints.
     *
     * @param message the message to validate
     * @throws ValidationException if validation fails
     */
    public void validateMessage(String message) {
        if (message == null) {
            throw new ValidationException("Message cannot be null");
        }

        if (message.isBlank()) {
            throw new ValidationException("Message cannot be empty or contain only whitespace");
        }

        if (message.length() < MIN_MESSAGE_LENGTH) {
            throw new ValidationException("Message is too short");
        }

        if (message.length() > MAX_MESSAGE_LENGTH) {
            throw new ValidationException(
                    String.format("Message is too long (max %d characters)", MAX_MESSAGE_LENGTH)
            );
        }
    }

    /**
     * Sanitize input to prevent injection attacks.
     * Removes potentially dangerous patterns.
     *
     * @param input the input to sanitize
     * @return sanitized input
     */
    public String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }

        // Remove control characters
        return input.replaceAll("[\\p{Cc}]", "");
    }
}
