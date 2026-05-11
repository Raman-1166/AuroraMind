package com.chatgpt.ai.dto;

import java.time.LocalDateTime;

/**
 * DTO for chat responses sent to the frontend.
 * Contains the AI response and metadata.
 */
public record ChatResponseDTO(
        boolean success,
        String response,
        String messageId,
        LocalDateTime timestamp,
        String error
) {
    /**
     * Factory method for successful responses.
     */
    public static ChatResponseDTO success(String response, String messageId) {
        return new ChatResponseDTO(
                true,
                response,
                messageId,
                LocalDateTime.now(),
                null
        );
    }

    /**
     * Factory method for error responses.
     */
    public static ChatResponseDTO error(String errorMessage) {
        return new ChatResponseDTO(
                false,
                null,
                null,
                LocalDateTime.now(),
                errorMessage
        );
    }
}
