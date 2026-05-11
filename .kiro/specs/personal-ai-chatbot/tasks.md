# Implementation Plan: Personal AI Chatbot

## Overview

This implementation plan breaks down the Personal AI Chatbot feature into discrete, actionable coding tasks. The plan follows a layered approach: first establishing backend infrastructure and data models, then implementing API endpoints, followed by frontend setup and components, and finally integration and testing. Each task builds on previous work with no orphaned code.

## Tasks

- [ ] 1. Set up backend infrastructure and dependencies
  - Add Spring Data JPA and H2 database dependencies to pom.xml
  - Create database configuration class (DatabaseConfig) with H2 setup
  - Create CORS configuration class (CorsConfig) to allow frontend communication
  - Create RestTemplate bean for Ollama HTTP calls
  - _Requirements: 3.1, 4.1, 8.1_

- [ ] 2. Create data models and entities
  - [ ] 2.1 Create Conversation entity with UUID, title, timestamps, and message count
    - Define JPA entity with proper annotations
    - Add OneToMany relationship to Message entity
    - _Requirements: 3.1, 4.1, 12.5_
  
  - [ ] 2.2 Create Message entity with sender, content, and timestamp
    - Define JPA entity with UUID primary key
    - Add ManyToOne relationship to Conversation
    - Create MessageSender enum (USER, AI)
    - _Requirements: 3.2, 4.1, 8.5_
  
  - [ ]* 2.3 Write property test for unique conversation IDs
    - **Property 2: Unique Conversation IDs**
    - **Validates: Requirements 3.1**
  
  - [ ]* 2.4 Write property test for message persistence round trip
    - **Property 3: Message Persistence Round Trip**
    - **Validates: Requirements 3.2, 4.3**

- [ ] 3. Create DTOs and API response structures
  - [ ] 3.1 Create ChatRequestDTO with conversationId and message fields
    - Use Java record for immutability
    - _Requirements: 9.1_
  
  - [ ] 3.2 Create ChatResponseDTO and ChatResponseData records
    - Include success flag, response text, messageId, and timestamp
    - _Requirements: 9.2, 8.2_
  
  - [ ] 3.3 Create MessageDTO with all message fields
    - Include id, conversationId, sender, content, timestamp
    - _Requirements: 9.3, 8.5_
  
  - [ ] 3.4 Create ConversationDTO with conversation metadata
    - Include id, title, createdAt, lastMessageAt, messageCount
    - _Requirements: 9.4_
  
  - [ ] 3.5 Create ErrorResponse DTO for error responses
    - Include success flag and error message
    - _Requirements: 8.3_
  
  - [ ]* 3.6 Write property test for JSON response format
    - **Property 8: JSON Response Format**
    - **Validates: Requirements 8.1, 8.2**
  
  - [ ]* 3.7 Write property test for error response format
    - **Property 9: Error Response Format**
    - **Validates: Requirements 8.3**

- [ ] 4. Create repositories for database access
  - [ ] 4.1 Create ConversationRepository extending JpaRepository
    - Add methods: findAll with pagination, findById, save, delete
    - _Requirements: 3.3, 3.4, 3.5, 4.1_
  
  - [ ] 4.2 Create MessageRepository extending JpaRepository
    - Add methods: findByConversationId, save, deleteByConversationId
    - _Requirements: 3.2, 4.1_

- [ ] 5. Create validation service with input validation logic
  - [ ] 5.1 Create ValidationService class with validation methods
    - Implement validateMessage: check not empty, not whitespace, max 2000 chars
    - Implement validateConversationId: validate UUID format
    - Implement sanitizeInput: remove potential injection patterns
    - Throw ValidationException with specific error details
    - _Requirements: 1.2, 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 5.2 Write property test for message validation
    - **Property 1: Message Validation Rejects Invalid Input**
    - **Validates: Requirements 1.2, 10.1, 10.2**
  
  - [ ]* 5.3 Write property test for input sanitization
    - **Property 12: Input Sanitization**
    - **Validates: Requirements 10.3**
  
  - [ ]* 5.4 Write property test for UUID validation
    - **Property 13: UUID Validation**
    - **Validates: Requirements 10.4**
  
  - [ ]* 5.5 Write property test for validation error details
    - **Property 14: Validation Error Details**
    - **Validates: Requirements 10.5**

- [ ] 6. Create exception handling and global exception handler
  - [ ] 6.1 Create custom exception classes
    - Create OllamaException for AI service errors
    - Create ValidationException for validation failures
    - Create ConversationNotFoundException for missing conversations
    - _Requirements: 1.6, 6.1_
  
  - [ ] 6.2 Create GlobalExceptionHandler with @RestControllerAdvice
    - Handle ValidationException → 400 with error message
    - Handle OllamaException → 503 with "AI service unavailable"
    - Handle ConversationNotFoundException → 404 with error message
    - Handle generic exceptions → 500 with generic error message
    - _Requirements: 1.5, 1.6, 6.1_
  
  - [ ]* 6.3 Write property test for HTTP status codes
    - **Property 10: HTTP Status Codes**
    - **Validates: Requirements 8.4**

- [ ] 7. Enhance ChatService with conversation context and memory management
  - [ ] 7.1 Add buildContext method to format last 5-10 messages for Ollama
    - Query last 10 messages from conversation
    - Format as "User: message\nAI: response\n..."
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ] 7.2 Add askAI method that includes context when calling Ollama
    - Build context using buildContext method
    - Prepend context to current message
    - Call Ollama API with full prompt
    - Parse response and return AI message
    - _Requirements: 1.3, 5.1_
  
  - [ ] 7.3 Add parseOllamaResponse method to extract text from Ollama JSON
    - Handle Ollama response format
    - Extract generated text
    - _Requirements: 1.4_
  
  - [ ] 7.4 Add logging for response times and errors
    - Log incoming messages with timestamp
    - Log AI responses with response time
    - Log errors with stack traces
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 7.5 Write property test for context window limit
    - **Property 5: Context Window Limit**
    - **Validates: Requirements 5.1, 5.4**
  
  - [ ]* 7.6 Write property test for context reset on new conversation
    - **Property 6: Context Reset on New Conversation**
    - **Validates: Requirements 5.3**
  
  - [ ]* 7.7 Write property test for message formatting for context
    - **Property 15: Message Formatting for Context**
    - **Validates: Requirements 5.2**

- [ ] 8. Create ConversationService with CRUD operations
  - [ ] 8.1 Implement createConversation method
    - Generate new UUID and timestamp
    - Set default title (e.g., "New Conversation")
    - Save to database
    - Return ConversationDTO
    - _Requirements: 3.1, 3.6_
  
  - [ ] 8.2 Implement getConversation method
    - Query conversation by ID
    - Load all messages for conversation
    - Return ConversationDTO with messages
    - Throw ConversationNotFoundException if not found
    - _Requirements: 3.4_
  
  - [ ] 8.3 Implement getAllConversations method with pagination
    - Query all conversations with pagination (20 per page)
    - Sort by lastMessageAt descending
    - Return list of ConversationDTOs
    - _Requirements: 3.3, 7.3_
  
  - [ ] 8.4 Implement deleteConversation method
    - Delete conversation and cascade delete all messages
    - Throw ConversationNotFoundException if not found
    - _Requirements: 3.5_
  
  - [ ] 8.5 Implement addMessage method
    - Create Message entity with UUID, sender, content, timestamp
    - Save to database
    - Update conversation's lastMessageAt and messageCount
    - Return MessageDTO
    - _Requirements: 3.2, 4.3_
  
  - [ ] 8.6 Add logging for database operations
    - Log conversation creation, retrieval, deletion
    - Log message saves
    - _Requirements: 11.4_
  
  - [ ]* 8.7 Write property test for conversation context isolation
    - **Property 4: Conversation Context Isolation**
    - **Validates: Requirements 12.5**
  
  - [ ]* 8.8 Write property test for pagination correctness
    - **Property 7: Pagination Correctness**
    - **Validates: Requirements 7.3**
  
  - [ ]* 8.9 Write property test for message timestamps
    - **Property 11: Message Timestamps**
    - **Validates: Requirements 8.5**

- [ ] 9. Enhance ChatController with POST /api/chat endpoint
  - [ ] 9.1 Implement POST /api/chat endpoint
    - Accept ChatRequestDTO with conversationId and message
    - Validate message using ValidationService
    - Call ChatService.askAI with context
    - Save user message and AI response to database
    - Return ChatResponseDTO with success, response, messageId, timestamp
    - Handle validation errors (400), Ollama errors (503)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ] 9.2 Add request logging
    - Log incoming requests with endpoint and timestamp
    - _Requirements: 11.1_

- [ ] 10. Create ConversationController with REST endpoints
  - [ ] 10.1 Implement GET /api/conversations endpoint
    - Accept optional page parameter (default 0)
    - Call ConversationService.getAllConversations with pagination
    - Return list of ConversationDTOs
    - _Requirements: 3.3, 7.3_
  
  - [ ] 10.2 Implement GET /api/conversations/{id} endpoint
    - Validate conversationId format
    - Call ConversationService.getConversation
    - Return conversation with all messages
    - Handle 404 if not found
    - _Requirements: 3.4_
  
  - [ ] 10.3 Implement POST /api/conversations/new endpoint
    - Call ConversationService.createConversation
    - Return new conversation with ID and title
    - _Requirements: 3.6_
  
  - [ ] 10.4 Implement DELETE /api/conversations/{id} endpoint
    - Validate conversationId format
    - Call ConversationService.deleteConversation
    - Return success message
    - Handle 404 if not found
    - _Requirements: 3.5_
  
  - [ ] 10.5 Add request logging to all endpoints
    - Log incoming requests with endpoint and timestamp
    - _Requirements: 11.1_

- [ ] 11. Create HealthController for service status
  - [ ] 11.1 Implement GET /api/health endpoint
    - Return simple health check response
    - Verify Ollama connectivity
    - _Requirements: 1.6_

- [ ] 12. Checkpoint - Backend API complete
  - Ensure all backend tests pass
  - Test all endpoints with curl or Postman
  - Verify error handling for all scenarios
  - Ask the user if questions arise

- [ ] 13. Set up React + Vite frontend project
  - [ ] 13.1 Create React + Vite project structure
    - Initialize Vite project with React template
    - Install dependencies (React, Vite, Axios, Tailwind CSS)
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 13.2 Configure Tailwind CSS for styling
    - Set up Tailwind configuration
    - Create base styles and utility classes
    - _Requirements: 2.4_
  
  - [ ] 13.3 Create project directory structure
    - Create components/, hooks/, context/, services/, styles/ directories
    - _Requirements: 2.1_

- [ ] 14. Create API client and context management
  - [ ] 14.1 Create Axios API client (apiClient.js)
    - Configure base URL to backend (http://localhost:7070)
    - Create methods: postChat, getConversations, getConversation, createConversation, deleteConversation
    - Handle errors and return consistent response format
    - _Requirements: 1.1, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 14.2 Create ChatContext using Context API
    - State: conversations, currentConversation, messages, loading, error
    - Actions: setConversations, setCurrentConversation, setMessages, setLoading, setError
    - _Requirements: 2.1, 2.2, 3.1, 3.2_
  
  - [ ] 14.3 Create ChatProvider component
    - Wrap application with context provider
    - Load conversations on mount
    - _Requirements: 3.3_

- [ ] 15. Create core frontend components
  - [ ] 15.1 Create MessageBubble component
    - Display individual message with sender, content, timestamp
    - Different styling for user vs AI messages
    - User messages on right, AI messages on left
    - _Requirements: 2.1_
  
  - [ ] 15.2 Create LoadingAnimation component
    - Show typing indicator while waiting for AI response
    - _Requirements: 2.2_
  
  - [ ] 15.3 Create ChatWindow component
    - Display list of messages using MessageBubble
    - Show loading animation while waiting for response
    - Auto-scroll to latest message
    - Display error messages
    - _Requirements: 2.1, 2.2, 2.6_
  
  - [ ] 15.4 Create InputBox component
    - Text input field with send button
    - Character counter (show when near 2000 limit)
    - Prevent sending empty messages
    - Show validation errors
    - _Requirements: 2.3, 1.2, 6.1_
  
  - [ ] 15.5 Create Sidebar component
    - Display list of conversations
    - "New Chat" button
    - Highlight current conversation
    - Delete conversation button
    - Click to switch conversations
    - _Requirements: 3.1, 3.2, 4.2, 12.1, 12.2, 12.3, 12.4_

- [ ] 16. Create main App component and routing
  - [ ] 16.1 Create App.jsx main component
    - Set up basic layout with Sidebar and ChatWindow
    - Initialize ChatProvider
    - Handle navigation between conversations
    - _Requirements: 2.1, 3.1, 3.2_
  
  - [ ] 16.2 Add responsive design for mobile
    - Use Tailwind CSS responsive classes
    - Ensure layout works on 320px and above
    - _Requirements: 2.5_

- [ ] 17. Implement frontend API integration
  - [ ] 17.1 Implement send message flow
    - User types message and clicks send
    - Validate message on frontend
    - Call backend POST /api/chat
    - Display user message immediately
    - Show loading animation
    - Display AI response when received
    - Update conversation in database
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.6_
  
  - [ ] 17.2 Implement load conversations flow
    - On app mount, call GET /api/conversations
    - Display list in sidebar
    - _Requirements: 3.3, 4.2_
  
  - [ ] 17.3 Implement switch conversation flow
    - When user clicks conversation in sidebar
    - Call GET /api/conversations/{id}
    - Load and display all messages
    - Update current conversation state
    - _Requirements: 3.4, 4.2, 12.4_
  
  - [ ] 17.4 Implement create new conversation flow
    - When user clicks "New Chat" button
    - Call POST /api/conversations/new
    - Clear message list
    - Set as current conversation
    - _Requirements: 3.6, 12.1, 12.2_
  
  - [ ] 17.5 Implement delete conversation flow
    - When user clicks delete button
    - Call DELETE /api/conversations/{id}
    - Remove from sidebar
    - Switch to another conversation or create new one
    - _Requirements: 3.5, 4.2_

- [ ] 18. Implement error handling and user feedback
  - [ ] 18.1 Add error message display in UI
    - Show network errors: "Network error. Please try again."
    - Show AI unavailable: "AI service is currently unavailable"
    - Show message too long: "Message is too long (max 2000 characters)"
    - Show empty message: "Message cannot be empty"
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 18.2 Add frontend error logging
    - Log errors to browser console for debugging
    - _Requirements: 11.5_

- [ ] 19. Checkpoint - Frontend integration complete
  - Ensure all frontend components render correctly
  - Test all API calls end-to-end
  - Verify error handling in UI
  - Ask the user if questions arise

- [ ] 20. Optimize for low-RAM systems
  - [ ] 20.1 Implement lazy-loading for messages
    - Load 50 messages at a time
    - Load more when user scrolls up
    - _Requirements: 7.4_
  
  - [ ] 20.2 Verify frontend bundle size
    - Build production bundle
    - Verify gzipped size is under 500KB
    - Optimize if needed (tree-shaking, code splitting)
    - _Requirements: 7.1_
  
  - [ ] 20.3 Verify backend memory usage
    - Ensure conversations not loaded all at once
    - Verify pagination working correctly
    - _Requirements: 7.2, 7.3_

- [ ] 21. Write comprehensive unit tests for backend
  - [ ] 21.1 Write unit tests for ValidationService
    - Test message validation with various inputs
    - Test UUID validation
    - Test input sanitization
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 21.2 Write unit tests for ConversationService
    - Test CRUD operations with mocked repository
    - Test pagination
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 21.3 Write unit tests for ChatService
    - Test context building
    - Test Ollama response parsing
    - _Requirements: 5.1, 5.2_
  
  - [ ] 21.4 Write unit tests for Controllers
    - Test endpoint responses with mocked services
    - Test error handling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 22. Write integration tests for backend
  - [ ] 22.1 Write integration tests for full chat flow
    - Test: send message → save to DB → retrieve from DB
    - Test with real H2 database
    - _Requirements: 1.1, 3.2, 4.3_
  
  - [ ] 22.2 Write integration tests for conversation management
    - Test: create conversation → add messages → retrieve → delete
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 22.3 Write integration tests for error scenarios
    - Test Ollama unavailable (503)
    - Test validation errors (400)
    - Test not found errors (404)
    - _Requirements: 1.5, 1.6, 6.1_

- [ ] 23. Write frontend component tests
  - [ ] 23.1 Write snapshot tests for components
    - Test MessageBubble, ChatWindow, InputBox, Sidebar
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 23.2 Write tests for API client
    - Test request/response handling with mocked axios
    - _Requirements: 1.1, 3.3, 3.4, 3.5, 3.6_

- [ ] 24. Final checkpoint - All tests pass
  - Ensure all unit tests pass
  - Ensure all integration tests pass
  - Ensure all frontend tests pass
  - Ask the user if questions arise

- [ ] 25. Performance testing and optimization
  - [ ] 25.1 Test with 1000+ conversations
    - Verify pagination works correctly
    - Verify no memory leaks
    - _Requirements: 7.2, 7.3_
  
  - [ ] 25.2 Test message response time
    - Verify message display within 500ms of receiving response
    - _Requirements: 2.6_
  
  - [ ] 25.3 Test frontend load time
    - Verify initial page load under 2 seconds
    - _Requirements: 2.1_

- [ ] 26. Final integration and end-to-end testing
  - [ ] 26.1 Test complete user flow
    - Start app → send message → receive response → save conversation
    - Switch conversations → delete conversation → create new conversation
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 26.2 Test error scenarios end-to-end
    - Test with Ollama unavailable
    - Test with invalid input
    - Test with network errors
    - _Requirements: 1.5, 1.6, 6.1, 6.2, 6.3, 6.4_

- [ ] 27. Final checkpoint - Feature complete
  - Ensure all tests pass
  - Verify all requirements met
  - Test on low-RAM system
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP, but are recommended for production quality
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for course correction
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end flows
- Backend and frontend can be developed in parallel after task 12
- All code should follow existing project conventions and style

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "13.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "14.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "3.1", "3.2", "3.3", "3.4", "3.5"] },
    { "id": 3, "tasks": ["3.6", "3.7", "4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4"] },
    { "id": 7, "tasks": ["7.5", "7.6", "7.7", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] },
    { "id": 8, "tasks": ["8.7", "8.8", "8.9", "9.1", "9.2"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "11.1"] },
    { "id": 10, "tasks": ["13.2", "13.3", "14.2", "14.3"] },
    { "id": 11, "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5"] },
    { "id": 12, "tasks": ["16.1", "16.2"] },
    { "id": 13, "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5"] },
    { "id": 14, "tasks": ["18.1", "18.2"] },
    { "id": 15, "tasks": ["20.1", "20.2", "20.3"] },
    { "id": 16, "tasks": ["21.1", "21.2", "21.3", "21.4"] },
    { "id": 17, "tasks": ["22.1", "22.2", "22.3"] },
    { "id": 18, "tasks": ["23.1", "23.2"] },
    { "id": 19, "tasks": ["25.1", "25.2", "25.3"] },
    { "id": 20, "tasks": ["26.1", "26.2"] }
  ]
}
```
