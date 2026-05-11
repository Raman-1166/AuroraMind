# 🤖 AuroraMind — Personal Offline AI Chatbot

A lightweight, fully offline AI chatbot that runs entirely on your local machine. No internet required for chatting — powered by **Ollama + gemma:2b**.

![AuroraMind](https://img.shields.io/badge/AuroraMind-Offline%20AI-blue)
![Java](https://img.shields.io/badge/Java-17%2B-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Ollama](https://img.shields.io/badge/Ollama-gemma%3A2b-red)

---

## ✨ Features

- 💬 Real-time AI chat — fully offline
- 🌙 Modern dark theme UI
- 📱 Responsive design (mobile-friendly)
- ⚡ Fast and lightweight
- 🔒 100% private — no data leaves your machine
- 🛡️ Input validation and error handling
- ⏳ Live response timer so you know AI is working

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3, Maven |
| **Frontend** | React 18, Vite 5, Axios |
| **AI Model** | Ollama + gemma:2b |
| **Styling** | Vanilla CSS (Dark Theme) |

---

## 📋 Prerequisites

- [Java 17+](https://www.oracle.com/java/technologies/downloads/)
- [Maven](https://maven.apache.org/download.cgi)
- [Node.js 16+](https://nodejs.org/)
- [Ollama](https://ollama.ai/) with `gemma:2b` model

---

## 🚀 Quick Start

### 1. Install Ollama & pull the model
```bash
# Install Ollama from https://ollama.ai
ollama pull gemma:2b
```

### 2. Start Ollama
```bash
ollama serve
```

### 3. Start Backend
```bash
# Set JAVA_HOME if needed
mvn spring-boot:run
```
Backend runs on **http://localhost:7070**

### 4. Install & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### 5. Open in Browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
AuroraMind/
├── src/main/java/com/chatgpt/ai/
│   ├── config/
│   │   ├── RestTemplateConfig.java   # HTTP client with 3-min timeout
│   │   └── CorsConfig.java           # CORS for frontend
│   ├── controller/
│   │   └── ChatController.java       # POST /api/chat, GET /api/health
│   ├── service/
│   │   ├── ChatService.java          # Ollama integration
│   │   └── ValidationService.java    # Input validation
│   ├── dto/
│   │   ├── ChatRequestDTO.java
│   │   ├── ChatResponseDTO.java
│   │   └── ErrorResponseDTO.java
│   └── exception/
│       ├── OllamaException.java
│       ├── ValidationException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputBox.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── apiClient.js
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── pom.xml
```

---

## 🔌 API Endpoints

### POST `/api/chat`
Send a message and get AI response.

**Request:**
```json
{
  "conversationId": "conv-123",
  "message": "What is Java?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Java is a high-level programming language...",
  "messageId": "msg-456",
  "timestamp": "2024-01-15T10:30:00",
  "error": null
}
```

### GET `/api/health`
Check if backend is running.

**Response:** `{"status":"UP"}`

---

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
server.port=7070
ollama.api.url=http://localhost:11434/api/generate
ollama.model=gemma:2b
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Could not connect" | Make sure Spring Boot is running on port 7070 |
| AI not responding | Make sure `ollama serve` is running |
| Slow responses | Normal for gemma:2b — wait up to 60 seconds |
| CORS error | Check CorsConfig allows your frontend port |

---

## 📄 License

MIT License — free to use and modify.

---

## 👨‍💻 Author

**Raman Chourasiya**
- GitHub: [@Raman-1166](https://github.com/Raman-1166)

---

*Built with ❤️ for offline AI chatting*
