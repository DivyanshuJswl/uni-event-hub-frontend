import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

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

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { Divider, Icon, InputAdornment } from "@mui/material";
import ResetPasswordModal from "../forgotPassword";

function Basic() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sideNavColor } = controller;
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true" || false
  );

  // Load saved credentials if rememberMe was checked
  useState(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem("savedEmail");
      const savedPassword = localStorage.getItem("savedPassword");
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  const handleResetSubmit = (email) => {
    // TODO: Add your reset logic here (API call, toast, etc.)
    console.log("Reset password for:", email);
    toast.success("Reset password link sent to " + email, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setResetOpen(false);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warning("Please fill in all fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Save credentials if rememberMe is checked
    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const { token, data } = res?.data;
      const { student } = data;
      const role = student?.role;
      console.log(role);
      console.log(res?.data);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate(role === "participant" ? "/user-dashboard" : "/organizer-dashboard");
      }, 2000);
    } catch (err) {
      console.log(err);
      let errorMessage = "Login failed";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later";
        } else {
          errorMessage = err.response.data.message || "Login failed";
        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSetRememberMe = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    if (!newRememberMe) {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
                <Switch checked={rememberMe} onChange={handleSetRememberMe} color="info" />
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
                // width="330px"
                logo_alignment="center"
                onSuccess={async (credentialResponse) => {
                  // console.log("Google credential response:", credentialResponse);
                  if (!credentialResponse || !credentialResponse.credential) {
                    console.error("No credential received from Google");
                    return;
                  }
                  // This is the ID token (JWT)
                  const idToken = credentialResponse.credential;
                  // Send to backend
                  // console.log("ID Token:", idToken);
                  const res = await axios.post(`${BASE_URL}/api/auth/google`, {
                    credential: idToken,
                  });
                  // console.log("Google login response:", res);
                  if (!res?.data || !res.data.token) {
                    throw new Error("Invalid response from Google login");
                  }
                  const { token, data, isNewUser } = res?.data; // Add isNewUser flag from backend
                  const { student } = data;
                  const role = student?.role;
                  localStorage.setItem("token", token);
                  localStorage.setItem("role", role);
                  toast.success(
                    isNewUser
                      ? "Welcome! Account created successfully."
                      : "Login successful! Redirecting...",
                    {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    }
                  );
                  setTimeout(() => {
                    navigate(
                      isNewUser && role === "participant"
                        ? "/complete-profile" // Redirect new users to profile completion
                        : role === "participant"
                        ? "/user-dashboard"
                        : "/organizer-dashboard"
                    );
                  }, 2000);
                }}
                onError={() => {
                  toast.error("Google login failed. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
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
