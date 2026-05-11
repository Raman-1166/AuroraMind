# Personal AI Chatbot - Requirements Document

## Introduction

This document defines requirements for extending the existing offline AI chatbot with a modern React frontend, improved backend API, and persistent chat history. The system is designed for personal use on low-RAM laptops, using Ollama with gemma:2b as the AI backbone. The focus is on simplicity, performance, and a smooth conversational experience without enterprise-level complexity.

## Glossary

- **User**: A person interacting with the chatbot through the React frontend
- **AI_Model**: The gemma:2b language model running locally via Ollama
- **Ollama**: Local AI inference engine running on localhost:11434
- **Chat_Message**: A single message in a conversation (either from User or AI)
- **Conversation**: A collection of Chat_Messages with a unique identifier and timestamp
- **Backend**: Spring Boot 3 REST API serving the frontend
- **Frontend**: React + Vite single-page application
- **Chat_History**: Persistent storage of past conversations
- **Conversation_Memory**: The last 5-10 messages sent to the AI for context

## Requirements

### Requirement 1: Send Chat Messages

**User Story:** As a user, I want to send messages to the AI, so that I can have a conversation.

#### Acceptance Criteria

1. WHEN the user enters text and clicks send, THE Backend SHALL accept the message via POST /api/chat
2. THE Backend SHALL validate that the message is not empty and not longer than 2000 characters
3. WHEN the message is valid, THE Backend SHALL send it to the AI_Model via Ollama
4. WHEN the AI_Model responds, THE Backend SHALL return the response to the Frontend with a 200 status code
5. IF the message is invalid, THE Backend SHALL return a 400 error with a descriptive message
6. IF Ollama is unavailable, THE Backend SHALL return a 503 error with message "AI service unavailable"

### Requirement 2: Display Chat Interface

**User Story:** As a user, I want to see a clean chat interface, so that I can easily read and send messages.

#### Acceptance Criteria

1. THE Frontend SHALL display a chat message list with User messages on the right and AI messages on the left
2. THE Frontend SHALL show a loading animation while waiting for the AI response
3. THE Frontend SHALL display a text input field with a send button at the bottom
4. THE Frontend SHALL use a dark theme by default
5. THE Frontend SHALL be responsive and work on mobile devices (320px and above)
6. THE Frontend SHALL auto-scroll to the latest message when a new message arrives

### Requirement 3: Manage Conversations

**User Story:** As a user, I want to save and organize my conversations, so that I can review past discussions.

#### Acceptance Criteria

1. WHEN the user starts a new chat, THE Backend SHALL create a new Conversation with a unique ID and timestamp
2. WHEN the user sends a message, THE Backend SHALL store both the User message and AI response in the Conversation
3. THE Backend SHALL provide GET /api/conversations to list all saved conversations with ID, title, and last message timestamp
4. THE Backend SHALL provide GET /api/conversations/{id} to retrieve a specific conversation with all messages
5. THE Backend SHALL provide DELETE /api/conversations/{id} to delete a conversation
6. THE Backend SHALL provide POST /api/conversations/new to create a new conversation

### Requirement 4: Persist Chat History

**User Story:** As a user, I want my conversations to be saved locally, so that I don't lose them when I close the app.

#### Acceptance Criteria

1. THE Backend SHALL store conversations in a local database (MongoDB or H2)
2. WHEN the application starts, THE Backend SHALL load all saved conversations from the database
3. WHEN a new message is sent, THE Backend SHALL immediately save it to the database
4. THE Frontend SHALL display a sidebar with a list of past conversations
5. WHEN the user clicks a past conversation, THE Frontend SHALL load and display all messages from that conversation
6. THE Frontend SHALL show a "Clear Conversation" button to delete the current conversation

### Requirement 5: Maintain Conversation Context

**User Story:** As a user, I want the AI to remember recent messages, so that it can provide contextual responses.

#### Acceptance Criteria

1. WHEN sending a message to the AI_Model, THE Backend SHALL include the last 5-10 messages from the current conversation as context
2. THE Backend SHALL format the conversation history in a readable format for the AI_Model
3. WHEN a new conversation starts, THE Backend SHALL reset the conversation context
4. THE Backend SHALL limit context to the most recent messages to optimize for low-RAM systems

### Requirement 6: Handle Errors Gracefully

**User Story:** As a user, I want clear error messages, so that I know what went wrong.

#### Acceptance Criteria

1. IF a network error occurs, THE Frontend SHALL display a user-friendly error message
2. IF the AI service is unavailable, THE Frontend SHALL show "AI service is currently unavailable"
3. IF the user's message is too long, THE Frontend SHALL show "Message is too long (max 2000 characters)"
4. IF the user tries to send an empty message, THE Frontend SHALL prevent sending and show a hint
5. THE Backend SHALL log all errors with timestamps for debugging

### Requirement 7: Optimize for Low-RAM Systems

**User Story:** As a user on a low-RAM laptop, I want the app to run smoothly, so that I can use it without lag.

#### Acceptance Criteria

1. THE Frontend bundle size SHALL be under 500KB (gzipped)
2. THE Backend SHALL not load all conversations into memory at once
3. WHEN retrieving conversations, THE Backend SHALL paginate results (20 conversations per page)
4. THE Frontend SHALL lazy-load conversation messages (load 50 messages at a time)
5. THE Backend SHALL close idle database connections after 5 minutes

### Requirement 8: Provide Simple API Response Format

**User Story:** As a developer, I want consistent API responses, so that the frontend can handle them predictably.

#### Acceptance Criteria

1. THE Backend SHALL return all responses in JSON format
2. WHEN a request succeeds, THE Backend SHALL return `{ "success": true, "data": {...} }`
3. WHEN a request fails, THE Backend SHALL return `{ "success": false, "error": "error message" }`
4. THE Backend SHALL include HTTP status codes (200, 400, 503, etc.) with all responses
5. THE Backend SHALL include timestamps in all Chat_Message objects

### Requirement 9: Create Data Transfer Objects

**User Story:** As a developer, I want clean data structures, so that the API is easy to understand and maintain.

#### Acceptance Criteria

1. THE Backend SHALL define a ChatRequest DTO with fields: conversationId, message
2. THE Backend SHALL define a ChatResponse DTO with fields: success, data (containing AI response and message ID)
3. THE Backend SHALL define a Message DTO with fields: id, conversationId, sender (USER or AI), content, timestamp
4. THE Backend SHALL define a Conversation DTO with fields: id, title, createdAt, lastMessageAt, messageCount

### Requirement 10: Validate User Input

**User Story:** As a developer, I want input validation, so that the system is robust and secure.

#### Acceptance Criteria

1. THE Backend SHALL reject messages that are empty or contain only whitespace
2. THE Backend SHALL reject messages longer than 2000 characters
3. THE Backend SHALL sanitize input to prevent injection attacks
4. THE Backend SHALL validate that conversationId is a valid UUID format
5. WHEN validation fails, THE Backend SHALL return a 400 error with specific validation error details

### Requirement 11: Add Basic Logging

**User Story:** As a developer, I want to see what the application is doing, so that I can debug issues.

#### Acceptance Criteria

1. THE Backend SHALL log all incoming requests with timestamp and endpoint
2. THE Backend SHALL log all AI responses with response time
3. THE Backend SHALL log all errors with stack traces
4. THE Backend SHALL log database operations (save, retrieve, delete)
5. THE Frontend SHALL log errors to the browser console for debugging

### Requirement 12: Support Multiple Conversations

**User Story:** As a user, I want to have multiple separate conversations, so that I can organize different topics.

#### Acceptance Criteria

1. THE Frontend SHALL display a "New Chat" button in the sidebar
2. WHEN the user clicks "New Chat", THE Frontend SHALL create a new conversation and clear the message list
3. THE Frontend SHALL highlight the currently active conversation in the sidebar
4. WHEN the user switches conversations, THE Frontend SHALL load the messages from that conversation
5. THE Backend SHALL maintain separate message histories for each conversation

## Non-Functional Requirements

### Performance
- Chat response time: AI response should arrive within 5-30 seconds (depends on Ollama performance)
- Frontend load time: Initial page load under 2 seconds
- Message display: New messages should appear on screen within 500ms of receiving response

### Compatibility
- Frontend: Works on Chrome, Firefox, Safari, Edge (latest versions)
- Backend: Runs on Windows, macOS, Linux with Java 17+
- Database: H2 (embedded, no setup) or MongoDB (optional)

### Scalability
- System designed for single-user, local use
- No need for multi-user support or distributed architecture
- Database should handle 1000+ conversations without performance degradation

### Maintainability
- Code should be simple and well-commented
- No complex design patterns or frameworks beyond Spring Boot and React
- Easy for beginners to understand and extend

