import { useState, useCallback } from 'react';
import { postChat } from '../services/apiClient';

/**
 * Custom hook for managing chat state and operations.
 * Handles messages, loading state, and error handling.
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(generateConversationId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate a unique conversation ID.
   */
  function generateConversationId() {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send a message and get AI response.
   */
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    // Add user message to chat
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await postChat(conversationId, userMessage);

      if (response.success) {
        // Add AI response to chat
        const aiMsg = {
          id: response.messageId,
          sender: 'AI',
          content: response.response,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Handle error response
        setError(response.details || response.error);
        console.error('API Error:', response);
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  /**
   * Clear all messages and start a new conversation.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(generateConversationId());
    setError(null);
  }, []);

  /**
   * Clear error message.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    conversationId,
    loading,
    error,
    sendMessage,
    clearChat,
    clearError,
  };
};
