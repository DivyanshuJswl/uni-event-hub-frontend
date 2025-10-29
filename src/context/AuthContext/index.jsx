import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, Container, Paper, Alert } from "@mui/material";
import { Warning, Lock, Security } from "@mui/icons-material";
import axios from "axios";

const AuthContext = createContext();

// Styled Loading Component
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

// Styled Access Denied Component
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

// Styled Authentication Required Component
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
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  // Consolidated auth state
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null,
    isLoading: true,
  });

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            timeout: 10000,
          });

          if (response.data.status) {
            setAuthState({
              token: response.data.token || storedToken,
              user: response.data.student,
              role: response.data.role,
              isLoading: false,
            });
          } else {
            localStorage.removeItem("token");
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, [BASE_URL]);

  // Memoized navigation with delay
  const navigateWithDelay = useCallback(
    (path, delay = 8000) => {
      setTimeout(() => navigate(path), delay);
    },
    [navigate]
  );

  // Memoized login function
  const login = useCallback(
    async (credentials) => {
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials, {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data) {
          const { token, student, role } = response.data;
          localStorage.setItem("token", token);

          setAuthState({
            token,
            user: student,
            role,
            isLoading: false,
          });

          return { success: true, data: response.data };
        }
        return { success: false, message: "Login failed" };
      } catch (error) {
        console.error("Login error:", error);

        let message = "Network error. Please check your connection.";
        if (error.response) {
          if (error.response.status === 401) message = "Invalid email or password";
          else if (error.response.status === 500) message = "Server error. Please try again later.";
          else message = error.response.data.message || "Login failed";
        }

        return { success: false, message };
      }
    },
    [BASE_URL]
  );

  // Memoized Google login
  const googleLogin = useCallback(
    async (credentialResponse) => {
      try {
        if (!credentialResponse?.credential) {
          return { success: false, message: "No credential received from Google" };
        }

        const response = await axios.post(
          `${BASE_URL}/api/auth/google`,
          {
            credential: credentialResponse.credential,
          },
          { timeout: 10000 }
        );

        if (!response?.data?.token) {
          return { success: false, message: "Invalid response from server" };
        }

        const { token: authToken, data, isNewUser } = response.data;
        const { student } = data;
        const userRole = student?.role;

        localStorage.setItem("token", authToken);

        setAuthState({
          token: authToken,
          user: student,
          role: userRole,
          isLoading: false,
        });

        return { success: true, data: response.data, isNewUser, role: userRole };
      } catch (error) {
        console.error("Google login error:", error);

        let message = "Google login failed";
        if (error.response) {
          if (error.response.status === 401) message = "Google authentication failed";
          else if (error.response.status === 500) message = "Server error. Please try again later.";
          else message = error.response.data.message || "Google login failed";
        }

        return { success: false, message };
      }
    },
    [BASE_URL]
  );

  // Memoized logout
  const logout = useCallback(async () => {
    try {
      if (authState.token) {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${authState.token}` },
            withCredentials: true,
            timeout: 10000,
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({ token: null, user: null, role: null, isLoading: false });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");
      return { success: true };
    }
  }, [BASE_URL, authState.token]);

  // Memoized signup
  const signup = useCallback(
    async (userData) => {
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData, {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.status === 201) {
          return { success: true, data: response.data, message: "Registration successful!" };
        }
        return { success: false, message: "Registration failed" };
      } catch (error) {
        console.error("Register error:", error);

        let message = "Network error";
        if (error.response) {
          if (error.response.status === 400)
            message = error.response.data.message || "Validation error";
          else if (error.response.status === 409) message = "Email already exists";
          else if (error.response.status === 500) message = "Server error. Please try again later";
          else message = error.response.data.message || "Registration failed";
        }

        return { success: false, message };
      }
    },
    [BASE_URL]
  );

  // Memoized become organizer
  const becomeOrganizer = useCallback(async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/auth/upgrade-to-organizer`,
        {},
        {
          headers: { Authorization: `Bearer ${authState.token}` },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data?.status === "success") {
        const { student } = response.data.data;
        setAuthState((prev) => ({ ...prev, user: student, role: student?.role }));
        return { success: true, data: response.data };
      }
      throw new Error(response.data?.message || "Failed to upgrade to organizer");
    } catch (error) {
      console.error("Become organizer error:", error);

      if (error.response?.status === 401) {
        setAuthState({ token: null, user: null, role: null, isLoading: false });
        localStorage.clear();
        return { success: false, requiresLogin: true };
      }

      const message = error.response?.data?.message || "Failed to upgrade to organizer";
      return { success: false, message };
    }
  }, [BASE_URL, authState.token]);

  // Memoized update wallet
  const updateWallet = useCallback(
    async (metaMaskAddress) => {
      try {
        if (!authState.token) throw new Error("Please log in to update your wallet");
        if (!metaMaskAddress) throw new Error("MetaMask address is required");

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
            headers: { Authorization: `Bearer ${authState.token}` },
            withCredentials: true,
            timeout: 10000,
          }
        );

        if (response.data?.status === "success") {
          const updatedStudent = response.data.data.student;
          setAuthState((prev) => ({ ...prev, user: updatedStudent }));
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
          if (error.response.status === 400)
            errorMessage = error.response.data.message || "Invalid request";
          else if (error.response.status === 401) {
            setAuthState({ token: null, user: null, role: null, isLoading: false });
            localStorage.clear();
            errorMessage = "Session expired. Please log in again.";
          } else if (error.response.status === 409)
            errorMessage = "This wallet is already linked to another account";
          else errorMessage = error.response.data.message || "Server error";
        } else if (error.message) {
          errorMessage = error.message;
        }

        return { success: false, message: errorMessage };
      }
    },
    [BASE_URL, authState.token]
  );

  // Memoized update profile picture
  const updateProfilePicture = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await axios.patch(`${BASE_URL}/api/auth/avatar`, formData, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          timeout: 10000,
        });

        if (response.status === 200) {
          setAuthState((prev) => ({
            ...prev,
            user: { ...prev.user, avatar: response.data.avatarUrl },
          }));
          return { success: true, avatarUrl: response.data.avatarUrl };
        }
        return { success: false, message: "Upload failed" };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
      }
    },
    [BASE_URL, authState.token]
  );

  // Memoized delete profile picture
  const deleteProfilePicture = useCallback(async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/auth/avatar`, {
        headers: { Authorization: `Bearer ${authState.token}` },
        withCredentials: true,
        timeout: 10000,
      });

      if (response.status === 200) {
        setAuthState((prev) => ({ ...prev, user: { ...prev.user, avatar: null } }));
        return { success: true };
      }
      return { success: false, message: "Failed to delete profile picture" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error deleting profile picture",
      };
    }
  }, [BASE_URL, authState.token]);

  // Memoized update profile
  const updateProfile = useCallback(
    async (profileData) => {
      try {
        const response = await axios.patch(`${BASE_URL}/api/auth/update-me`, profileData, {
          headers: { Authorization: `Bearer ${authState.token}` },
          withCredentials: true,
          timeout: 10000,
        });

        setAuthState((prev) => ({ ...prev, user: response.data.student }));
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Update failed";
        return { success: false, message: errorMessage };
      }
    },
    [BASE_URL, authState.token]
  );

  // Memoized update user
  const updateUser = useCallback((updatedData) => {
    setAuthState((prev) => ({ ...prev, user: { ...prev.user, ...updatedData } }));
  }, []);

  // Memoized get auth header
  const getAuthHeader = useCallback(() => {
    return authState.token ? { Authorization: `Bearer ${authState.token}` } : {};
  }, [authState.token]);

  // Memoized context value
  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      role: authState.role,
      isLoading: authState.isLoading,
      login,
      googleLogin,
      logout,
      signup,
      updateUser,
      getAuthHeader,
      becomeOrganizer,
      updateWallet,
      updateProfile,
      navigateWithDelay,
      updateProfilePicture,
      deleteProfilePicture,
    }),
    [
      authState,
      login,
      googleLogin,
      logout,
      signup,
      updateUser,
      getAuthHeader,
      becomeOrganizer,
      updateWallet,
      updateProfile,
      navigateWithDelay,
      updateProfilePicture,
      deleteProfilePicture,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// HOC for protecting routes
export const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const { token, isLoading, navigateWithDelay } = useAuth();

    if (isLoading) return <LoadingScreen />;
    if (!token) {
      navigateWithDelay("/authentication/sign-in");
      return (
        <LoginRequiredScreen onRedirect={() => navigateWithDelay("/authentication/sign-in", 0)} />
      );
    }

    return <Component {...props} />;
  };
};

// HOC for role-based access
export const withRole = (Component, requiredRole) => {
  return function WithRoleComponent(props) {
    const { token, role, isLoading, navigateWithDelay } = useAuth();

    if (isLoading) return <LoadingScreen />;
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

// Hook for route guards
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
      }
    }
  }, [token, role, isLoading, requiredRole, navigateWithDelay]);

  return { hasAccess: !!token && (!requiredRole || role === requiredRole), isLoading };
};

// Protected route component
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { hasAccess, isLoading } = useRouteGuard(requiredRole);

  if (isLoading) return <LoadingScreen />;
  if (!hasAccess) {
    if (!requiredRole) {
      return (
        <LoginRequiredScreen
          onRedirect={() => (window.location.href = "/authentication/sign-in")}
        />
      );
    }
    return (
      <AccessDeniedScreen
        message={`Access denied. Required role: ${requiredRole}`}
        onRedirect={() => (window.location.href = "/authentication/sign-in")}
      />
    );
  }

  return children;
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
