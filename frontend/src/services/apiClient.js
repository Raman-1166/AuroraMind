import axios from 'axios';

/**
 * API Client for communicating with the backend.
 * Handles all HTTP requests to the Spring Boot server.
 */

const API_BASE_URL = 'http://localhost:7070/api';

// Create Axios instance — timeout matches backend (3 minutes for slow local models)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutes — gemma:2b can be slow on low-RAM machines
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a message to the AI and get a response.
 * @param {string} conversationId - The conversation ID
 * @param {string} message - The user's message
 * @returns {Promise<Object>} - The AI response
 */
export const postChat = async (conversationId, message) => {
  try {
    const response = await apiClient.post('/chat', {
      conversationId,
      message,
    });

    if (response.data.success) {
      return {
        success: true,
        response: response.data.response,
        messageId: response.data.messageId,
        timestamp: response.data.timestamp,
      };
    } else {
      return {
        success: false,
        error: response.data.error,
        details: response.data.details,
      };
    }
  } catch (error) {
    console.error('API Error:', error);

    // Timeout — Ollama is still thinking, not a connection problem
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        success: false,
        error: 'AI is taking too long',
        details: 'The AI model is still processing. Please try a shorter message or wait and try again.',
      };
    }

    if (error.response) {
      // Server responded with an error status (400, 503, etc.)
      return {
        success: false,
        error: error.response.data?.error || 'Server error',
        details: error.response.data?.details || error.message,
        status: error.response.status,
      };
    } else if (error.request) {
      // No response received — backend is down
      return {
        success: false,
        error: 'Backend not reachable',
        details: 'Could not connect to the server. Make sure the Spring Boot backend is running on port 7070.',
      };
    } else {
      return {
        success: false,
        error: 'Request error',
        details: error.message,
      };
    }
  }
};

/**
 * Check if the backend is healthy.
 * @returns {Promise<boolean>} - True if backend is healthy
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default apiClient;
