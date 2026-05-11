# Full Stack Quick Start - Backend + Frontend

## 🚀 Complete Setup in 5 Minutes

Everything you need to run your complete offline AI chatbot.

---

## 📋 Prerequisites

- Node.js 16+ and npm
- Java 17 and Maven
- Ollama installed and running

---

## 🎯 Step-by-Step Setup

### Step 1: Start Ollama (Terminal 1)
```bash
ollama serve
```

Wait for: `Listening on 127.0.0.1:11434`

### Step 2: Start Backend (Terminal 2)
```bash
cd OfflineChatGPT
mvn spring-boot:run
```

Wait for: `Started OfflineChatGptApplication`

### Step 3: Install Frontend Dependencies (Terminal 3)
```bash
cd OfflineChatGPT/frontend
npm install
```

Wait for: `added X packages`

### Step 4: Start Frontend (Terminal 3)
```bash
npm run dev
```

Wait for: `Local: http://localhost:5173`

### Step 5: Open Browser
Navigate to: `http://localhost:5173`

---

## ✅ Verify Everything Works

### Test 1: Health Check
```bash
curl http://localhost:7070/api/health
```

Expected: `{"status":"UP"}`

### Test 2: Send Message
```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test","message":"Hello"}'
```

Expected: AI response in JSON

### Test 3: Frontend
Open http://localhost:5173 and type a message

Expected: Message appears, AI responds

---

## 🎨 What You See

### Frontend UI
- **Left**: Sidebar with "New Chat" button
- **Center**: Chat window with messages
- **Bottom**: Input field with send button
- **Theme**: Dark mode (professional look)

### Message Display
- **User messages**: Green, right-aligned
- **AI messages**: Blue, left-aligned
- **Timestamps**: Below each message
- **Loading**: Typing animation while waiting

---

## 🔧 Configuration

### Backend URL
If backend is on different port, edit:
```
frontend/src/services/apiClient.js
const API_BASE_URL = 'http://localhost:7070/api';
```

### Frontend Port
If you want different port, edit:
```
frontend/vite.config.js
server: {
  port: 3000,  // Change here
}
```

### Ollama Model
To use different model, edit:
```
src/main/resources/application.properties
ollama.model=llama2  # Change here
```

---

## 📊 System Requirements

### Minimum
- RAM: 4GB
- CPU: 2 cores
- Disk: 5GB (for Ollama model)

### Recommended
- RAM: 8GB+
- CPU: 4+ cores
- Disk: 10GB+

### Tested On
- Windows 10/11
- macOS 12+
- Ubuntu 20.04+

---

## 🐛 Quick Troubleshooting

### "Backend Connection Failed"
```bash
# Check backend is running
curl http://localhost:7070/api/health

# If not, start it
mvn spring-boot:run
```

### "Network error"
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If not, start it
ollama serve
```

### "npm install fails"
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### "Port already in use"
```bash
# Change port in vite.config.js
# Or kill process using port
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173
```

---

## 📁 Project Structure

```
OfflineChatGPT/
├── src/main/java/com/chatgpt/ai/
│   ├── config/          (RestTemplate, CORS)
│   ├── controller/      (Chat, Health endpoints)
│   ├── service/         (Chat, Validation logic)
│   ├── dto/             (Request/Response objects)
│   └── exception/       (Error handling)
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── src/
    │   ├── components/  (UI components)
    │   ├── services/    (API client)
    │   ├── hooks/       (State management)
    │   └── styles/      (CSS)
    └── package.json
```

---

## 🎯 API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "conversationId": "conv-123",
  "message": "Hello"
}

Response:
{
  "success": true,
  "response": "AI response",
  "messageId": "msg-456",
  "timestamp": "2024-01-15T10:30:00",
  "error": null
}
```

### Health Endpoint
```
GET /api/health

Response:
{
  "status": "UP"
}
```

---

## 🚀 Common Commands

### Backend
```bash
# Start backend
mvn spring-boot:run

# Build backend
mvn clean package

# Run tests
mvn test
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Ollama
```bash
# Start Ollama
ollama serve

# List models
ollama list

# Pull a model
ollama pull llama2

# Run a model
ollama run gemma:2b
```

---

## 📱 Mobile Testing

### On Same Network
1. Get your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On mobile, navigate to: `http://YOUR_IP:5173`
3. Chat works on mobile!

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

---

## 🎓 Learning Resources

### Frontend
- React: https://react.dev
- Vite: https://vitejs.dev
- Axios: https://axios-http.com

### Backend
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa

### AI
- Ollama: https://ollama.ai
- Gemma: https://ai.google.dev/gemma

---

## 📊 Performance Tips

### Faster Responses
1. Use smaller Ollama model
2. Increase system RAM
3. Close other applications
4. Use SSD for better I/O

### Better UI Performance
1. Clear browser cache
2. Use modern browser
3. Disable browser extensions
4. Check network connection

---

## 🔐 Security Notes

### Development
- Backend runs on localhost only
- CORS allows localhost:5173
- No authentication (development only)

### Production
- Use HTTPS
- Add authentication
- Restrict CORS origins
- Use environment variables
- Add rate limiting

---

## 📈 Next Steps

### Phase 1: ✅ Complete
- Backend infrastructure
- Frontend UI
- API integration

### Phase 2: Optional
- Add database for conversations
- Add message history
- Add user preferences

### Phase 3: Advanced
- Add authentication
- Add multiple models
- Add export/import
- Deploy to cloud

---

## 💡 Pro Tips

### Development
- Use VS Code for editing
- Use DevTools for debugging
- Use Postman for API testing
- Monitor logs for errors

### Productivity
- Create shell scripts for startup
- Use tmux/screen for multiple terminals
- Set up git for version control
- Document your changes

### Optimization
- Profile with DevTools
- Monitor memory usage
- Check bundle size
- Optimize images

---

## 🎉 You're All Set!

Your complete offline AI chatbot is ready to use:

✅ Backend running on port 7070
✅ Frontend running on port 5173
✅ Ollama running on port 11434
✅ All connected and working

### Start Chatting!
1. Open http://localhost:5173
2. Type a message
3. Get AI response
4. Enjoy!

---

## 📞 Quick Help

### Something Not Working?
1. Check all three services are running
2. Check ports are correct
3. Check browser console for errors
4. Check backend logs for errors
5. Restart everything

### Need More Help?
- See FRONTEND_SETUP_GUIDE.md
- See TESTING_GUIDE.md
- See QUICK_START.md
- Check README files

---

## 🎯 Summary

| Component | Port | Status |
|-----------|------|--------|
| Ollama | 11434 | Running ✅ |
| Backend | 7070 | Running ✅ |
| Frontend | 5173 | Running ✅ |

**Everything is connected and ready to use!**

---

**Happy chatting! 🚀**
