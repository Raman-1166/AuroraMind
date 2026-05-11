import { useEffect, useState } from 'react';
import { useChat } from './hooks/useChat';
import { checkHealth } from './services/apiClient';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { InputBox } from './components/InputBox';
import './styles/App.css';

/**
 * Main App Component
 * Integrates all components and manages the chat application.
 */
function App() {
  const { messages, conversationId, loading, error, sendMessage, clearChat, clearError } = useChat();
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isHealthy = await checkHealth();
      setBackendHealthy(isHealthy);
      setCheckingHealth(false);
    };

    checkBackend();
  }, []);

  const handleNewChat = () => {
    clearChat();
  };

  if (checkingHealth) {
    return (
      <div className="app loading-state">
        <div className="loading-message">
          <p>Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (!backendHealthy) {
    return (
      <div className="app error-state">
        <div className="error-container">
          <h2>⚠️ Backend Connection Failed</h2>
          <p>Could not connect to the backend server.</p>
          <p className="error-details">
            Make sure the Spring Boot backend is running on http://localhost:7070
          </p>
          <p className="error-details">
            Also ensure Ollama is running on http://localhost:11434
          </p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar onNewChat={handleNewChat} conversationId={conversationId} />
      <div className="main-content">
        <ChatWindow
          messages={messages}
          loading={loading}
          error={error}
          onClearError={clearError}
        />
        <InputBox onSendMessage={sendMessage} loading={loading} />
      </div>
    </div>
  );
}

export default App;
