package com.chatgpt.ai.controller;

import com.chatgpt.ai.dto.ChatRequestDTO;
import com.chatgpt.ai.dto.ChatResponseDTO;
import com.chatgpt.ai.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for chat endpoints.
 * Handles incoming chat requests and returns AI responses.
 */
@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    /**
     * POST endpoint to send a message and get AI response.
     * Accepts JSON request with conversationId and message.
     *
     * @param request the chat request containing message
     * @return ChatResponseDTO with AI response
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        logger.info("Received chat request");

        try {
            // Get AI response
            String aiResponse = chatService.askAI(request.message());

            // Generate message ID
            String messageId = UUID.randomUUID().toString();

            // Return success response
            ChatResponseDTO response = ChatResponseDTO.success(aiResponse, messageId);
            logger.info("Chat request processed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error processing chat request: {}", e.getMessage());
            throw e;  // Let GlobalExceptionHandler handle it
        }
    }

    /**
     * GET endpoint for health check.
     * Simple endpoint to verify the service is running.
     *
     * @return success message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("Health check requested");
        return ResponseEntity.ok("{\"status\":\"UP\"}");
    }
}