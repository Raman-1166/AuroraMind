package com.chatgpt.ai.dto;

import java.time.LocalDateTime;

/**
 * DTO for error responses.
 * Provides consistent error format across all endpoints.
 */
public record ErrorResponseDTO(
        boolean success,
        String error,
        String details,
        LocalDateTime timestamp
) {
    /**
     * Factory method for creating error responses.
     */
    public static ErrorResponseDTO of(String error, String details) {
        return new ErrorResponseDTO(
                false,
                error,
                details,
                LocalDateTime.now()
        );
    }

    /**
     * Factory method for creating error responses without details.
     */
    public static ErrorResponseDTO of(String error) {
        return new ErrorResponseDTO(
                false,
                error,
                null,
                LocalDateTime.now()
        );
    }
}
