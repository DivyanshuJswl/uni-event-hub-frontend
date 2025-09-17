import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Check if we have a valid token on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token in memory (from previous session)
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
          // Verify the token is still valid with the backend
          const response = await axios.get(BASE_URL + "/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.data.status) {
            const userData = response.data;
            setToken(userData.token || storedToken); // Use storedToken if userData.token is undefined
            setUser(userData.data.student);
            setRole(userData.data.role);
          } else {
            // Token is invalid, clear it
            sessionStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        sessionStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log("Auth state updated:", { token, user, role, isLoading });
  }, [token, user, role, isLoading]);

  const showToast = (message, type = "error") => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    // Dismiss any existing toasts before showing new one
    toast.dismiss();

    if (type === "success") {
      toast.success(message, toastConfig);
    } else if (type === "warning") {
      toast.warning(message, toastConfig);
    } else {
      toast.error(message, toastConfig);
    }
  };

  // login function
  const login = async (credentials) => {
    try {
      const response = await axios.post(BASE_URL + "/api/auth/login", credentials, {
        withCredentials: true,
      });

      if (response.data) {
        const data = response.data;
        const { token, student } = data;
        const role = student?.role;

        // Store token in sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("student", JSON.stringify(student));
        sessionStorage.setItem("role", role);

        // Set state values
        setToken(token);
        setUser(student);
        setRole(role);

        return { success: true, data };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);

      let message = "Network error. Please check your connection.";
      if (error.response) {
        if (error.response.status === 401) {
          message = "Invalid email or password";
        } else if (error.response.status === 500) {
          message = "Server error. Please try again later.";
        } else {
          message = error.response.data.message || "Login failed";
        }
      }

      return { success: false, message };
    }
  };

  // Google login function
  const googleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        return {
          success: false,
          message: "No credential received from Google",
        };
      }

      const idToken = credentialResponse.credential;
      const response = await axios.post(`${BASE_URL}/api/auth/google`, {
        credential: idToken,
      });

      if (!response?.data || !response.data.token) {
        return {
          success: false,
          message: "Invalid response from server",
        };
      }

      const { token: authToken, data, isNewUser } = response.data;
      const { student } = data;
      const userRole = student?.role;

      // Update state
      setToken(authToken);
      setUser(student);
      setRole(userRole);

      // Store in sessionStorage
      sessionStorage.setItem("token", authToken);
      sessionStorage.setItem("user", JSON.stringify(student));
      sessionStorage.setItem("role", userRole);

      return {
        success: true,
        data: response.data,
        isNewUser,
        role: userRole,
      };
    } catch (error) {
      console.error("Google login error:", error);

      let message = "Google login failed";
      if (error.response) {
        if (error.response.status === 401) {
          message = "Google authentication failed";
        } else if (error.response.status === 500) {
          message = "Server error. Please try again later.";
        } else {
          message = error.response.data.message || "Google login failed";
        }
      }

      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API call result
      setToken(null);
      setUser(null);
      setRole(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("savedEmail");
      sessionStorage.removeItem("savedPassword");
      sessionStorage.removeItem("rememberMe");

      // Return success even if API call failed
      return { success: true };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();

        // Store token in sessionStorage
        sessionStorage.setItem("token", data.token);

        // Set state values
        setToken(data.token);
        setUser(data.student);
        setRole(data.student.role);

        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Network error" };
    } finally {
      // setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    // State
    token,
    user,
    role,
    isLoading,

    // Actions
    login,
    googleLogin,
    logout,
    register,
    updateUser,
    getAuthHeader,
    showToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Higher-order component for protecting routes
export const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const { token, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!token) {
      // Redirect to login or show access denied
      return <div>Please log in to access this page</div>;
    }

    return <Component {...props} />;
  };
};

// Higher-order component for role-based access
export const withRole = (Component, requiredRole) => {
  return function WithRoleComponent(props) {
    const { token, role, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!token) {
      return <div>Please log in to access this page</div>;
    }

    if (role !== requiredRole) {
      return <div>Access denied. Required role: {requiredRole}</div>;
    }

    return <Component {...props} />;
  };
};
