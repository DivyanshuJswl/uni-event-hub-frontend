import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";

const NotificationContext = createContext();

const NOTIFICATION_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  MARK_AS_READ: "MARK_AS_READ",
  MARK_ALL_AS_READ: "MARK_ALL_AS_READ",
  DELETE_NOTIFICATION: "DELETE_NOTIFICATION",
  CLEAR_ALL: "CLEAR_ALL",
  SET_UNREAD_COUNT: "SET_UNREAD_COUNT",
  SET_ERROR: "SET_ERROR",
  SHOW_TOAST: "SHOW_TOAST",
  HIDE_TOAST: "HIDE_TOAST",
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetch: null,
  toast: {
    open: false,
    message: "",
    title: "",
    type: "info",
    isManual: false,
  },
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount ?? state.unreadCount,
        lastFetch: Date.now(),
        loading: false,
        error: null,
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.isRead ? state.unreadCount : state.unreadCount + 1,
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n._id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deleted = state.notifications.find((n) => n._id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter((n) => n._id !== action.payload),
        unreadCount:
          deleted && !deleted.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return { ...state, notifications: [], unreadCount: 0 };

    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case NOTIFICATION_ACTIONS.SHOW_TOAST:
      return {
        ...state,
        toast: {
          open: true,
          message: action.payload.message,
          title: action.payload.title,
          type: action.payload.type,
          isManual: action.payload.isManual,
          notification: action.payload.notification, // For backend notifications
        },
      };

    case NOTIFICATION_ACTIONS.HIDE_TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          open: false,
        },
      };

    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const prevUnreadCountRef = useRef(state.unreadCount);
  const isInitialMount = useRef(true);

  const apiClient = useMemo(() => {
    if (!token) return null;
    return axios.create({
      baseURL: `${BASE_URL}/api`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token, BASE_URL]);

  // Manual toast function (replaces react-toastify)
  const showToast = useCallback((message, type = "info", title = "") => {
    const defaultTitles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.SHOW_TOAST,
      payload: {
        message,
        title: title || defaultTitles[type] || "Notification",
        type,
        isManual: true,
      },
    });
  }, []);

  // Hide toast
  const hideToast = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.HIDE_TOAST });
  }, []);

  // Helper to check if notification is recent
  const isRecentNotification = useCallback((notification) => {
    const notificationTime = new Date(notification.createdAt);
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    return notificationTime >= thirtyMinutesAgo;
  }, []);

  // Show backend notification as toast
  const showNotificationToast = useCallback(
    (notification) => {
      if (isRecentNotification(notification)) {
        dispatch({
          type: NOTIFICATION_ACTIONS.SHOW_TOAST,
          payload: {
            message: notification.message,
            title: notification.title,
            type: notification.type || "info",
            isManual: false,
            notification: notification,
          },
        });
      }
    },
    [isRecentNotification]
  );

  const fetchNotifications = useCallback(
    async (page = 1, limit = 20, force = false) => {
      if (!user || !apiClient) return;

      if (!force && state.lastFetch && Date.now() - state.lastFetch < 120000) {
        return;
      }

      try {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });

        const response = await apiClient.get("/notifications", {
          params: { page, limit },
        });

        const newNotifications = response.data.data.notifications;
        const newUnreadCount = response.data.data.unreadCount;

        // Check for new notifications and show toast
        if (!isInitialMount.current && newUnreadCount > prevUnreadCountRef.current) {
          const latestNotification = newNotifications.find(
            (n) => !n.isRead && isRecentNotification(n)
          );
          if (latestNotification) {
            showNotificationToast(latestNotification);
          }
        }

        prevUnreadCountRef.current = newUnreadCount;

        dispatch({
          type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
          payload: {
            notifications: newNotifications,
            unreadCount: newUnreadCount,
          },
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (error.response?.status !== 404 && error.response?.status !== 500) {
          dispatch({
            type: NOTIFICATION_ACTIONS.SET_ERROR,
            payload: error.response?.data?.message || "Failed to fetch notifications",
          });
        }
      } finally {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
      }
    },
    [user, apiClient, state.lastFetch, isRecentNotification, showNotificationToast]
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !apiClient) return;

    try {
      const response = await apiClient.get("/notifications/unread-count");
      const newUnreadCount = response.data.data.unreadCount;

      if (newUnreadCount > prevUnreadCountRef.current) {
        await fetchNotifications(1, 20, true);
      } else {
        prevUnreadCountRef.current = newUnreadCount;
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
          payload: newUnreadCount,
        });
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [user, apiClient, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!apiClient) return;

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });

      try {
        await apiClient.put(`/notifications/mark-read/${notificationId}`);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        await fetchNotifications(1, 20, true);
        throw error;
      }
    },
    [apiClient, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!apiClient) return;

    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });

    try {
      await apiClient.put("/notifications/mark-all-read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      await fetchNotifications(1, 20, true);
      throw error;
    }
  }, [apiClient, fetchNotifications]);

  const deleteNotification = useCallback(
    async (notificationId) => {
      if (!apiClient) return;

      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, payload: notificationId });

      try {
        await apiClient.delete(`/notifications/${notificationId}`);
      } catch (error) {
        console.error("Error deleting notification:", error);
        await fetchNotifications(1, 20, true);
        throw error;
      }
    },
    [apiClient, fetchNotifications]
  );

  const clearAllNotifications = useCallback(async () => {
    if (!apiClient) return;

    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });

    try {
      await apiClient.delete("/notifications");
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      await fetchNotifications(1, 20, true);
      throw error;
    }
  }, [apiClient, fetchNotifications]);

  const addNotification = useCallback(
    (notification) => {
      dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
      showNotificationToast(notification);
    },
    [showNotificationToast]
  );

  // Polling effect
  useEffect(() => {
    if (!user || !token) return;

    let isMounted = true;

    if (isInitialMount.current) {
      fetchNotifications(1, 20, true);
      isInitialMount.current = false;
    }

    const pollInterval = setInterval(() => {
      if (isMounted) {
        fetchUnreadCount();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [user, token, fetchNotifications, fetchUnreadCount]);

  const value = useMemo(
    () => ({
      ...state,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      addNotification,
      showToast, // For manual toasts
      hideToast,
    }),
    [
      state,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      addNotification,
      showToast,
      hideToast,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
