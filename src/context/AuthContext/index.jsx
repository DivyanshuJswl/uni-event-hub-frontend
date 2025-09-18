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
            setUser(userData.student);
            setRole(userData.role);
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
        const token = data.token;
        const student = data.student;
        const role = data.role;

        // Store token in sessionStorage
        sessionStorage.setItem("token", token);

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
  // In your AuthContext
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        return {
          success: true,
          data: response.data,
          message: "Registration successful!",
        };
      } else {
        return {
          success: false,
          message: "Registration failed",
        };
      }
    } catch (error) {
      console.error("Register error:", error);

      let message = "Network error";
      if (error.response) {
        if (error.response.status === 400) {
          message = error.response.data.message || "Validation error";
        } else if (error.response.status === 409) {
          message = "Email already exists";
        } else if (error.response.status === 500) {
          message = "Server error. Please try again later";
        } else {
          message = error.response.data.message || "Registration failed";
        }
      }

      return { success: false, message };
    }
  };

  const becomeOrganizer = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/roles/upgrade-to-organizer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data?.status === "success") {
        const { student } = response.data.data;
        const userRole = student?.role;

        // Update state
        setUser(student);
        setRole(userRole);

        showToast("Successfully upgraded to organizer!", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to upgrade to organizer");
      }
    } catch (error) {
      console.error("Become organizer error:", error);

      // Handle unauthorized error
      if (error.response?.status === 401) {
        // Clear auth state
        setToken(null);
        setUser(null);
        setRole(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        showToast("Session expired. Please log in again.", "error");
        return { success: false, requiresLogin: true };
      }

      const message = error.response?.data?.message || "Failed to upgrade to organizer";
      showToast(message, "error");
      return { success: false, message };
    }
  };

  const updateWallet = async (metaMaskAddress) => {
    try {
      if (!token) {
        throw new Error("Please log in to update your wallet");
      }

      if (!metaMaskAddress) {
        throw new Error("MetaMask address is required");
      }

      // Basic validation for Ethereum address format
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!ethAddressRegex.test(metaMaskAddress)) {
        throw new Error(
          "Invalid MetaMask address format. Should be 0x followed by 40 hex characters."
        );
      }

      const response = await axios.patch(
        `${BASE_URL}/api/wallet`,
        { metaMaskAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Wallet update response:", response.data, response.status);

      if (response.data?.status === "success") {
        const updatedStudent = response.data.data.student;

        // Update state
        setUser(updatedStudent);
        showToast("Wallet linked successfully!", "success");
        return {
          success: true,
          data: response.data,
          metaMaskAddress: updatedStudent.metaMaskAddress,
        };
      }

      throw new Error(response.data?.message || "Failed to link wallet");
    } catch (error) {
      console.error("Wallet update error:", error);

      let errorMessage = "Failed to update wallet";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid request";
        } else if (error.response.status === 401) {
          // Clear auth state on unauthorized
          setToken(null);
          setUser(null);
          setRole(null);
          sessionStorage.clear();
          errorMessage = "Session expired. Please log in again.";
        } else if (error.response.status === 409) {
          errorMessage = "This wallet is already linked to another account";
        } else {
          errorMessage = error.response.data.message || "Server error";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
      return { success: false, message: errorMessage };
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.patch(`${BASE_URL}/api/auth/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Check response status correctly
      if (response.status === 200) {
        // Update user context with new avatar
        updateUser({ avatar: response.data.avatarUrl });
        return { success: true, avatarUrl: response.data.avatarUrl };
      } else {
        return { success: false, message: "Upload failed" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/auth/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        // Update user context
        updateUser({ avatar: null });
        return { success: true };
      } else {
        return { success: false, message: "Failed to delete profile picture" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error deleting profile picture",
      };
    }
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
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
    signup,
    updateUser,
    getAuthHeader,
    showToast,
    becomeOrganizer,
    updateWallet,
    updateProfilePicture,
    deleteProfilePicture,
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
