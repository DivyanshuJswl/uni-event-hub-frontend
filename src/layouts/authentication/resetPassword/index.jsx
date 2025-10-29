import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, LinearProgress, Alert, IconButton } from "@mui/material";
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
import { useNotifications } from "context/NotifiContext";
import axios from "axios";
import { styled } from "@mui/system";
import zxcvbn from "zxcvbn";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const bgImage =
  "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758117993/bg-sign-up-cover_on4sqw.jpg";

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

const PageContainer = styled(Box)({
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

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
  const { showToast } = useNotifications();

  // Consolidated form state
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    passwordFocused: false,
  });

  // Consolidated UI state
  const [uiState, setUiState] = useState({
    loading: false,
    error: "",
    success: false,
    tokenValid: true,
  });

  // Memoized password analysis
  const passwordAnalysis = useMemo(() => {
    if (formState.password.length === 0) {
      return {
        strength: 0,
        suggestions: [],
        requirements: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
        requirementsMet: 0,
      };
    }

    const analysis = zxcvbn(formState.password);
    const requirements = {
      length: formState.password.length >= 8,
      uppercase: /[A-Z]/.test(formState.password),
      lowercase: /[a-z]/.test(formState.password),
      number: /[0-9]/.test(formState.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formState.password),
    };

    return {
      strength: analysis.score,
      suggestions: analysis.feedback.suggestions,
      requirements,
      requirementsMet: Object.values(requirements).filter(Boolean).length,
    };
  }, [formState.password]);

  // Password strength helpers
  const getPasswordStrengthColor = useCallback(() => {
    const { strength } = passwordAnalysis;
    if (strength === 0) return "error";
    if (strength === 1) return "warning";
    if (strength === 2) return "info";
    if (strength >= 3) return "success";
    return "error";
  }, [passwordAnalysis]);

  const getPasswordStrengthText = useCallback(() => {
    const strengths = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return formState.password.length > 0 ? strengths[passwordAnalysis.strength] : "";
  }, [formState.password, passwordAnalysis]);

  // Check token validity
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        setUiState((prev) => ({
          ...prev,
          tokenValid: false,
          error: "Invalid or missing reset token",
        }));
        showToast("Invalid reset token", "error", "Token Error");
      }
    };

    checkTokenValidity();
  }, [token, showToast]);

  // Update form field
  const updateFormField = useCallback((field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Toggle visibility handlers
  const togglePasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
  }, []);

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      formState.password === formState.confirmPassword &&
      passwordAnalysis.strength >= 2 &&
      passwordAnalysis.requirementsMet >= 3
    );
  }, [formState.password, formState.confirmPassword, passwordAnalysis]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!uiState.tokenValid) {
        showToast("Invalid reset token. Please request a new link.", "error", "Invalid Token");
        return;
      }

      if (formState.password !== formState.confirmPassword) {
        setUiState((prev) => ({ ...prev, error: "Passwords don't match" }));
        showToast("Passwords don't match", "warning", "Validation Error");
        return;
      }

      if (!isFormValid) {
        showToast("Please choose a stronger password", "warning", "Weak Password");
        return;
      }

      setUiState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        await axios.post(`${BASE_URL}/api/password/reset/${token}`, {
          password: formState.password,
        });

        setUiState((prev) => ({ ...prev, success: true, loading: false }));
        showToast("Redirecting to login...", "success", "Password Reset Successful");

        setTimeout(() => navigate("/authentication/sign-in"), 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Password reset failed";
        setUiState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));

        if (errorMessage.includes("invalid") || errorMessage.includes("expired")) {
          setUiState((prev) => ({ ...prev, tokenValid: false }));
        }

        showToast(errorMessage, "error", "Reset Failed");
      }
    },
    [
      uiState.tokenValid,
      formState.password,
      formState.confirmPassword,
      isFormValid,
      token,
      navigate,
      showToast,
    ]
  );

  // Navigation handlers
  const handleGoToLogin = useCallback(() => {
    navigate("/authentication/sign-in");
  }, [navigate]);

  // Render invalid token state
  const renderInvalidToken = useCallback(
    () => (
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
          {uiState.error || "Please request a new password reset link."}
        </Alert>

        <MDBox display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
          <MDButton variant="outlined" color="secondary" fullWidth onClick={handleGoToLogin}>
            Back to Login
          </MDButton>
          <MDButton variant="gradient" color="primary" fullWidth onClick={handleGoToLogin}>
            Get New Reset Link
          </MDButton>
        </MDBox>
      </Card>
    ),
    [uiState.error, handleGoToLogin]
  );

  // Render success state
  const renderSuccess = useCallback(
    () => (
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
    ),
    []
  );

  // Render password match indicator
  const renderPasswordMatchIndicator = useMemo(() => {
    if (formState.confirmPassword.length === 0) return null;

    const passwordsMatch = formState.password === formState.confirmPassword;

    return (
      <MDTypography
        variant="caption"
        color={passwordsMatch ? "success" : "error"}
        sx={{ mt: 0.5, display: "block" }}
      >
        {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
      </MDTypography>
    );
  }, [formState.password, formState.confirmPassword]);

  // Render main form
  const renderForm = useCallback(
    () => (
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
              type={formState.showPassword ? "text" : "password"}
              label="New Password"
              value={formState.password}
              onChange={(e) => updateFormField("password", e.target.value)}
              onFocus={() => updateFormField("passwordFocused", true)}
              onBlur={() => updateFormField("passwordFocused", false)}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    size="small"
                    color={darkMode ? "white" : "default"}
                  >
                    {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </MDBox>

          {/* Password Strength Indicator */}
          {formState.password.length > 0 && (
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
                value={(passwordAnalysis.strength + 1) * 25}
                color={getPasswordStrengthColor()}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </MDBox>
          )}

          {/* Confirm Password */}
          <MDBox mb={2}>
            <MDInput
              type={formState.showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              value={formState.confirmPassword}
              onChange={(e) => updateFormField("confirmPassword", e.target.value)}
              fullWidth
              required
              error={
                formState.confirmPassword.length > 0 &&
                formState.password !== formState.confirmPassword
              }
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    size="small"
                    color={darkMode ? "white" : "default"}
                  >
                    {formState.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {renderPasswordMatchIndicator}
          </MDBox>

          {/* Password Suggestions */}
          {passwordAnalysis.suggestions.length > 0 && (
            <Alert
              severity="info"
              icon={<Security />}
              sx={{
                mb: 2,
                py: 0.5,
                backgroundColor: darkMode ? "rgba(2, 136, 209, 0.12)" : "rgba(2, 136, 209, 0.08)",
              }}
            >
              <MDTypography variant="caption" sx={{ fontWeight: "medium" }}>
                Suggestion: {passwordAnalysis.suggestions[0]}
              </MDTypography>
            </Alert>
          )}

          {/* Error Message */}
          {uiState.error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                py: 0.5,
                backgroundColor: darkMode ? "rgba(211, 47, 47, 0.12)" : "rgba(211, 47, 47, 0.08)",
              }}
            >
              <MDTypography variant="caption" sx={{ fontWeight: "medium" }}>
                {uiState.error}
              </MDTypography>
            </Alert>
          )}

          {/* Action Buttons */}
          <MDBox display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
            <MDButton
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleGoToLogin}
              disabled={uiState.loading}
              startIcon={<ArrowBack />}
              size="medium"
            >
              Back to Login
            </MDButton>
            <MDButton
              type="submit"
              variant="gradient"
              color="primary"
              disabled={uiState.loading || !isFormValid}
              fullWidth
              size="medium"
            >
              {uiState.loading ? "Resetting..." : "Reset Password"}
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
    ),
    [
      formState,
      uiState,
      passwordAnalysis,
      isFormValid,
      darkMode,
      handleSubmit,
      handleGoToLogin,
      updateFormField,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      getPasswordStrengthColor,
      getPasswordStrengthText,
      renderPasswordMatchIndicator,
    ]
  );

  // Main render
  return (
    <>
      <BackgroundWrapper />
      <PageContainer>
        <ContentWrapper>
          {!uiState.tokenValid
            ? renderInvalidToken()
            : uiState.success
              ? renderSuccess()
              : renderForm()}
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default ResetPasswordPage;
