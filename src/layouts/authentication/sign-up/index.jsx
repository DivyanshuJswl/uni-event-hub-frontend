// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { styled } from "@mui/material/styles";
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import { Icon, IconButton, InputAdornment, Switch, Tooltip } from "@mui/material";
import PasswordGeneratorModal from "../components/PasswordGenerator";
import zxcvbn from "zxcvbn";
import { Box } from "@mui/system";
import { useAuth } from "context/AuthContext";


const bgImage = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758117993/bg-sign-up-cover_on4sqw.jpg";
// Add this styled component above your Cover function
const BackgroundWrapper = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(4px) brightness(0.7)",
    zIndex: 1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(0,123,255,0.5), rgba(0,0,0,0.5))",
    zIndex: 2,
  },
});

function Cover() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    sessionStorage.getItem("rememberMe") === "true" || false
  );
  const [branchError, setBranchError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const { signup, showToast } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleGenerator = () => setGeneratorOpen(!generatorOpen);

  const handleSubmit = async () => {
    // Validate required fields
    if (!name || !email || !password || !year || !branch) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    if (!agreedToTerms) {
      showToast("Please agree to the Terms and Conditions", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({
        name,
        email,
        password,
        year,
        branch,
      });

      if (result.success) {
        showToast("Registration successful! Redirecting to login...", "success");

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 1500);
      } else {
        showToast(result.message, "error");
        // Reset form fields on error
        setName("");
        setEmail("");
        setPassword("");
        setYear("");
        setBranch("");
        setAgreedToTerms(false);
      }
    } catch (err) {
      showToast("An unexpected error occurred", "error");
      // Reset form fields on error
      setName("");
      setEmail("");
      setPassword("");
      setYear("");
      setBranch("");
      setAgreedToTerms(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Save credentials if rememberMe is checked
  if (rememberMe) {
    sessionStorage.setItem("savedEmail", email);
    sessionStorage.setItem("savedPassword", password);
    sessionStorage.setItem("rememberMe", "true");
  } else {
    sessionStorage.removeItem("savedEmail");
    sessionStorage.removeItem("savedPassword");
    sessionStorage.removeItem("rememberMe");
  }
  const handleSetRememberMe = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    if (!newRememberMe) {
      sessionStorage.removeItem("savedEmail");
      sessionStorage.removeItem("savedPassword");
    }
  };
  useEffect(() => {
    if (password) {
      try {
        const result = zxcvbn(password);
        setPasswordStrength(result);
      } catch (error) {
        console.error("Error calculating password strength:", error);
        setPasswordStrength(null);
      }
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "#ff0000"; // Red for very weak
      case 1:
        return "#ff5252"; // Orange-red for weak
      case 2:
        return "#ffb142"; // Orange-yellow for fair
      case 3:
        return "#33d9b2"; // Teal for good
      case 4:
        return "#2ecc71"; // Green for strong
      default:
        return "#cccccc"; // Gray as fallback
    }
  };
  const getStrengthText = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <CoverLayout sx={{ minHeight: "100vh" }} image={bgImage}>
      <BackgroundWrapper />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Card sx={{ maxWidth: 375, zIndex: 10 }}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={2} pb={2} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setName(e.target.value)}
                type="text"
                label="Name"
                variant="standard"
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" gap={2} mb={2} alignItems="flex-end">
              <Tooltip
                open={Boolean(branchError)}
                title={branchError}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "error.main",
                      color: "white",
                      "& .MuiTooltip-arrow": {
                        color: "error.main",
                      },
                    },
                  },
                }}
              >
                <div>
                  <MDInput
                    label="Branch"
                    variant="standard"
                    fullWidth
                    onChange={(e) => {
                      const inputValue = e.target.value.toUpperCase();
                      setBranch(inputValue);
                      if (!["CSE", "ECE", "EEE", "ME", "CE", "IT"].includes(inputValue)) {
                        setBranchError("Invalid branch. Valid options: CSE, ECE, EEE, ME, CE, IT");
                      } else {
                        setBranchError("");
                      }
                    }}
                    value={branch}
                    sx={{
                      "& .MuiInput-input": {
                        paddingBottom: "6px",
                        minHeight: "1.4375em",
                      },
                    }}
                  />
                </div>
              </Tooltip>
              <MDInput
                onChange={(e) => {
                  const value = Math.min(Math.max(null, e.target.value), 5);
                  setYear(value);
                }}
                type="number"
                label="Year"
                variant="standard"
                fullWidth
                inputProps={{
                  min: 1,
                  max: 5,
                }}
                value={year} // Make sure to define year in your state
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                label="Email"
                variant="standard"
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={toggleGenerator} size="small">
                        <Icon sx={{ cursor: "pointer", color: darkMode ? "#fff" : {} }}>key</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
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
              {password && (
                <MDBox mt={1} mb={2}>
                  <Box
                    sx={{
                      height: 4,
                      width: "100%",
                      backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${passwordStrength ? (passwordStrength.score + 1) * 20 : 0}%`,
                        backgroundColor: passwordStrength
                          ? `${getStrengthColor(passwordStrength.score)}`
                          : "#ccc",
                        transition: "width 0.3s ease, background-color 0.3s ease",
                      }}
                    />
                  </Box>
                  {passwordStrength && (
                    <MDTypography variant="caption" color="text" sx={{ mt: 0.5, display: "block" }}>
                      Strength: {getStrengthText(passwordStrength.score)}
                      {passwordStrength.score < 2 && (
                        <MDBox component="span" color="error.main" ml={1}>
                          {" "}
                          - {passwordStrength.feedback.suggestions[0]}
                        </MDBox>
                      )}
                    </MDTypography>
                  )}
                </MDBox>
              )}
            </MDBox>
            <PasswordGeneratorModal
              open={generatorOpen}
              onClose={() => setGeneratorOpen(false)}
              onPasswordGenerated={(password) => {
                setPassword(password);
                setGeneratorOpen(false);
              }}
            />
            {/* remember me ?  */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} color="info" />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                sx={{
                  "&.Mui-checked": {
                    color: "info.main",
                  },
                  // Make outline more visible in light mode
                  "& .MuiSvgIcon-root": {
                    border: darkMode ? "1px solid #fff" : "1px solid #000", // black outline in light mode
                    borderRadius: "4px", // optional: to match the checkbox shape
                  },
                }}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
                <MDTypography
                  component="span"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                  onClick={() => {
                    window.open(
                      "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your terms and conditions link
                      "_blank"
                    );
                  }}
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Terms and Conditions
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleSubmit}
                fullWidth
                disabled={isLoading}
                sx={{
                  zIndex: 100,
                }}
              >
                {isLoading ? "Registering..." : "Sign Up"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
