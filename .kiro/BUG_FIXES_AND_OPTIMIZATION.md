# Bug Fixes & Optimization Guide

## Common Issues & Solutions

---

## Frontend Issues

### Issue 1: Messages Not Appearing

**Symptoms**: Send message but nothing appears in chat window

**Possible Causes**:
1. API not responding
2. State not updating
3. Component not re-rendering
4. Message not added to state

**Solutions**:

Check browser console for errors:
```javascript
// In browser DevTools Console
console.log('Messages:', messages);
console.log('Loading:', loading);
console.log('Error:', error);
```

Check network tab:
- Verify POST request to /api/chat
- Check response status (should be 200)
- Check response body

Fix: Ensure useChat hook is properly updating state:
```javascript
// In useChat.js - verify this code exists
setMessages((prev) => [...prev, userMsg]);
```

### Issue 2: Loading Spinner Stuck

**Symptoms**: Loading spinner never disappears, can't send more messages

**Possible Causes**:
1. API request hanging
2. Loading state not being set to false
3. Error in response handling

**Solutions**:

Check network tab:
- See if request is still pending
- Check if response was received
- Check response time

Fix: Ensure loading state is cleared:
```javascript
// In useChat.js - verify finally block exists
finally {
  setLoading(false);
}
```

Increase timeout if Ollama is slow:
```javascript
// In apiClient.js
timeout: 60000,  // Increase to 60 seconds
```

### Issue 3: Input Field Not Responding

**Symptoms**: Can't type in input field or send button doesn't work

**Possible Causes**:
1. Input disabled while loading
2. Send button disabled
3. Event handler not working
4. State not updating

**Solutions**:

Check if input is disabled:
```javascript
// In InputBox.jsx - verify disabled prop
disabled={loading}
```

Check if send button is disabled:
```javascript
// In InputBox.jsx - verify disabled prop
disabled={!message.trim() || loading}
```

Verify event handlers:
```javascript
// In InputBox.jsx - verify these exist
const handleChange = (e) => { ... }
const handleSend = () => { ... }
const handleKeyPress = (e) => { ... }
```

### Issue 4: Sidebar Not Updating

**Symptoms**: Sidebar doesn't show current conversation or new chat button doesn't work

**Possible Causes**:
1. Props not passed correctly
2. State not updating
3. Component not re-rendering

**Solutions**:

Verify props are passed:
```javascript
// In App.jsx
<Sidebar onNewChat={handleNewChat} conversationId={conversationId} />
```

Verify handler is called:
```javascript
// In App.jsx
const handleNewChat = () => {
  clearChat();
};
```

### Issue 5: Scroll Not Working

**Symptoms**: Chat doesn't auto-scroll to latest message

**Possible Causes**:
1. useRef not working
2. scrollIntoView not called
3. useEffect dependency missing

**Solutions**:

Verify useRef is created:
```javascript
// In ChatWindow.jsx
const messagesEndRef = useRef(null);
```

Verify useEffect scrolls:
```javascript
// In ChatWindow.jsx
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, loading]);
```

Verify ref is attached:
```javascript
// In ChatWindow.jsx
<div ref={messagesEndRef} />
```

### Issue 6: Responsive Layout Broken

**Symptoms**: Layout looks wrong on mobile or tablet

**Possible Causes**:
1. CSS media queries not working
2. Viewport meta tag missing
3. CSS not loaded

**Solutions**:

Verify viewport meta tag in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Check CSS media queries:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

Clear browser cache and reload:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue 7: Animations Stuttering

**Symptoms**: Animations are not smooth, appear to stutter

**Possible Causes**:
1. Too many re-renders
2. Heavy CSS animations
3. Browser performance issue

**Solutions**:

Optimize animations:
```css
/* Use transform instead of position */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);  /* Good */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Reduce animation duration:
```css
animation: slideIn 0.2s ease-out;  /* Reduce from 0.3s */
```

Disable animations on low-end devices:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

### Issue 8: Memory Leaks

**Symptoms**: App gets slower over time, memory usage increases

**Possible Causes**:
1. Event listeners not cleaned up
2. Timers not cleared
3. Refs not cleared

**Solutions**:

Check for cleanup in useEffect:
```javascript
useEffect(() => {
  // Setup
  const handler = () => { ... };
  window.addEventListener('resize', handler);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

Monitor memory in DevTools:
- Open DevTools
- Go to Memory tab
- Take heap snapshot
- Look for growing objects

---

## Backend Issues

### Issue 1: API Not Responding

**Symptoms**: Frontend gets network error, can't reach backend

**Possible Causes**:
1. Backend not running
2. Wrong port
3. CORS not configured
4. Firewall blocking

**Solutions**:

Verify backend is running:
```bash
curl http://localhost:7070/api/health
```

Check port is correct:
```bash
# In application.properties
server.port=7070
```

Verify CORS is configured:
```bash
# In CorsConfig.java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:5173")
```

Check firewall:
- Windows: Check Windows Defender Firewall
- Mac: Check System Preferences > Security & Privacy
- Linux: Check iptables or ufw

### Issue 2: Validation Not Working

**Symptoms**: Empty messages are accepted, long messages not rejected

**Possible Causes**:
1. Validation not called
2. Validation logic wrong
3. Exception not thrown

**Solutions**:

Verify validation is called:
```java
// In ChatService.java
validationService.validateMessage(prompt);
```

Check validation logic:
```java
// In ValidationService.java
if (message.isBlank()) {
    throw new ValidationException("Message cannot be empty");
}
```

Test validation:
```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test","message":""}'
```

### Issue 3: Error Handling Not Working

**Symptoms**: Errors not caught, stack traces returned to frontend

**Possible Causes**:
1. GlobalExceptionHandler not registered
2. Exception not caught
3. Wrong exception type

**Solutions**:

Verify GlobalExceptionHandler exists:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(OllamaException.class)
    public ResponseEntity<ErrorResponseDTO> handleOllamaException(...) {
        ...
    }
}
```

Verify exception is thrown:
```java
throw new OllamaException("Error message");
```

Test error handling:
```bash
# Stop Ollama, then send request
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test","message":"Hello"}'
```

### Issue 4: Ollama Connection Failing

**Symptoms**: 503 error, "AI service unavailable"

**Possible Causes**:
1. Ollama not running
2. Wrong Ollama URL
3. Ollama timeout
4. Network issue

**Solutions**:

Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

Check Ollama URL:
```properties
# In application.properties
ollama.api.url=http://localhost:11434/api/generate
```

Increase timeout:
```properties
ollama.timeout.read=60000  # Increase to 60 seconds
```

Check network:
```bash
ping localhost
```

### Issue 5: Response Parsing Failing

**Symptoms**: Empty response, parsing error

**Possible Causes**:
1. Ollama response format changed
2. JSON parsing error
3. Response field missing

**Solutions**:

Check Ollama response format:
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma:2b",
    "prompt": "Hello",
    "stream": false
  }'
```

Verify parsing logic:
```java
// In ChatService.java
JsonNode root = objectMapper.readTree(responseBody);
String response = root.path("response").asText();
```

Add logging:
```java
logger.debug("Ollama response: {}", responseBody);
```

### Issue 6: Logging Not Working

**Symptoms**: No logs in console, can't debug

**Possible Causes**:
1. Logger not initialized
2. Log level too high
3. Logs not configured

**Solutions**:

Verify logger is created:
```java
private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
```

Check log level:
```properties
# In application.properties
logging.level.root=INFO
logging.level.com.chatgpt.ai=DEBUG
```

Check logs:
```bash
# In IDE console or
tail -f logs/application.log
```

### Issue 7: CORS Not Working

**Symptoms**: Browser CORS error, frontend can't reach backend

**Possible Causes**:
1. CORS not configured
2. Wrong origin
3. Wrong methods

**Solutions**:

Verify CORS config:
```java
// In CorsConfig.java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
```

Test CORS:
```bash
curl -X OPTIONS http://localhost:7070/api/chat \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Check response headers:
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers

---

## Integration Issues

### Issue 1: Frontend Can't Reach Backend

**Symptoms**: Network error, connection refused

**Possible Causes**:
1. Backend not running
2. Wrong URL
3. Port mismatch
4. Firewall blocking

**Solutions**:

Verify backend URL:
```javascript
// In apiClient.js
const API_BASE_URL = 'http://localhost:7070/api';
```

Test connection:
```bash
curl http://localhost:7070/api/health
```

Check firewall:
- Ensure port 7070 is open
- Disable firewall temporarily to test

### Issue 2: Response Format Mismatch

**Symptoms**: Frontend can't parse response, error in console

**Possible Causes**:
1. Backend response format changed
2. Frontend parsing wrong
3. API contract mismatch

**Solutions**:

Verify response format:
```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test","message":"Hello"}'
```

Check frontend parsing:
```javascript
// In apiClient.js
if (response.data.success) {
    return {
        success: true,
        response: response.data.response,
        ...
    };
}
```

### Issue 3: State Not Syncing

**Symptoms**: Frontend state doesn't match backend state

**Possible Causes**:
1. State not updated after API call
2. Race condition
3. Async issue

**Solutions**:

Verify state update:
```javascript
// In useChat.js
const response = await postChat(conversationId, message);
if (response.success) {
    const aiMsg = { ... };
    setMessages((prev) => [...prev, aiMsg]);
}
```

Add logging:
```javascript
console.log('Before:', messages);
console.log('After:', messages);
```

### Issue 4: Error Handling Not Working

**Symptoms**: Errors not displayed, app crashes

**Possible Causes**:
1. Error not caught
2. Error state not set
3. Error not displayed

**Solutions**:

Verify error is caught:
```javascript
// In useChat.js
catch (err) {
    setError('Failed to get response');
}
```

Verify error is displayed:
```javascript
// In ChatWindow.jsx
{error && (
    <div className="error-message">
        <p>⚠️ {error}</p>
    </div>
)}
```

### Issue 5: Loading States Not Working

**Symptoms**: Loading spinner doesn't appear, UI not responsive

**Possible Causes**:
1. Loading state not set
2. Loading state not displayed
3. Loading state not cleared

**Solutions**:

Verify loading state is set:
```javascript
// In useChat.js
setLoading(true);
// ... API call ...
setLoading(false);
```

Verify loading is displayed:
```javascript
// In ChatWindow.jsx
{loading && <LoadingSpinner />}
```

---

## Performance Optimization

### Frontend Optimization

#### 1. Reduce Re-renders
```javascript
// Use useCallback to memoize functions
const sendMessage = useCallback(async (message) => {
    // ...
}, [conversationId]);

// Use useMemo for expensive computations
const sortedMessages = useMemo(() => {
    return messages.sort(...);
}, [messages]);
```

#### 2. Optimize CSS
```css
/* Use transform instead of position */
transform: translateX(10px);  /* Good */
left: 10px;  /* Bad - causes reflow */

/* Use will-change sparingly */
.message-bubble {
    will-change: transform;
}
```

#### 3. Lazy Load Components
```javascript
// Use React.lazy for code splitting
const ChatWindow = React.lazy(() => import('./ChatWindow'));

// Use Suspense for loading state
<Suspense fallback={<div>Loading...</div>}>
    <ChatWindow />
</Suspense>
```

#### 4. Minimize Bundle Size
```bash
# Check bundle size
npm run build

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

### Backend Optimization

#### 1. Cache Responses
```java
// Cache Ollama responses
@Cacheable("chatResponses")
public String askAI(String prompt) {
    // ...
}
```

#### 2. Reduce Logging
```java
// Only log important events
logger.info("Chat request received");  // Good
logger.debug("Processing message");    // Debug only
```

#### 3. Optimize JSON Parsing
```java
// Use ObjectMapper efficiently
private final ObjectMapper objectMapper = new ObjectMapper();

// Reuse instead of creating new instances
JsonNode root = objectMapper.readTree(responseBody);
```

---

## Code Quality Improvements

### Frontend Code Quality

#### Remove Unused Code
```javascript
// Remove unused imports
// import { unused } from 'module';  // Remove this

// Remove unused variables
// const unused = 'value';  // Remove this

// Remove unused functions
// function unused() { }  // Remove this
```

#### Improve Readability
```javascript
// Bad
const m = (msg) => { setMessages([...messages, msg]); };

// Good
const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
};
```

#### Add Comments
```javascript
// Only add comments for complex logic
// Calculate message hash for deduplication
const hash = crypto.createHash('sha256').update(message).digest('hex');
```

### Backend Code Quality

#### Remove Unused Code
```java
// Remove unused imports
// import com.unused.Class;  // Remove this

// Remove unused methods
// private void unused() { }  // Remove this
```

#### Improve Readability
```java
// Bad
public String askAI(String p) {
    // ...
}

// Good
public String askAI(String prompt) {
    // ...
}
```

#### Add Comments
```java
// Only add comments for complex logic
// Escape JSON special characters to prevent injection
String escaped = input.replace("\"", "\\\"");
```

---

## Final Checklist

### Before Deployment
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] No unused code
- [ ] Comments added where needed

### Performance Targets
- [ ] Frontend load time < 2 seconds
- [ ] API response time < 5 seconds
- [ ] Memory usage < 150MB
- [ ] Bundle size < 200KB
- [ ] Animations 60 FPS

### User Experience
- [ ] Smooth scrolling
- [ ] Clear feedback
- [ ] Helpful errors
- [ ] Mobile friendly
- [ ] Professional appearance
- [ ] Accessible

---

**Bug Fixes & Optimization Complete!**
