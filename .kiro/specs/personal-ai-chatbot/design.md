# Personal AI Chatbot - Technical Design

## Overview

This design extends the existing Spring Boot backend with a modern React frontend, persistent chat history, and conversation management. The system maintains a lightweight architecture optimized for low-RAM systems while providing a smooth conversational experience.

**Key Design Goals:**
- Extend existing Spring Boot backend (no rebuild)
- Lightweight, beginner-friendly implementation
- Persistent chat history with conversation management
- Conversation context for better AI responses
- Graceful error handling and validation
- Optimized for low-RAM systems

**Technology Stack:**
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, H2 or MongoDB
- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **AI Service:** Ollama (localhost:11434) with gemma:2b model

---

## Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                   (Port 5173 / Static)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────┐
│                  Spring Boot Backend                        │
│                   (Port 7070)                               │
├─────────────────────────────────────────────────────────────┤
│  Controllers                                                │
│  ├─ ChatController (POST /api/chat)                        │
│  ├─ ConversationController (GET/POST/DELETE /api/...)      │
│  └─ HealthController (GET /api/health)                     │
├─────────────────────────────────────────────────────────────┤
│  Services                                                   │
│  ├─ ChatService (message handling, context management)     │
│  ├─ ConversationService (CRUD operations)                  │
│  └─ ValidationService (input validation)                   │
├─────────────────────────────────────────────────────────────┤
│  Repositories (Spring Data JPA)                            │
│  ├─ ConversationRepository                                 │
│  └─ MessageRepository                                      │
├─────────────────────────────────────────────────────────────┤
│  Models/Entities                                            │
│  ├─ Conversation                                            │
│  └─ Message                                                │
├─────────────────────────────────────────────────────────────┤
│  DTOs                                                       │
│  ├─ ChatRequestDTO                                         │
│  ├─ ChatResponseDTO                                        │
│  ├─ MessageDTO                                             │
│  └─ ConversationDTO                                        │
├─────────────────────────────────────────────────────────────┤
│  Exception Handling                                         │
│  ├─ GlobalExceptionHandler                                 │
│  ├─ OllamaException                                        │
│  └─ ValidationException                                    │
├─────────────────────────────────────────────────────────────┤
│  Configuration                                              │
│  ├─ CorsConfig                                             │
│  ├─ DatabaseConfig                                         │
│  └─ RestTemplateConfig                                     │
└─────────────────────────────────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────────┐
│              Ollama API (localhost:11434)                   │
│              gemma:2b Language Model                        │
└─────────────────────────────────────────────────────────────┘

                         │ File I/O
┌────────────────────────▼────────────────────────────────────┐
│         Local Database (H2 or MongoDB)                      │
│  ├─ Conversations Table                                    │
│  └─ Messages Table                                         │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.jsx                                │
│              (Main component, routing)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼──────────┐ ┌──▼──────────────┐
│  Sidebar.jsx   │ │ ChatWindow.jsx│ │ InputBox.jsx    │
│ (Conversation  │ │ (Message      │ │ (Message input, │
│  list, new     │ │  display,     │ │  send button)   │
│  chat button)  │ │  auto-scroll) │ │                 │
└────────────────┘ └────┬──────────┘ └─────────────────┘
                        │
                   ┌────▼──────────┐
                   │MessageBubble   │
                   │.jsx            │
                   │(Individual     │
                   │message display)│
                   └────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Context API (State Management)                 │
│  ├─ conversations: []                                       │
│  ├─ currentConversation: {}                                │
│  ├─ messages: []                                           │
│  ├─ loading: boolean                                       │
│  └─ error: string                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              API Client (Axios)                             │
│  ├─ POST /api/chat                                         │
│  ├─ GET /api/conversations                                 │
│  ├─ GET /api/conversations/{id}                            │
│  ├─ POST /api/conversations/new                            │
│  └─ DELETE /api/conversations/{id}                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Backend Components

#### 1. Controllers

**ChatController**
```java
POST /api/chat
Request: { conversationId: UUID, message: String }
Response: { success: boolean, data: { response: String, messageId: UUID, timestamp: LocalDateTime } }
Status: 200 (success), 400 (validation error), 503 (Ollama unavailable)
```

**ConversationController**
```java
GET /api/conversations
Response: { success: boolean, data: [{ id, title, createdAt, lastMessageAt, messageCount }] }
Status: 200

GET /api/conversations/{id}
Response: { success: boolean, data: { conversation: {...}, messages: [...] } }
Status: 200, 404 (not found)

POST /api/conversations/new
Response: { success: boolean, data: { conversationId: UUID, title: String } }
Status: 201

DELETE /api/conversations/{id}
Response: { success: boolean, data: { message: "Deleted" } }
Status: 200, 404 (not found)
```

#### 2. Services

**ChatService**
- `askAI(String prompt, UUID conversationId)`: Send message to Ollama with context
- `buildContext(UUID conversationId)`: Format last 5-10 messages as context
- `parseOllamaResponse(String response)`: Extract text from Ollama JSON response
- Handles conversation memory management
- Logs response times and errors

**ConversationService**
- `createConversation()`: Create new conversation with UUID and timestamp
- `getConversation(UUID id)`: Retrieve conversation with all messages
- `getAllConversations()`: List all conversations (paginated)
- `deleteConversation(UUID id)`: Delete conversation and all messages
- `addMessage(UUID conversationId, Message message)`: Save message to database

**ValidationService**
- `validateMessage(String message)`: Check not empty, not whitespace, max 2000 chars
- `validateConversationId(String id)`: Validate UUID format
- `sanitizeInput(String input)`: Remove potential injection patterns
- Returns validation errors with specific details

#### 3. Models/Entities

**Conversation Entity**
```java
@Entity
public class Conversation {
    @Id
    private UUID id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private Integer messageCount;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;
}
```

**Message Entity**
```java
@Entity
public class Message {
    @Id
    private UUID id;
    
    @ManyToOne
    private Conversation conversation;
    
    @Enumerated(EnumType.STRING)
    private MessageSender sender; // USER or AI
    
    private String content;
    private LocalDateTime timestamp;
}

enum MessageSender {
    USER, AI
}
```

#### 4. DTOs

**ChatRequestDTO**
```java
public record ChatRequestDTO(
    UUID conversationId,
    String message
) {}
```

**ChatResponseDTO**
```java
public record ChatResponseDTO(
    boolean success,
    ChatResponseData data
) {}

public record ChatResponseData(
    String response,
    UUID messageId,
    LocalDateTime timestamp
) {}
```

**MessageDTO**
```java
public record MessageDTO(
    UUID id,
    UUID conversationId,
    String sender, // "USER" or "AI"
    String content,
    LocalDateTime timestamp
) {}
```

**ConversationDTO**
```java
public record ConversationDTO(
    UUID id,
    String title,
    LocalDateTime createdAt,
    LocalDateTime lastMessageAt,
    Integer messageCount
) {}
```

#### 5. Exception Handling

**Custom Exceptions**
```java
public class OllamaException extends RuntimeException { }
public class ValidationException extends RuntimeException { }
public class ConversationNotFoundException extends RuntimeException { }
```

**GlobalExceptionHandler**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(false, e.getMessage()));
    }
    
    @ExceptionHandler(OllamaException.class)
    public ResponseEntity<?> handleOllama(OllamaException e) {
        return ResponseEntity.status(503)
            .body(new ErrorResponse(false, "AI service unavailable"));
    }
    
    @ExceptionHandler(ConversationNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ConversationNotFoundException e) {
        return ResponseEntity.status(404)
            .body(new ErrorResponse(false, e.getMessage()));
    }
}
```

#### 6. Configuration

**CorsConfig**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true);
    }
}
```

**DatabaseConfig**
```java
@Configuration
public class DatabaseConfig {
    // H2 configuration (embedded, no setup needed)
    // Or MongoDB configuration if user prefers
}
```

### Frontend Components

**App.jsx**
- Main component, manages routing
- Initializes Context API
- Loads conversations on mount
- Handles navigation between chat and conversation list

**Sidebar.jsx**
- Displays list of conversations
- "New Chat" button
- Highlights current conversation
- Click to switch conversations
- Delete conversation button

**ChatWindow.jsx**
- Displays messages in chronological order
- User messages on right, AI messages on left
- Auto-scrolls to latest message
- Shows loading animation while waiting for response
- Displays error messages

**InputBox.jsx**
- Text input field
- Send button
- Character counter (shows when near 2000 limit)
- Prevents sending empty messages
- Shows validation errors

**MessageBubble.jsx**
- Individual message display
- Shows sender (User/AI)
- Shows timestamp
- Formats message content
- Different styling for user vs AI messages

**LoadingAnimation.jsx**
- Typing indicator animation
- Shows while waiting for AI response

---

## Data Models

### Database Schema

**Conversations Table**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0
);
```

**Messages Table**
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender VARCHAR(10) NOT NULL, -- 'USER' or 'AI'
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
```

### API Response Format

**Success Response**
```json
{
    "success": true,
    "data": {
        // endpoint-specific data
    }
}
```

**Error Response**
```json
{
    "success": false,
    "error": "Descriptive error message"
}
```

### Conversation Memory Format

When sending to Ollama, format context as:
```
Previous context:
User: [message 1]
AI: [message 2]
User: [message 3]
...
User: [current message]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Message Validation Rejects Invalid Input

*For any* string input, if the string is empty, contains only whitespace, or exceeds 2000 characters, the validation service SHALL reject it and return a validation error.

**Validates: Requirements 1.2, 10.1, 10.2**

### Property 2: Unique Conversation IDs

*For any* set of newly created conversations, each conversation SHALL have a unique UUID that differs from all others in the set.

**Validates: Requirements 3.1**

### Property 3: Message Persistence Round Trip

*For any* message sent to the system, if the message is valid and successfully processed, querying the database for that conversation SHALL return the message with identical content, sender, and timestamp.

**Validates: Requirements 3.2, 4.3**

### Property 4: Conversation Context Isolation

*For any* two different conversations, messages from one conversation SHALL never appear in the message list of the other conversation.

**Validates: Requirements 12.5**

### Property 5: Context Window Limit

*For any* conversation with more than 10 messages, when sending a message to Ollama, the context SHALL include at most the 10 most recent messages (excluding the current message).

**Validates: Requirements 5.1, 5.4**

### Property 6: Context Reset on New Conversation

*For any* newly created conversation, the conversation context SHALL be empty (no previous messages to include).

**Validates: Requirements 5.3**

### Property 7: Pagination Correctness

*For any* set of conversations and any page number, the paginated response SHALL return exactly 20 conversations (or fewer on the last page) and SHALL not duplicate conversations across pages.

**Validates: Requirements 7.3**

### Property 8: JSON Response Format

*For any* successful API request, the response body SHALL be valid JSON and SHALL contain a "success" field set to true and a "data" field containing the response payload.

**Validates: Requirements 8.1, 8.2**

### Property 9: Error Response Format

*For any* failed API request, the response body SHALL be valid JSON and SHALL contain a "success" field set to false and an "error" field containing a descriptive error message.

**Validates: Requirements 8.3**

### Property 10: HTTP Status Codes

*For any* API request, the response SHALL include an appropriate HTTP status code: 200 for success, 400 for validation errors, 404 for not found, 503 for service unavailable.

**Validates: Requirements 8.4**

### Property 11: Message Timestamps

*For any* message stored in the database, the message SHALL have a non-null timestamp field that represents the time the message was created.

**Validates: Requirements 8.5**

### Property 12: Input Sanitization

*For any* string input containing potential injection patterns (e.g., SQL keywords, script tags), the sanitization function SHALL remove or escape these patterns before processing.

**Validates: Requirements 10.3**

### Property 13: UUID Validation

*For any* string claimed to be a UUID, if the string does not match the UUID format (8-4-4-4-12 hexadecimal digits), the validation SHALL reject it.

**Validates: Requirements 10.4**

### Property 14: Validation Error Details

*For any* validation failure, the error response SHALL include specific details about which field failed validation and why (e.g., "message is empty" or "message exceeds 2000 characters").

**Validates: Requirements 10.5**

### Property 15: Message Formatting for Context

*For any* conversation history, when formatted for Ollama, the formatted string SHALL preserve the order of messages, include both user and AI messages, and be human-readable.

**Validates: Requirements 5.2**

---

## Error Handling

### Error Scenarios and Responses

| Scenario | HTTP Status | Response | Frontend Display |
|----------|------------|----------|------------------|
| Empty message | 400 | `{ "success": false, "error": "Message cannot be empty" }` | "Message cannot be empty" |
| Message > 2000 chars | 400 | `{ "success": false, "error": "Message exceeds 2000 characters" }` | "Message is too long (max 2000 characters)" |
| Invalid UUID | 400 | `{ "success": false, "error": "Invalid conversation ID format" }` | "Invalid conversation ID" |
| Conversation not found | 404 | `{ "success": false, "error": "Conversation not found" }` | "Conversation not found" |
| Ollama unavailable | 503 | `{ "success": false, "error": "AI service unavailable" }` | "AI service is currently unavailable" |
| Network error | N/A | N/A | "Network error. Please try again." |
| Database error | 500 | `{ "success": false, "error": "Internal server error" }` | "Something went wrong. Please try again." |

### Logging Strategy

**Backend Logging (SLF4J with Logback)**
- INFO: All incoming requests with endpoint and timestamp
- INFO: AI responses with response time
- WARN: Validation failures
- ERROR: Exceptions with stack traces
- DEBUG: Database operations (optional)

**Frontend Logging**
- Console errors for debugging
- User-friendly error messages in UI

---

## Testing Strategy

### Unit Tests (Example-Based)

**Backend Unit Tests**
- ChatService: Test message formatting, context building, Ollama response parsing
- ConversationService: Test CRUD operations with mocked repository
- ValidationService: Test validation logic with specific examples
- Controllers: Test endpoint responses with mocked services

**Frontend Unit Tests**
- Components: Snapshot tests for UI rendering
- Context: Test state management with example scenarios
- API client: Test request/response handling with mocked axios

### Property-Based Tests

**Backend Property Tests** (minimum 100 iterations each)
- **Feature: personal-ai-chatbot, Property 1**: Message validation rejects invalid input
- **Feature: personal-ai-chatbot, Property 2**: Unique conversation IDs
- **Feature: personal-ai-chatbot, Property 3**: Message persistence round trip
- **Feature: personal-ai-chatbot, Property 4**: Conversation context isolation
- **Feature: personal-ai-chatbot, Property 5**: Context window limit
- **Feature: personal-ai-chatbot, Property 6**: Context reset on new conversation
- **Feature: personal-ai-chatbot, Property 7**: Pagination correctness
- **Feature: personal-ai-chatbot, Property 8**: JSON response format
- **Feature: personal-ai-chatbot, Property 9**: Error response format
- **Feature: personal-ai-chatbot, Property 10**: HTTP status codes
- **Feature: personal-ai-chatbot, Property 11**: Message timestamps
- **Feature: personal-ai-chatbot, Property 12**: Input sanitization
- **Feature: personal-ai-chatbot, Property 13**: UUID validation
- **Feature: personal-ai-chatbot, Property 14**: Validation error details
- **Feature: personal-ai-chatbot, Property 15**: Message formatting for context

### Integration Tests

- Test full flow: send message → save to DB → retrieve from DB
- Test Ollama integration with mocked responses
- Test API endpoints with real database (H2)
- Test error handling with simulated failures

### Performance Tests

- Verify frontend bundle size < 500KB (gzipped)
- Verify message response time < 500ms (excluding Ollama)
- Verify pagination with 1000+ conversations
- Monitor memory usage with many conversations

---

## Implementation Sequence

### Phase 1: Backend Improvements (Week 1)
1. Add Spring Data JPA and H2 dependencies to pom.xml
2. Create Message and Conversation entities
3. Create MessageRepository and ConversationRepository
4. Create DTOs (ChatRequestDTO, ChatResponseDTO, MessageDTO, ConversationDTO)
5. Create ValidationService with input validation logic
6. Create ConversationService with CRUD operations
7. Enhance ChatService with conversation memory and context building
8. Create GlobalExceptionHandler for consistent error responses
9. Create CorsConfig for frontend communication
10. Add logging with SLF4J

### Phase 2: Backend API Endpoints (Week 1-2)
1. Enhance ChatController with POST /api/chat endpoint
2. Create ConversationController with GET/POST/DELETE endpoints
3. Add request/response validation
4. Test all endpoints with Postman or curl
5. Add error handling for all scenarios

### Phase 3: Frontend Setup (Week 2)
1. Create React + Vite project
2. Set up Tailwind CSS
3. Create basic component structure
4. Set up Axios API client
5. Implement Context API for state management

### Phase 4: Frontend Components (Week 2-3)
1. Create Sidebar component with conversation list
2. Create ChatWindow component with message display
3. Create InputBox component with validation
4. Create MessageBubble component
5. Create LoadingAnimation component
6. Implement auto-scroll and responsive design

### Phase 5: Integration (Week 3)
1. Connect frontend to backend APIs
2. Test all endpoints end-to-end
3. Add error handling in frontend
4. Add loading states and animations
5. Test on low-RAM system

### Phase 6: Testing (Week 3-4)
1. Write unit tests for backend services
2. Write property-based tests for validation and data handling
3. Write integration tests for full flows
4. Write frontend component tests
5. Performance testing and optimization

### Phase 7: Polish (Week 4)
1. Optimize bundle size
2. Add animations and transitions
3. Improve UI/UX based on testing
4. Documentation and code comments
5. Final testing and deployment

---

## Key Design Decisions

1. **Extend existing backend**: Build on ChatService and ChatController rather than rebuilding
2. **H2 for quick start**: Embedded database requires no setup; easy to switch to MongoDB later
3. **React Context API**: Simple state management without Redux complexity
4. **In-memory context**: Store last 5-10 messages in memory for fast context building
5. **Tailwind CSS**: Minimal CSS, fast styling, responsive by default
6. **Simple API responses**: Consistent JSON format for all endpoints
7. **SLF4J logging**: Standard Spring Boot logging, no complex structured logging
8. **Validation at service layer**: Centralized validation logic in ValidationService
9. **DTOs for API**: Clean separation between entities and API responses
10. **Pagination for scalability**: Load conversations in pages to optimize memory

---

## Deployment

### Backend Deployment
```bash
# Build
mvn clean package

# Run
java -jar target/OfflineChatGPT-0.0.1-SNAPSHOT.jar
# Runs on http://localhost:7070
```

### Frontend Deployment
```bash
# Development
npm run dev
# Runs on http://localhost:5173

# Production build
npm run build
# Output in dist/ folder
# Serve from Spring Boot static folder or separate web server
```

### Database
- **H2**: Embedded in Spring Boot, file stored in project directory
- **MongoDB**: Optional, requires separate installation and configuration

### Ollama
- Must be running on localhost:11434
- Ensure gemma:2b model is downloaded: `ollama pull gemma:2b`

---

## Performance Considerations

- **Frontend**: Lazy-load messages (50 at a time), paginate conversations (20 per page)
- **Backend**: Use database indexes on conversationId and timestamp
- **Memory**: Don't load all conversations into memory; use pagination
- **Caching**: Cache current conversation in memory; clear on switch
- **Connection pooling**: Configure database connection pool for efficiency

---

## Future Enhancements

- User authentication and multi-user support
- Search conversations by content
- Export conversations as PDF or text
- Conversation tagging and organization
- Custom AI model selection
- Message editing and deletion
- Conversation sharing
- Dark/light theme toggle
- Mobile app (React Native)
