package com.chatgpt.ai.service;

import com.chatgpt.ai.exception.OllamaException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Service for communicating with Ollama AI API.
 * Handles prompt submission and response parsing.
 */
@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ValidationService validationService;

    @Value("${ollama.api.url}")
    private String ollamaApiUrl;

    @Value("${ollama.model}")
    private String ollamaModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Send a prompt to Ollama and get AI response.
     *
     * @param prompt the user's prompt
     * @return the AI's response text
     * @throws OllamaException if communication with Ollama fails
     */
    public String askAI(String prompt) {
        logger.info("Processing prompt for AI");

        // Validate input
        validationService.validateMessage(prompt);
        String sanitizedPrompt = validationService.sanitizeInput(prompt);

        try {
            long startTime = System.currentTimeMillis();

            // Build request
            String requestBody = buildOllamaRequest(sanitizedPrompt);
            HttpEntity<String> entity = buildHttpEntity(requestBody);

            // Call Ollama API
            logger.debug("Calling Ollama API at: {}", ollamaApiUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    ollamaApiUrl,
                    entity,
                    String.class
            );

            // Parse response
            String aiResponse = parseOllamaResponse(response.getBody());

            long duration = System.currentTimeMillis() - startTime;
            logger.info("AI response received in {}ms", duration);

            return aiResponse;

        } catch (RestClientException e) {
            logger.error("Failed to communicate with Ollama API", e);
            throw new OllamaException("Failed to connect to AI service", e);
        } catch (Exception e) {
            logger.error("Error processing AI request", e);
            throw new OllamaException("Error processing request: " + e.getMessage(), e);
        }
    }

    /**
     * Build the request body for Ollama API.
     */
    private String buildOllamaRequest(String prompt) {
        return String.format("""
                {
                  "model":"%s",
                  "prompt":"%s",
                  "stream":false
                }
                """, ollamaModel, escapeJson(prompt));
    }

    /**
     * Build HTTP entity with proper headers.
     */
    private HttpEntity<String> buildHttpEntity(String requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(requestBody, headers);
    }

    /**
     * Parse Ollama JSON response and extract the generated text.
     */
    private String parseOllamaResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String response = root.path("response").asText();

            if (response.isEmpty()) {
                logger.warn("Empty response from Ollama");
                throw new OllamaException("Received empty response from AI service");
            }

            return response;
        } catch (Exception e) {
            logger.error("Failed to parse Ollama response: {}", responseBody, e);
            throw new OllamaException("Failed to parse AI response", e);
        }
    }

    /**
     * Escape special characters in JSON strings.
     */
    private String escapeJson(String input) {
        return input
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}