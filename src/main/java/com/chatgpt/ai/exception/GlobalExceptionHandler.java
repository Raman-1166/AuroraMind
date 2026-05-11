package com.chatgpt.ai.exception;

import com.chatgpt.ai.dto.ErrorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for all REST endpoints.
 * Converts exceptions to clean JSON error responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle Ollama API errors (503 Service Unavailable).
     */
    @ExceptionHandler(OllamaException.class)
    public ResponseEntity<ErrorResponseDTO> handleOllamaException(OllamaException e) {
        logger.error("Ollama API error: {}", e.getMessage(), e);
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ErrorResponseDTO.of(
                        "AI service unavailable",
                        "The AI service is currently unavailable. Please try again later."
                ));
    }

    /**
     * Handle validation errors (400 Bad Request).
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationException(ValidationException e) {
        logger.warn("Validation error: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponseDTO.of(
                        "Invalid request",
                        e.getMessage()
                ));
    }

    /**
     * Handle generic exceptions (500 Internal Server Error).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(Exception e) {
        logger.error("Unexpected error: {}", e.getMessage(), e);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponseDTO.of(
                        "Internal server error",
                        "An unexpected error occurred. Please try again."
                ));
    }
}
