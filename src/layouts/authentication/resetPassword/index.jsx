import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  LinearProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Security,
  Lock,
  LockOpen,
  ArrowBack,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import axios from "axios";
import { styled } from "@mui/system";
import zxcvbn from "zxcvbn";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const bgImage =
  "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758117993/bg-sign-up-cover_on4sqw.jpg";

// Fixed BackgroundWrapper with proper containment
const BackgroundWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -1,
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(4px) brightness(0.7)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(0,123,255,0.5), rgba(0,0,0,0.5))",
  },
});

// Main container with strict overflow control
const PageContainer = styled(Box)({
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Content wrapper with strict boundaries
const ContentWrapper = styled(Box)({
  width: "100%",
  maxWidth: "500px",
  margin: "20px",
  position: "relative",
  zIndex: 1,
  "& .MuiCard-root": {
    maxHeight: "95vh",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,0.2)",
      borderRadius: "2px",
    },
  },
});

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password strength analysis
  const passwordStrength = password.length > 0 ? zxcvbn(password).score : 0;
  const passwordSuggestions = password.length > 0 ? zxcvbn(password).feedback.suggestions : [];

  // Password requirements check
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const requirementsMet = Object.values(passwordRequirements).filter(Boolean).length;

  // Check token validity on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        if (!token) {
          setTokenValid(false);
          setError("Invalid or missing reset token");
        }
      } catch (err) {
        setTokenValid(false);
        setError("This reset link has expired or is invalid");
      }
    };

    checkTokenValidity();
  }, [token]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "error";
    if (passwordStrength === 1) return "warning";
    if (passwordStrength === 2) return "info";
    if (passwordStrength >= 3) return "success";
    return "error";
  };

  const getPasswordStrengthText = () => {
    const strengths = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return password.length > 0 ? strengths[passwordStrength] : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenValid) {
      setError("Invalid reset token. Please request a new password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (passwordStrength < 2 || requirementsMet < 3) {
      setError("Please choose a stronger password that meets the requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/api/password/reset/${token}`, {
        password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/authentication/sign-in"), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Password reset failed";
      setError(errorMessage);

      if (errorMessage.includes("invalid") || errorMessage.includes("expired")) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/authentication/forgot-password");
  };

  // Main render content
  const renderContent = () => {
    if (!tokenValid) {
      return (
        <Card sx={{ width: "100%", p: 3, maxHeight: "400px" }}>
          <MDBox textAlign="center" mb={3}>
            <Lock sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
            <MDTypography variant="h4" color="error" gutterBottom>
              Invalid Reset Link
            </MDTypography>
            <MDTypography variant="body2" color="text">
              This password reset link has expired or is invalid.
            </MDTypography>
          </MDBox>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Please request a new password reset link from the forgot password page."}
          </Alert>

          <MDBox display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
            <MDButton
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/authentication/sign-in")}
            >
              Back to Login
            </MDButton>
            <MDButton variant="gradient" color="primary" fullWidth onClick={handleGoBack}>
              Get New Reset Link
            </MDButton>
          </MDBox>
        </Card>
      );
    }

    if (success) {
      return (
        <Card sx={{ width: "100%", p: 3, maxHeight: "300px" }}>
          <MDBox textAlign="center">
            <CheckCircle sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
            <MDTypography variant="h4" color="success" gutterBottom>
              Password Reset Successful!
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              Your password has been updated successfully. Redirecting to login...
            </MDTypography>
            <LinearProgress color="success" />
          </MDBox>
        </Card>
      );
    }

    return (
      <Card sx={{ width: "100%", p: 3 }}>
        <MDBox textAlign="center" mb={3}>
          <LockOpen sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <MDTypography variant="h4" fontWeight="bold" gutterBottom>
            Reset Your Password
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Create a new strong password for your account
          </MDTypography>
        </MDBox>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <MDBox mb={2}>
            <MDInput
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </MDBox>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <MDBox mb={2}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <MDTypography variant="caption" fontWeight="medium">
                  Password Strength:
                </MDTypography>
                <MDTypography
                  variant="caption"
                  color={getPasswordStrengthColor()}
                  fontWeight="bold"
                >
                  {getPasswordStrengthText()}
                </MDTypography>
              </MDBox>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength + 1) * 25}
                color={getPasswordStrengthColor()}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </MDBox>
          )}

          {/* Confirm Password */}
          <MDBox mb={2}>
            <MDInput
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              error={confirmPassword.length > 0 && password !== confirmPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                Passwords do not match
              </MDTypography>
            )}
          </MDBox>

          {/* Password Suggestions */}
          {passwordSuggestions.length > 0 && (
            <Alert
              severity="info"
              icon={<Security />}
              sx={{
                mb: 2,
                py: 0.5,
                backgroundColor: darkMode ? "rgba(2, 136, 209, 0.12)" : "rgba(2, 136, 209, 0.08)",
                color: darkMode ? "white" : "text.primary",
                "& .MuiAlert-icon": {
                  color: darkMode ? "#0288d1" : "#0288d1",
                },
              }}
            >
              <MDTypography
                variant="caption"
                sx={{
                  color: darkMode ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                  fontWeight: "medium",
                }}
              >
                Suggestion: {passwordSuggestions[0]}
              </MDTypography>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                py: 0.5,
                backgroundColor: darkMode ? "rgba(211, 47, 47, 0.12)" : "rgba(211, 47, 47, 0.08)",
                color: darkMode ? "white" : "text.primary",
                "& .MuiAlert-icon": {
                  color: darkMode ? "#d32f2f" : "#d32f2f",
                },
              }}
            >
              <MDTypography
                variant="caption"
                sx={{
                  color: darkMode ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                  fontWeight: "medium",
                }}
              >
                {error}
              </MDTypography>
            </Alert>
          )}

          {/* Action Buttons */}
          <MDBox display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
            <MDButton
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/authentication/sign-in")}
              disabled={loading}
              startIcon={<ArrowBack />}
              size="medium"
            >
              Back to Login
            </MDButton>
            <MDButton
              type="submit"
              variant="gradient"
              color="primary"
              disabled={loading || passwordStrength < 2 || password !== confirmPassword}
              fullWidth
              size="medium"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </MDButton>
          </MDBox>

          {/* Security Note */}
          <MDBox mt={2} textAlign="center">
            <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
              🔒 Your password is encrypted and stored securely
            </MDTypography>
          </MDBox>
        </form>
      </Card>
    );
  };

  return (
    <>
      <BackgroundWrapper />
      <PageContainer>
        <ContentWrapper>{renderContent()}</ContentWrapper>
      </PageContainer>
    </>
  );
}

export default ResetPasswordPage;
