package com.chatgpt.ai.dto;

/**
 * DTO for incoming chat requests from the frontend.
 * Uses Java record for immutability and clean API.
 */
public record ChatRequestDTO(
        String conversationId,
        String message
) {
}
