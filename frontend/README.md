# Offline ChatGPT Frontend

A lightweight React + Vite frontend for the Personal Offline AI Chatbot.

## Features

- ✅ Clean, modern dark theme UI
- ✅ Real-time chat with AI responses
- ✅ Responsive design (mobile-friendly)
- ✅ Loading animations and typing indicators
- ✅ Error handling and user feedback
- ✅ Lightweight and fast
- ✅ Optimized for low-RAM systems

## Prerequisites

- Node.js 16+ and npm
- Backend running on http://localhost:7070
- Ollama running on http://localhost:11434

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx      # Main chat display
│   │   ├── MessageBubble.jsx   # Individual message
│   │   ├── InputBox.jsx        # Message input
│   │   ├── Sidebar.jsx         # Chat history sidebar
│   │   └── LoadingSpinner.jsx  # Loading animation
│   ├── services/
│   │   └── apiClient.js        # Backend API calls
│   ├── hooks/
│   │   └── useChat.js          # Chat state management
│   ├── styles/
│   │   └── App.css             # All styling
│   ├── App.jsx                 # Main component
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## API Integration

The frontend connects to the backend at `http://localhost:7070/api`

### Endpoints Used

- `POST /api/chat` - Send message and get AI response
- `GET /api/health` - Check backend health

### Request Format

```json
{
  "conversationId": "conv-123",
  "message": "Hello, how are you?"
}
```

### Response Format

```json
{
  "success": true,
  "response": "I'm doing well, thank you for asking...",
  "messageId": "msg-456",
  "timestamp": "2024-01-15T10:30:00",
  "error": null
}
```

## Customization

### Change Backend URL

Edit `src/services/apiClient.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:7070/api';
```

### Change Theme Colors

Edit `src/styles/App.css` CSS variables:

```css
:root {
  --bg-primary: #0d1117;
  --accent-color: #58a6ff;
  /* ... more colors ... */
}
```

### Change Port

Edit `vite.config.js`:

```javascript
server: {
  port: 3000, // Change to desired port
}
```

## Troubleshooting

### Backend Connection Failed

1. Ensure backend is running: `mvn spring-boot:run`
2. Ensure Ollama is running: `ollama serve`
3. Check backend is on port 7070
4. Check CORS is configured in backend

### Slow Responses

1. Check Ollama is running
2. Check network connection
3. Try a smaller model in Ollama
4. Check system resources

### Build Issues

1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm cache clean --force`

## Performance

- Bundle size: ~150KB (gzipped)
- Initial load: < 2 seconds
- Memory usage: ~50MB
- Optimized for low-RAM systems

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For issues or questions, check the backend documentation or create an issue.
