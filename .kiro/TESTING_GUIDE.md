# Testing Guide - Phase 1 Improvements

## Prerequisites

1. **Ollama running** on `http://localhost:11434`
   ```bash
   ollama serve
   ```

2. **Backend running** on `http://localhost:7070`
   ```bash
   mvn spring-boot:run
   ```

3. **curl installed** (for testing)

---

## Test Cases

### Test 1: Health Check
**Purpose**: Verify backend is running

```bash
curl http://localhost:7070/api/health
```

**Expected Response**:
```json
{"status":"UP"}
```

**Status Code**: 200 OK

---

### Test 2: Successful Chat Request
**Purpose**: Verify chat endpoint works with valid input

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": "Hello, how are you?"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "response": "I'm doing well, thank you for asking...",
  "messageId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00",
  "error": null
}
```

**Status Code**: 200 OK

---

### Test 3: Empty Message Validation
**Purpose**: Verify input validation catches empty messages

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": ""
  }'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Invalid request",
  "details": "Message cannot be empty or contain only whitespace",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Status Code**: 400 Bad Request

---

### Test 4: Whitespace-Only Message
**Purpose**: Verify validation catches whitespace-only messages

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": "   \t\n   "
  }'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Invalid request",
  "details": "Message cannot be empty or contain only whitespace",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Status Code**: 400 Bad Request

---

### Test 5: Message Too Long
**Purpose**: Verify validation catches messages exceeding 2000 characters

```bash
# Create a message with 2001 characters
MESSAGE=$(python3 -c "print('a' * 2001)")

curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"conversationId\": \"test-123\",
    \"message\": \"$MESSAGE\"
  }"
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Invalid request",
  "details": "Message is too long (max 2000 characters)",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Status Code**: 400 Bad Request

---

### Test 6: Ollama Connection Failure
**Purpose**: Verify error handling when Ollama is unavailable

**Steps**:
1. Stop Ollama service
2. Send a chat request

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": "Hello"
  }'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "AI service unavailable",
  "details": "The AI service is currently unavailable. Please try again later.",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Status Code**: 503 Service Unavailable

---

### Test 7: Special Characters in Message
**Purpose**: Verify JSON escaping works correctly

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": "What is \"hello\" in JSON? \n New line test"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "response": "...",
  "messageId": "...",
  "timestamp": "...",
  "error": null
}
```

**Status Code**: 200 OK

---

### Test 8: CORS Preflight Request
**Purpose**: Verify CORS is configured correctly

```bash
curl -X OPTIONS http://localhost:7070/api/chat \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response Headers**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

**Status Code**: 200 OK

---

### Test 9: Configuration Externalization
**Purpose**: Verify configuration is read from properties

**Check logs** for:
```
Calling Ollama API at: http://localhost:11434/api/generate
```

This confirms the URL is being read from `application.properties`

---

### Test 10: Logging Verification
**Purpose**: Verify logging is working

**Check console output** for:
```
INFO  - Received chat request
DEBUG - Calling Ollama API at: http://localhost:11434/api/generate
INFO  - AI response received in 1234ms
```

---

## Automated Test Script

Create `test.sh`:

```bash
#!/bin/bash

echo "=== Test 1: Health Check ==="
curl http://localhost:7070/api/health
echo -e "\n"

echo "=== Test 2: Valid Message ==="
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test-123","message":"Hello"}'
echo -e "\n"

echo "=== Test 3: Empty Message ==="
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test-123","message":""}'
echo -e "\n"

echo "=== Test 4: Whitespace Message ==="
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test-123","message":"   "}'
echo -e "\n"

echo "=== Test 5: Long Message ==="
LONG_MSG=$(python3 -c "print('a' * 2001)")
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"test-123\",\"message\":\"$LONG_MSG\"}"
echo -e "\n"

echo "=== All tests completed ==="
```

Run it:
```bash
chmod +x test.sh
./test.sh
```

---

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "Personal AI Chatbot API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:7070/api/health"
      }
    },
    {
      "name": "Chat - Valid Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"conversationId\":\"test-123\",\"message\":\"Hello\"}"
        },
        "url": "http://localhost:7070/api/chat"
      }
    },
    {
      "name": "Chat - Empty Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"conversationId\":\"test-123\",\"message\":\"\"}"
        },
        "url": "http://localhost:7070/api/chat"
      }
    }
  ]
}
```

---

## Debugging Tips

### 1. Check Ollama is Running
```bash
curl http://localhost:11434/api/tags
```

Should return list of available models.

### 2. Check Backend Logs
Look for:
- `Received chat request` - Request received
- `Calling Ollama API at:` - About to call Ollama
- `AI response received in Xms` - Response received
- `ERROR` - Any errors

### 3. Check Configuration
Verify `application.properties` has:
```properties
ollama.api.url=http://localhost:11434/api/generate
ollama.model=gemma:2b
```

### 4. Test with Different Models
Change `ollama.model` in `application.properties`:
```properties
ollama.model=llama2
```

Then restart backend and test.

### 5. Check Response Times
Look for log: `AI response received in Xms`

- < 1000ms: Good
- 1000-5000ms: Normal
- > 5000ms: Slow (check Ollama)

---

## Expected Behavior Summary

| Test | Input | Expected Status | Expected Error |
|------|-------|-----------------|-----------------|
| Valid message | "Hello" | 200 | None |
| Empty message | "" | 400 | "Message cannot be empty" |
| Whitespace | "   " | 400 | "Message cannot be empty" |
| Too long | 2001 chars | 400 | "Message is too long" |
| Ollama down | Any | 503 | "AI service unavailable" |
| Special chars | "\"test\"" | 200 | None |
| Health check | N/A | 200 | None |

---

## Performance Benchmarks

### Expected Response Times
- Health check: < 10ms
- Valid chat: 1000-5000ms (depends on Ollama)
- Validation error: < 50ms
- Ollama error: < 100ms

### Memory Usage
- Startup: ~200MB
- Per request: < 1MB (with reused RestTemplate)
- Idle: ~150MB

---

## Troubleshooting

### Issue: 503 Service Unavailable
**Cause**: Ollama not running
**Fix**: Start Ollama with `ollama serve`

### Issue: 400 Bad Request (unexpected)
**Cause**: Invalid JSON in request
**Fix**: Check JSON syntax, use Postman to validate

### Issue: Slow responses (> 10 seconds)
**Cause**: Ollama processing slow
**Fix**: Check Ollama logs, try smaller model

### Issue: CORS errors in browser
**Cause**: Frontend on different port
**Fix**: Verify CorsConfig is loaded, check frontend URL

### Issue: Connection timeout
**Cause**: Ollama taking too long
**Fix**: Increase timeout in `application.properties`

---

## Next Steps

After testing Phase 1 improvements:

1. ✅ Verify all tests pass
2. ✅ Check logs for errors
3. ✅ Monitor memory usage
4. ✅ Test with frontend (when ready)
5. ✅ Proceed to Phase 2 (optional best practices)

---

## Summary

Phase 1 improvements are complete and ready for testing!

- ✅ RestTemplate bean working
- ✅ CORS configured
- ✅ Configuration externalized
- ✅ Error handling working
- ✅ Input validation working
- ✅ Logging working
- ✅ DTOs working

All tests should pass. If any fail, check the troubleshooting section.
