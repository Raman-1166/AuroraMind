import React from 'react';
import ChatWindow from '../components/ChatWindow';
import InputBox from '../components/InputBox';
import Sidebar from '../components/Sidebar';
import { useChat } from '../hooks/useChat';
import '../styles/ChatWindow.css';

/**
 * Main chat page component
 */
const ChatPage = () => {
  const {
    messages,
    conversationId,
    loading,
    error,
    conversations,
    sendMessage,
    newConversation,
    loadConversation,
    deleteConversation,
    setError,
  } = useChat();

  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        currentConversationId={conversationId}
        onNewChat={newConversation}
        onSelectConversation={loadConversation}
        onDeleteConversation={deleteConversation}
      />

      <div className="chat-container">
        <ChatWindow messages={messages} loading={loading} />
        <InputBox
          onSendMessage={sendMessage}
          disabled={loading}
          error={error}
          onErrorClear={() => setError(null)}
        />
      </div>
    </div>
  );
};

export default ChatPage;
