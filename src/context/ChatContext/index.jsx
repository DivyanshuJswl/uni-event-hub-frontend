import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";

const ChatContext = createContext();

const initialState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
};

// Memoized reducer outside component
const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "TOGGLE_CHAT":
      return { ...state, isOpen: !state.isOpen };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "RESET_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, token } = useAuth();
  const { showToast } = useNotifications();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET_ERROR" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  // Memoized send message function
  const sendMessage = useCallback(
    async (message) => {
      if (!user || !token) {
        const errorMsg = "Please log in to use the chat feature";
        dispatch({ type: "SET_ERROR", payload: errorMsg });
        showToast(errorMsg, "warning", "Authentication Required");
        return;
      }

      if (!message?.trim()) {
        showToast("Please enter a message", "warning", "Empty Message");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });

      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        content: message.trim(),
        role: "user",
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });

      try {
        const response = await axios.post(
          `${BASE_URL}/api/chat`,
          { message: message.trim() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 30000, // 30 second timeout for AI responses
          }
        );

        const assistantMessage = {
          id: Date.now() + 1,
          content: response.data.data.response,
          role: "assistant",
          timestamp: response.data.data.timestamp,
          messageId: response.data.data.messageId,
        };

        dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
      } catch (error) {
        console.error("Chat API error:", error);

        let errorMessage = "Failed to send message. Please try again.";
        let errorTitle = "Chat Error";

        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. The AI service is taking too long to respond.";
          errorTitle = "Timeout Error";
        } else if (error.response?.status === 401) {
          errorMessage = "Please log in to use the chat feature";
          errorTitle = "Authentication Required";
        } else if (error.response?.status === 429) {
          errorMessage = "AI service is busy. Please try again in a moment.";
          errorTitle = "Rate Limited";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showToast(errorMessage, "error", errorTitle);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [user, token, BASE_URL, showToast]
  );

  // Memoized load suggestions function
  const loadSuggestions = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${BASE_URL}/api/chat/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      dispatch({
        type: "SET_SUGGESTIONS",
        payload: response.data.data.suggestions || [],
      });
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      // Silent fail for suggestions - not critical
    }
  }, [token, BASE_URL]);

  // Memoized toggle chat function
  const toggleChat = useCallback(() => {
    dispatch({ type: "TOGGLE_CHAT" });
    if (!state.isOpen) {
      loadSuggestions();
    }
  }, [state.isOpen, loadSuggestions]);

  // Memoized clear messages function
  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
    loadSuggestions();
    showToast("Chat history cleared", "success", "Cleared");
  }, [loadSuggestions, showToast]);

  // Memoized reset error function
  const resetError = useCallback(() => {
    dispatch({ type: "RESET_ERROR" });
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      isOpen: state.isOpen,
      messages: state.messages,
      isLoading: state.isLoading,
      error: state.error,
      suggestions: state.suggestions,
      sendMessage,
      toggleChat,
      clearMessages,
      loadSuggestions,
      resetError,
    }),
    [
      state.isOpen,
      state.messages,
      state.isLoading,
      state.error,
      state.suggestions,
      sendMessage,
      toggleChat,
      clearMessages,
      loadSuggestions,
      resetError,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

ChatProvider.displayName = "ChatProvider";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
