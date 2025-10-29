import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, Container, Paper, Alert } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Warning, Lock, Security } from "@mui/icons-material";
const AuthContext = createContext();

// Styled Loading Component - overlay to avoid layout collision with sidenav
const LoadingScreen = () => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: (theme) => theme.zIndex.modal + 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "background.default",
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
    <Typography variant="h6" color="text.secondary">
      Authenticating...
    </Typography>
  </Box>
);

// Styled Access Denied Component - overlay
const AccessDeniedScreen = ({ message, onRedirect }) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: (theme) => theme.zIndex.modal + 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      bgcolor: "background.default",
    }}
  >
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Warning sx={{ fontSize: 80, color: "warning.main", mb: 3 }} />
        <Typography component="h1" variant="h4" gutterBottom color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Alert severity="warning" sx={{ width: "100%", mb: 3 }}>
          You will be redirected to the login page shortly...
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={onRedirect}
          startIcon={<Lock />}
          size="large"
        >
          Go to Login Now
        </Button>
      </Paper>
    </Container>
  </Box>
);

// Styled Authentication Required Component - overlay
const LoginRequiredScreen = ({ onRedirect }) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: (theme) => theme.zIndex.modal + 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      bgcolor: "background.default",
    }}
  >
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Security sx={{ fontSize: 80, color: "primary.main", mb: 3 }} />
        <Typography component="h1" variant="h4" color="GrayText" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please log in to access this page
        </Typography>
        <Alert severity="info" sx={{ width: "100%", mb: 3 }}>
          Redirecting to login page...
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={onRedirect}
          startIcon={<Lock />}
          size="large"
        >
          Login Now
        </Button>
      </Paper>
    </Container>
  </Box>
);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  // Check if we have a valid token on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token in memory (from previous session)
        const storedToken = localStorage.getItem("token");
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
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
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

  // Navigation function with delay
  const navigateWithDelay = (path, delay = 8000) => {
    setTimeout(() => {
      navigate(path);
    }, delay);
  };

  const showToast = (message, type = "error", theme = "dark") => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: theme,
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

        // Store token in localStorage
        localStorage.setItem("token", token);

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

      // Store in localStorage
      localStorage.setItem("token", authToken);

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");

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
        `${BASE_URL}/api/auth/upgrade-to-organizer`,
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

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
          localStorage.clear();
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

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/auth/update-me`, profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      updateUser(response.data.student);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Update failed";
      return { success: false, message: errorMessage };
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
    updateProfile,
    navigateWithDelay,
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
    const { token, isLoading, navigateWithDelay } = useAuth();

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (!token) {
      navigateWithDelay("/authentication/sign-in");
      return (
        <LoginRequiredScreen onRedirect={() => navigateWithDelay("/authentication/sign-in", 0)} />
      );
    }

    return <Component {...props} />;
  };
};

// Higher-order component for role-based access
export const withRole = (Component, requiredRole) => {
  return function WithRoleComponent(props) {
    const { token, role, isLoading, navigateWithDelay } = useAuth();

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (!token) {
      navigateWithDelay("/authentication/sign-in");
      return (
        <LoginRequiredScreen onRedirect={() => navigateWithDelay("/authentication/sign-in", 0)} />
      );
    }

    if (role !== requiredRole) {
      navigateWithDelay("/authentication/sign-in");
      return (
        <AccessDeniedScreen
          message={`Access denied. Required role: ${requiredRole}. Your current role: ${role}`}
          onRedirect={() => navigateWithDelay("/authentication/sign-in", 0)}
        />
      );
    }

    return <Component {...props} />;
  };
};

// Hook for protecting routes in functional components
export const useRouteGuard = (requiredRole = null) => {
  const { token, role, isLoading, navigateWithDelay } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        navigateWithDelay("/authentication/sign-in");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        navigateWithDelay("/authentication/sign-in");
        return;
      }
    }
  }, [token, role, isLoading, requiredRole, navigateWithDelay]);

  return { hasAccess: !!token && (!requiredRole || role === requiredRole), isLoading };
};

// USAGE EXAMPLE:
// import { useRouteGuard } from '../contexts/AuthContext';

// const EventManager = () => {
//   // This will automatically redirect if user doesn't have organizer role
//   useRouteGuard('organizer');

//   const { user } = useAuth();

//   return (
//     <Box>
//       <Typography variant="h4">Event Manager</Typography>
//       <Typography>Hello, {user?.name}</Typography>
//       {/* Event management content */}
//     </Box>
//   );
// };

// export default EventManager;

// Component wrapper for route protection
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { hasAccess, isLoading } = useRouteGuard(requiredRole);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasAccess) {
    if (!requiredRole) {
      return (
        <LoginRequiredScreen
          onRedirect={() => (window.location.href = "/authentication/sign-in")}
        />
      );
    } else {
      return (
        <AccessDeniedScreen
          message={`Access denied. Required role: ${requiredRole}`}
          onRedirect={() => (window.location.href = "/authentication/sign-in")}
        />
      );
    }
  }

  return children;
};
// USAGE EXAMPLE:
// import { ProtectedRoute } from './contexts/AuthContext';

// function App() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/authentication/sign-in" element={<Login />} />
//       <Route path="/authentication/sign-up" element={<Register />} />

//       {/* Protected routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute requiredRole="organizer">
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/events"
//         element={
//           <ProtectedRoute>
//             <EventsPage />
//           </ProtectedRoute>
//         }
//       />
