import { useState } from "react";
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
  const bgImage = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758078677/bg-sign-in-basic_yj4cue.jpg";
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [resetOpen, setResetOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    sessionStorage.getItem("rememberMe") === "true" || false
  );
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState("");
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const { login, googleLogin, showToast } = useAuth();
  // Load saved credentials if rememberMe was checked
  useState(() => {
    if (rememberMe) {
      const savedEmail = sessionStorage.getItem("savedEmail");
      const savedPassword = sessionStorage.getItem("savedPassword");
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  const handleResetSubmit = (email) => {
    // TODO: Add your reset logic here (API call, toast, etc.)
    console.log("Reset password for:", email);
    showToast("Reset password link sent to " + email, "success");
    setResetOpen(false);
  };

  const handleSubmit = async () => {
    setCaptchaError("");
    if (!email || !password) {
      showToast("Please fill in all fields", "warning");
      return;
    }
    if (!captchaToken) {
      setCaptchaError("Please complete the captcha verification");
      showToast("Please complete the captcha verification", "warning");
      return;
    }

    //  credentials if rememberMe is checked
    if (rememberMe) {
      sessionStorage.setItem("savedEmail", email);
      sessionStorage.setItem("savedPassword", password);
      sessionStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.removeItem("savedEmail");
      sessionStorage.removeItem("savedPassword");
      sessionStorage.removeItem("rememberMe");
    }

    try {
      setIsLoading(true);
      const result = await login({
        email,
        password,
        captchaToken,
      });
      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
        const role = result.data?.role;
        setTimeout(() => {
          navigate(role === "participant" ? "/user-dashboard" : "/organizer-dashboard");
        }, 1500);
      } else {
        setResetCaptcha((prev) => !prev); // Trigger captcha reset
        setCaptchaToken(null);
        showToast(result.message);
      }
    } catch (err) {
      setResetCaptcha((prev) => !prev); // Trigger captcha reset
      setCaptchaToken(null);
      console.log(err);
      showToast("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSetRememberMe = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    if (!newRememberMe) {
      sessionStorage.removeItem("savedEmail");
      sessionStorage.removeItem("savedPassword");
    }
  };

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
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                label="Email"
                fullWidth
                value={email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon
                        sx={{ cursor: "pointer", color: darkMode ? "#fff" : {} }}
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? "visibility_off" : "visibility"}
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
                  checked={rememberMe}
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
                onClick={() => setResetOpen(true)}
              >
                Forgot password?
              </MDTypography>
              <ResetPasswordModal
                open={resetOpen}
                onClose={() => setResetOpen(false)}
                onSubmit={handleResetSubmit}
              />
            </MDBox>
            <HCaptchaComponent
              onVerify={(token) => {
                setCaptchaToken(token);
                setCaptchaError("");
              }}
              onError={() => {
                setCaptchaToken(null);
                setCaptchaError("Captcha verification failed");
              }}
              onExpire={() => {
                setCaptchaToken(null);
                setCaptchaError("Captcha expired - please verify again");
              }}
              reset={resetCaptcha}
            />
            {captchaError && (
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
                <Icon // padding right
                  sx={{ mr: 0.8, color: "error.main" }} // Adjust color based on theme
                  fontSize="small"
                >
                  error
                </Icon>
                <div>{captchaError}</div>
              </MDTypography>
            )}
            <MDBox mt={2} mb={1} fullWidth>
              <MDButton
                onClick={handleSubmit}
                variant="gradient"
                color="info"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
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
              fullWidth
            >
              <GoogleLogin
                theme={darkMode ? "filled_blue" : "filled_blue"}
                size="large"
                shape="pill"
                type="standard"
                logo_alignment="center"
                onSuccess={handleGoogleLogin}
                onError={() => {
                  showToast("Google login failed. Please try again.");
                }}
              />
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
