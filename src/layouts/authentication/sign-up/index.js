// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { Icon, InputAdornment, InputLabel, MenuItem, Select, Switch, Tooltip } from "@mui/material";

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
  const [err, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true" || false
  );
  const [branchError, setBranchError] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!name || !email || !password || !year || !branch) {
      toast.warning("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!agreedToTerms) {
      toast.warning("Please agree to the Terms and Conditions", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/api/auth/signup",
        {
          name,
          email,
          password,
          year,
          branch,
        },
        { withCredentials: true }
      );

      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 3000);
    } catch (err) {
      let errorMessage = "Registration failed";

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || "Validation error";
        } else if (err.response.status === 409) {
          errorMessage = "Email already exists";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later";
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
  const handleSetRememberMe = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    if (!newRememberMe) {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }
  };

  return (
    <CoverLayout>
      <BackgroundWrapper />
      {/* Toast Container */}
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

      <Card sx={{ position: "relative", zIndex: 10 }}>
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
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
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
