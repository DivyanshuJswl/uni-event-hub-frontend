import { Link, useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
  useDeferredValue,
  useId,
} from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { useNotifications } from "context/NotifiContext";
import { Icon, IconButton, InputAdornment, Switch, Tooltip, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PasswordGeneratorModal from "../components/PasswordGenerator";
import zxcvbn from "zxcvbn";
import { Box } from "@mui/system";
import { useAuth } from "context/AuthContext";

const bgImage =
  "https://res.cloudinary.com/dh5cebjwj/image/upload/v1758117993/bg-sign-up-cover_on4sqw.jpg";

// Constants
const ALLOWED_BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "OTHERS"];
const MIN_YEAR = 1;
const MAX_YEAR = 5;

// Validation utilities (memoized outside component for performance)
const validators = {
  name: (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(trimmed)) return "Name can only contain letters and spaces";
    return "";
  },

  username: (username) => {
    if (!username) return "Username is required";
    if (username.length < 4) return "Username must be at least 4 characters";
    if (username.length > 24) return "Username must be less than 24 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username can only contain letters, numbers, and underscores";
    return "";
  },

  email: (email) => {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Please enter a valid email address";
    return "";
  },

  password: (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  },

  year: (year) => {
    const yearNum = parseInt(year);
    if (!year) return "Year is required";
    if (isNaN(yearNum)) return "Year must be a number";
    if (yearNum < MIN_YEAR || yearNum > MAX_YEAR)
      return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
    return "";
  },

  branch: (branch) => {
    if (!branch) return "Branch is required";
    if (!ALLOWED_BRANCHES.includes(branch.toUpperCase()))
      return `Valid branches: ${ALLOWED_BRANCHES.join(", ")}`;
    return "";
  },
};

// Styled component
const BackgroundWrapper = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "110vh",
  zIndex: 0,
  overflow: "auto",
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
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const { signup } = useAuth();

  // Generate unique IDs for accessibility
  const nameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const yearId = useId();
  const branchId = useId();

  // Use transition for non-blocking UI updates
  const [isPending, startTransition] = useTransition();

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    year: "",
    branch: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Username availability state
  const [usernameState, setUsernameState] = useState({
    checking: false,
    available: null,
  });

  // UI state
  const [uiState, setUiState] = useState({
    isLoading: false,
    showPassword: false,
    generatorOpen: false,
    agreedToTerms: false,
    rememberMe: localStorage.getItem("rememberMe") === "true" || false,
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Deferred value for username to optimize rendering during typing
  const deferredUsername = useDeferredValue(formData.username);

  // Memoized handlers
  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setUiState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const toggleGenerator = useCallback(() => {
    setUiState((prev) => ({ ...prev, generatorOpen: !prev.generatorOpen }));
  }, []);

  const handleSetRememberMe = useCallback(() => {
    setUiState((prev) => {
      const newRememberMe = !prev.rememberMe;
      if (!newRememberMe) {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }
      return { ...prev, rememberMe: newRememberMe };
    });
  }, []);

  // Check username availability
  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username) {
      setUsernameState({ checking: false, available: null });
      return;
    }

    const validationError = validators.username(username);
    if (validationError) {
      setUsernameState({ checking: false, available: false });
      return;
    }

    setUsernameState({ checking: true, available: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/profile/check-username/${username}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();

      startTransition(() => {
        setUsernameState({ checking: false, available: data.available });
      });
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameState({ checking: false, available: null });
    }
  }, []);

  // Debounced username check effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (deferredUsername) {
        checkUsernameAvailability(deferredUsername);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [deferredUsername, checkUsernameAvailability]);

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      try {
        const result = zxcvbn(formData.password);
        setPasswordStrength(result);
      } catch (error) {
        console.error("Error calculating password strength:", error);
        setPasswordStrength(null);
      }
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  // Save/remove credentials based on rememberMe
  useEffect(() => {
    if (uiState.rememberMe) {
      localStorage.setItem("savedEmail", formData.email);
      localStorage.setItem("savedPassword", formData.password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");
    }
  }, [uiState.rememberMe, formData.email, formData.password]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validators[field]?.(formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Check username availability
    if (!formData.username || usernameState.available === false) {
      newErrors.username = "Username is not available";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, usernameState.available]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validate terms agreement
    if (!uiState.agreedToTerms) {
      showToast("Please agree to the Terms and Conditions", "warning");
      return;
    }

    // Validate all fields
    if (!validateForm()) {
      showToast("Please fix all errors before submitting", "error", "Validation Error");
      return;
    }

    setUiState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await signup({
        name: formData.name.trim(),
        username: formData.username.toLowerCase(),
        email: formData.email.trim(),
        password: formData.password,
        year: parseInt(formData.year),
        branch: formData.branch.toUpperCase(),
      });

      if (result.success) {
        showToast("Registration successful! Redirecting to login...", "success", "User registered");

        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 1500);
      } else {
        showToast(result.message, "error");
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          year: "",
          branch: "",
        });
        setUiState((prev) => ({ ...prev, agreedToTerms: false }));
      }
    } catch (err) {
      showToast("An unexpected error occurred", "error");
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        year: "",
        branch: "",
      });
      setUiState((prev) => ({ ...prev, agreedToTerms: false }));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Memoized strength color and text
  const getStrengthColor = useMemo(
    () => (score) => {
      const colors = {
        0: "#ff0000",
        1: "#ff5252",
        2: "#ffb142",
        3: "#33d9b2",
        4: "#2ecc71",
      };
      return colors[score] || "#cccccc";
    },
    []
  );

  const getStrengthText = useMemo(
    () => (score) => {
      const texts = {
        0: "Very Weak",
        1: "Weak",
        2: "Fair",
        3: "Good",
        4: "Strong",
      };
      return texts[score] || "";
    },
    []
  );

  // Memoized username helper text
  const usernameHelperText = useMemo(() => {
    if (errors.username) return errors.username;
    if (usernameState.checking) return "Checking availability...";
    if (usernameState.available === true) return "Username available!";
    if (usernameState.available === false) return "Username taken";
    return "";
  }, [errors.username, usernameState]);

  return (
    <CoverLayout sx={{ minHeight: "100vh" }} image={bgImage}>
      <BackgroundWrapper />
      <Card sx={{ maxWidth: 450, zIndex: 10, mx: "auto" }}>
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
            Create your account to get started
          </MDTypography>
        </MDBox>

        <MDBox pt={1.5} pb={2} px={5}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <MDBox mb={1.5}>
              <MDInput
                id={nameId}
                onChange={(e) => updateFormField("name", e.target.value)}
                type="text"
                label="Full Name"
                variant="standard"
                fullWidth
                value={formData.name}
                error={!!errors.name}
                helperText={
                  <MDTypography variant="caption" color="error">
                    {errors.name}
                  </MDTypography>
                }
                inputProps={{
                  "aria-describedby": errors.name ? `${nameId}-error` : undefined,
                }}
              />
            </MDBox>

            {/* Username Field */}
            <MDBox mb={1.5}>
              <MDInput
                id={usernameId}
                value={formData.username}
                onChange={(e) => updateFormField("username", e.target.value.toLowerCase())}
                label="User name"
                variant="standard"
                fullWidth
                helperText={
                  <MDTypography
                    variant="caption"
                    color={usernameState.available === true ? "success" : "error"}
                  >
                    {usernameHelperText}
                  </MDTypography>
                }
                placeholder="Enter username (lowercase)"
                InputProps={{
                  ...(formData.username && {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          animation: "fadeIn 0.2s ease-in",
                          "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateX(-4px)" },
                            to: { opacity: 1, transform: "translateX(0)" },
                          },
                        }}
                      >
                        <MDTypography variant="body3" mr={0.5} color="info">
                          @
                        </MDTypography>
                      </InputAdornment>
                    ),
                  }),
                  endAdornment: usernameState.checking ? (
                    <CircularProgress size={16} />
                  ) : usernameState.available === true ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : usernameState.available === false ? (
                    <ErrorIcon color="error" fontSize="small" />
                  ) : null,
                }}
                inputProps={{
                  "aria-describedby": errors.username ? `${usernameId}-error` : undefined,
                }}
              />
            </MDBox>

            {/* Email Field */}
            <MDBox mb={1.5}>
              <MDInput
                id={emailId}
                onChange={(e) => updateFormField("email", e.target.value)}
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email}
                error={!!errors.email}
                helperText={
                  <MDTypography variant="caption" color="error">
                    {errors.email}
                  </MDTypography>
                }
                inputProps={{
                  "aria-describedby": errors.email ? `${emailId}-error` : undefined,
                }}
              />
            </MDBox>

            {/* Year and Branch */}
            <MDBox display="flex" gap={2} mb={1.5} alignItems="flex-start">
              <MDBox flex={1}>
                <MDInput
                  id={yearId}
                  onChange={(e) => {
                    const value = Math.min(Math.max(1, e.target.value), 5);
                    updateFormField("year", value);
                  }}
                  type="number"
                  label="Year"
                  variant="standard"
                  fullWidth
                  inputProps={{
                    min: 1,
                    max: 5,
                    "aria-describedby": errors.year ? `${yearId}-error` : undefined,
                  }}
                  value={formData.year}
                  error={!!errors.year}
                  helperText={
                    <MDTypography variant="caption" color="error">
                      {errors.year}
                    </MDTypography>
                  }
                />
              </MDBox>

              <MDBox flex={1}>
                <Tooltip
                  open={Boolean(errors.branch && formData.branch)}
                  title={errors.branch}
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "error.main",
                        "& .MuiTooltip-arrow": {
                          color: "error.main",
                        },
                      },
                    },
                  }}
                >
                  <MDInput
                    id={branchId}
                    label="Branch"
                    variant="standard"
                    fullWidth
                    onChange={(e) => {
                      const inputValue = e.target.value.toUpperCase();
                      updateFormField("branch", inputValue);
                    }}
                    value={formData.branch}
                    error={!!errors.branch}
                    helperText={
                      <MDTypography variant="caption" color="error">
                        {errors.branch}
                      </MDTypography>
                    }
                    placeholder="CSE, ECE, etc."
                    inputProps={{
                      "aria-describedby": errors.branch ? `${branchId}-error` : undefined,
                    }}
                  />
                </Tooltip>
              </MDBox>
            </MDBox>

            {/* Password Field */}
            <MDBox mb={1.5}>
              <MDInput
                id={passwordId}
                onChange={(e) => updateFormField("password", e.target.value)}
                type={uiState.showPassword ? "text" : "password"}
                label="Password"
                variant="standard"
                fullWidth
                value={formData.password}
                error={!!errors.password}
                helperText={
                  <MDTypography variant="caption" color="error">
                    {errors.password}
                  </MDTypography>
                }
                InputProps={{
                  ...(formData.password && {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={toggleGenerator} size="small">
                          <Icon
                            sx={{
                              cursor: "pointer",
                              color: darkMode ? "#fff" : "info.main",
                              animation: "fadeIn 0.2s ease-in",
                              "@keyframes fadeIn": {
                                from: { opacity: 0, transform: "scale(0.8)" },
                                to: { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          >
                            key
                          </Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }),
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
                inputProps={{
                  "aria-describedby": errors.password ? `${passwordId}-error` : undefined,
                }}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <MDBox mt={1} mb={1.5}>
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
                          ? getStrengthColor(passwordStrength.score)
                          : "#ccc",
                        transition: "width 0.3s ease, background-color 0.3s ease",
                      }}
                    />
                  </Box>
                  {passwordStrength && (
                    <MDTypography variant="caption" color="text" sx={{ mt: 0.5, display: "block" }}>
                      Strength: {getStrengthText(passwordStrength.score)}
                      {passwordStrength.score < 2 && passwordStrength.feedback.suggestions[0] && (
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
              open={uiState.generatorOpen}
              onClose={() => setUiState((prev) => ({ ...prev, generatorOpen: false }))}
              onPasswordGenerated={(password) => {
                updateFormField("password", password);
                setUiState((prev) => ({ ...prev, generatorOpen: false }));
              }}
            />

            {/* Remember Me */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={uiState.rememberMe} onChange={handleSetRememberMe} color="info" />
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

            {/* Terms and Conditions */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={uiState.agreedToTerms}
                onChange={() =>
                  setUiState((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms }))
                }
                sx={{
                  "&.Mui-checked": {
                    color: "info.main",
                  },
                  "& .MuiSvgIcon-root": {
                    border: darkMode ? "1px solid #fff" : "1px solid #000",
                    borderRadius: "4px",
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
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                  onClick={() => {
                    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
                  }}
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Terms and Conditions
                </MDTypography>
              </MDTypography>
            </MDBox>

            {/* Submit Button */}
            <MDBox mt={1} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={uiState.isLoading || usernameState.checking || isPending}
                sx={{ zIndex: 100 }}
              >
                {uiState.isLoading ? "Registering..." : "Sign Up"}
              </MDButton>
            </MDBox>

            {/* Sign In Link */}
            <MDBox mt={2} mb={1} textAlign="center">
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
