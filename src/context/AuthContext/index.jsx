// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from 'services/api';

// Create Auth Context
const AuthContext = createContext();

// Secure storage functions (similar to localStorage API)
const secureStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined') {
        // Use sessionStorage for temporary storage (cleared when browser closes)
        return sessionStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(secureStorage.getItem('token'));
  const [id, setId] = useState(secureStorage.getItem('id'));
  const [user, setUser] = useState(() => {
    const savedUser = secureStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(secureStorage.getItem('role'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = secureStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Verify token with backend
          const response = await authAPI.getMe();
          if (response.data.success) {
            const { student } = response.data;
            // Update state with fresh data from backend
            setUser(student);
            setId(student._id);
            setRole(student.role);
            setToken(storedToken);
            
            // Update storage with fresh data
            secureStorage.setItem('id', student._id);
            secureStorage.setItem('role', student.role);
            secureStorage.setItem('user', JSON.stringify(student));
          }
        } catch (error) {
          console.error('Auth validation failed:', error);
          // Clear invalid auth data
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (authData) => {
    const { token, user } = authData;
    
    setToken(token);
    setId(user._id);
    setUser(user);
    setRole(user.role);
    
    // Store in secure storage
    secureStorage.setItem('token', token);
    secureStorage.setItem('id', user._id);
    secureStorage.setItem('role', user.role);
    secureStorage.setItem('user', JSON.stringify(user));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setId(null);
    setUser(null);
    setRole(null);
    
    // Remove from storage
    secureStorage.removeItem('token');
    secureStorage.removeItem('id');
    secureStorage.removeItem('role');
    secureStorage.removeItem('user');
    
    // Call backend logout if needed
    authAPI.logout().catch(error => {
      console.error('Logout API error:', error);
    });
  };

  // Update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    secureStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Context value
  const value = {
    // State (same as your localStorage keys)
    token,
    id,
    user,
    role,
    isLoading,
    
    // Actions
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};