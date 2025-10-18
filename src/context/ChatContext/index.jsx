// context/ChatContext.js
import React, { createContext, useContext, useReducer, useCallback } from "react";
import axios from "axios";
import { useAuth } from "context/AuthContext";

const ChatContext = createContext();

const initialState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
};

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
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, token } = useAuth();

  const sendMessage = useCallback(
    async (message) => {
      if (!user || !token) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please log in to use the chat feature",
        });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });

      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        content: message,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      dispatch({
        type: "ADD_MESSAGE",
        payload: userMessage,
      });

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/chat`,
          { message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const assistantMessage = {
          id: Date.now() + 1,
          content: response.data.data.response,
          role: "assistant",
          timestamp: response.data.data.timestamp,
          messageId: response.data.data.messageId,
        };

        dispatch({
          type: "ADD_MESSAGE",
          payload: assistantMessage,
        });
      } catch (error) {
        console.error("Chat API error:", error);

        let errorMessage = "Failed to send message. Please try again.";
        if (error.response?.status === 401) {
          errorMessage = "Please log in to use the chat feature";
        } else if (error.response?.status === 429) {
          errorMessage = "AI service is busy. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [user, token]
  );

  const loadSuggestions = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/chat/suggestions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: "SET_SUGGESTIONS",
        payload: response.data.data.suggestions,
      });
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  }, [token]);

  const toggleChat = useCallback(() => {
    dispatch({ type: "TOGGLE_CHAT" });
    if (!state.isOpen) {
      loadSuggestions();
    }
  }, [state.isOpen, loadSuggestions]);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
    loadSuggestions();
  }, [loadSuggestions]);

  const value = {
    ...state,
    sendMessage,
    toggleChat,
    clearMessages,
    loadSuggestions,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
