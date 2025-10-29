import { useState, useCallback, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

import { Divider, Icon, InputAdornment } from "@mui/material";
import ResetPasswordModal from "../forgotPassword";
import HCaptchaComponent from "./hCaptcha";

function Basic() {
  const bgImage =
    "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758078677/bg-sign-in-basic_yj4cue.jpg";
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const { login, googleLogin, showToast } = useAuth();
  const production = import.meta.env.VITE_NODE_ENV === "production";
  const googleButtonRef = useRef(null);

  // Consolidated form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Consolidated UI state
  const [uiState, setUiState] = useState({
    isLoading: false,
    showPassword: false,
    resetOpen: false,
    rememberMe: sessionStorage.getItem("rememberMe") === "true" || false,
  });

  // Captcha state
  const [captchaState, setCaptchaState] = useState({
    token: null,
    error: "",
    reset: false,
  });

  // Load saved credentials if rememberMe was checked
  useEffect(() => {
    if (uiState.rememberMe) {
      const savedEmail = sessionStorage.getItem("savedEmail");
      const savedPassword = sessionStorage.getItem("savedPassword");
      if (savedEmail) setFormData((prev) => ({ ...prev, email: savedEmail }));
      if (savedPassword) setFormData((prev) => ({ ...prev, password: savedPassword }));
    }
  }, []);

  // Memoized handlers for form data updates
  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleResetSubmit = useCallback(
    (email) => {
      console.log("Reset password for:", email);
      showToast("Reset password link sent to " + email, "success");
      setUiState((prev) => ({ ...prev, resetOpen: false }));
    },
    [showToast]
  );

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setCaptchaState((prev) => ({ ...prev, error: "" }));

    if (!formData.email || !formData.password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    if (production && !captchaState.token) {
      setCaptchaState((prev) => ({ ...prev, error: "Please complete the captcha verification" }));
      showToast("Please complete the captcha verification", "warning");
      return;
    }

    // Save credentials if rememberMe is checked
    if (uiState.rememberMe) {
      sessionStorage.setItem("savedEmail", formData.email);
      sessionStorage.setItem("savedPassword", formData.password);
      sessionStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.removeItem("savedEmail");
      sessionStorage.removeItem("savedPassword");
      sessionStorage.removeItem("rememberMe");
    }

    try {
      setUiState((prev) => ({ ...prev, isLoading: true }));
      const result = await login({
        email: formData.email,
        password: formData.password,
        captchaToken: captchaState.token,
      });

      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
        const role = result.data?.role;
        setTimeout(() => {
          navigate(role === "participant" ? "/user-dashboard" : "/organizer-dashboard");
        }, 1500);
      } else {
        setCaptchaState((prev) => ({ ...prev, reset: !prev.reset, token: null }));
        showToast(result.message);
      }
    } catch (err) {
      setCaptchaState((prev) => ({ ...prev, reset: !prev.reset, token: null }));
      console.log(err);
      showToast("An unexpected error occurred");
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse);

      if (result.success) {
        const { isNewUser, role } = result;

        showToast(
          isNewUser ? "Welcome! Account created successfully." : "Login successful! Redirecting...",
          "success"
        );

        setTimeout(() => {
          navigate(
            isNewUser && role === "participant"
              ? "/complete-profile"
              : role === "participant"
                ? "/user-dashboard"
                : "/organizer-dashboard"
          );
        }, 700);
      } else {
        showToast(result.message);
      }
    } catch (error) {
      showToast("Google login failed");
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setUiState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleSetRememberMe = useCallback(() => {
    setUiState((prev) => {
      const newRememberMe = !prev.rememberMe;
      if (!newRememberMe) {
        sessionStorage.removeItem("savedEmail");
        sessionStorage.removeItem("savedPassword");
      }
      return { ...prev, rememberMe: newRememberMe };
    });
  }, []);

  const handleCaptchaVerify = useCallback((token) => {
    setCaptchaState((prev) => ({ ...prev, token, error: "" }));
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaState((prev) => ({ ...prev, token: null, error: "Captcha verification failed" }));
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaState((prev) => ({
      ...prev,
      token: null,
      error: "Captcha expired - please verify again",
    }));
  }, []);

  return (
    <BasicLayout image={bgImage}>
      <ToastContainer />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                onClick={() => {
                  const googleBtn = document.querySelector('[aria-labelledby*="button-label"]');
                  if (googleBtn) googleBtn.click();
                }}
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => updateFormField("email", e.target.value)}
                type="email"
                label="Email"
                fullWidth
                value={formData.email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => updateFormField("password", e.target.value)}
                type={uiState.showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={formData.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon
                        sx={{ cursor: "pointer", color: darkMode ? "#fff" : {} }}
                        onClick={togglePasswordVisibility}
                      >
                        {uiState.showPassword ? "visibility_off" : "visibility"}
                      </Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              mt={2}
            >
              <MDBox display="flex" alignItems="center">
                <Switch
                  name="rememberme"
                  checked={uiState.rememberMe}
                  onChange={handleSetRememberMe}
                  color="info"
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}
                >
                  Remember me
                </MDTypography>
              </MDBox>
              <MDTypography
                variant="button"
                color="info"
                sx={{ cursor: "pointer", textAlign: "right" }}
                onClick={() => setUiState((prev) => ({ ...prev, resetOpen: true }))}
              >
                Forgot password?
              </MDTypography>
              <ResetPasswordModal
                open={uiState.resetOpen}
                onClose={() => setUiState((prev) => ({ ...prev, resetOpen: false }))}
                onSubmit={handleResetSubmit}
              />
            </MDBox>
            {production && (
              <HCaptchaComponent
                onVerify={handleCaptchaVerify}
                onError={handleCaptchaError}
                onExpire={handleCaptchaExpire}
                reset={captchaState.reset}
              />
            )}
            {captchaState.error && (
              <MDTypography
                variant="caption"
                color="error"
                sx={{
                  mt: -2,
                  mb: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon sx={{ mr: 0.8, color: "error.main" }} fontSize="small">
                  error
                </Icon>
                <div>{captchaState.error}</div>
              </MDTypography>
            )}
            <MDBox mt={2} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={uiState.isLoading}
              >
                {uiState.isLoading ? "Signing in..." : "Sign in"}
              </MDButton>
            </MDBox>
            <Divider />
            <MDBox
              mt={2}
              mb={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <>
                <div style={{ display: "none" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      showToast("Google login failed. Please try again.");
                    }}
                    ref={googleButtonRef}
                  />
                </div>
                <MDButton
                  variant="outlined"
                  color="info"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={() => {
                    // Trigger the hidden Google button
                    const googleBtn = document.querySelector('[aria-labelledby*="button-label"]');
                    if (googleBtn) googleBtn.click();
                  }}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.95rem",
                    padding: "10px 24px",
                  }}
                >
                  Sign in with Google
                </MDButton>
              </>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
