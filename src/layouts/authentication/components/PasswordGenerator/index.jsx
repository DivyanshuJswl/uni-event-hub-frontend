import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Fade from "@mui/material/Fade";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: "90vw",
  bgcolor: "background.card",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
};

export default function PasswordGeneratorModal({ open, onClose, onPasswordGenerated }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showToast } = useNotifications();

  // Consolidated state
  const [generatorState, setGeneratorState] = useState({
    length: 12,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    generatedPassword: "",
  });

  // Character sets
  const characterSets = useMemo(
    () => ({
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    }),
    []
  );

  // Build charset based on options
  const buildCharset = useCallback(() => {
    let charset = characterSets.lowercase; // Always include lowercase

    if (generatorState.includeUppercase) charset += characterSets.uppercase;
    if (generatorState.includeNumbers) charset += characterSets.numbers;
    if (generatorState.includeSymbols) charset += characterSets.symbols;

    return charset;
  }, [
    generatorState.includeUppercase,
    generatorState.includeNumbers,
    generatorState.includeSymbols,
    characterSets,
  ]);

  // Secure password generation using crypto API
  const generateSecurePassword = useCallback(() => {
    const charset = buildCharset();
    let password = "";

    // Use crypto API for better randomness if available
    if (window.crypto && window.crypto.getRandomValues) {
      const randomValues = new Uint32Array(generatorState.length);
      window.crypto.getRandomValues(randomValues);

      for (let i = 0; i < generatorState.length; i++) {
        const randomIndex = randomValues[i] % charset.length;
        password += charset[randomIndex];
      }
    } else {
      // Fallback to Math.random
      for (let i = 0; i < generatorState.length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
    }

    return password;
  }, [generatorState.length, buildCharset]);

  // Generate password handler
  const handleGeneratePassword = useCallback(() => {
    try {
      const password = generateSecurePassword();
      setGeneratorState((prev) => ({ ...prev, generatedPassword: password }));
      showToast("Password generated successfully", "success", "Generated");
    } catch (error) {
      console.error("Error generating password:", error);
      showToast("Failed to generate password", "error", "Generation Failed");
    }
  }, [generateSecurePassword, showToast]);

  // Copy to clipboard handler
  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatorState.generatedPassword);
      showToast("Password copied to clipboard", "success", "Copied");
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy password", "error", "Copy Failed");
    }
  }, [generatorState.generatedPassword, showToast]);

  // Apply password handler
  const handleApply = useCallback(() => {
    if (!generatorState.generatedPassword) {
      showToast("Please generate a password first", "warning", "No Password");
      return;
    }

    onPasswordGenerated(generatorState.generatedPassword);
    showToast("Password applied successfully", "success", "Applied");
    onClose();
  }, [generatorState.generatedPassword, onPasswordGenerated, onClose, showToast]);

  // Close handler with state reset
  const handleClose = useCallback(() => {
    setGeneratorState({
      length: 12,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      generatedPassword: "",
    });
    onClose();
  }, [onClose]);

  // Update handlers
  const updateLength = useCallback((e, newValue) => {
    setGeneratorState((prev) => ({ ...prev, length: newValue }));
  }, []);

  const updateOption = useCallback((field, value) => {
    setGeneratorState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Password strength indicator
  const passwordStrength = useMemo(() => {
    if (!generatorState.generatedPassword) return null;

    const { length, includeUppercase, includeNumbers, includeSymbols } = generatorState;
    let strength = 0;

    if (length >= 12) strength += 25;
    if (length >= 16) strength += 25;
    if (includeUppercase) strength += 15;
    if (includeNumbers) strength += 15;
    if (includeSymbols) strength += 20;

    return {
      value: strength,
      label: strength < 40 ? "Weak" : strength < 70 ? "Medium" : "Strong",
      color: strength < 40 ? "error" : strength < 70 ? "warning" : "success",
    };
  }, [generatorState]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="password-generator-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Header */}
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
            py={2}
            sx={{
              background: "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "white" }}>key</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Password Generator
              </MDTypography>
            </MDBox>
            <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>

          {/* Content */}
          <MDBox px={4} py={3}>
            {/* Length Slider */}
            <MDBox mb={3}>
              <MDTypography
                variant="body2"
                fontWeight="regular"
                mb={1}
                sx={{ color: darkMode ? "white" : "#000000" }}
              >
                Length: {generatorState.length}
              </MDTypography>
              <Slider
                value={generatorState.length}
                onChange={updateLength}
                min={6}
                max={32}
                step={1}
                valueLabelDisplay="auto"
              />
            </MDBox>

            {/* Character Type Options */}
            <MDBox mb={3}>
              <MDTypography
                variant="body2"
                fontWeight="bold"
                mb={1}
                sx={{ color: darkMode ? "white" : "#000000" }}
              >
                Character Types:
              </MDTypography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generatorState.includeUppercase}
                    onChange={(e) => updateOption("includeUppercase", e.target.checked)}
                  />
                }
                label="Include Uppercase Letters"
                sx={{
                  display: "block",
                  "& .MuiFormControlLabel-label": {
                    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#000000",
                    fontWeight: "regular",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generatorState.includeNumbers}
                    onChange={(e) => updateOption("includeNumbers", e.target.checked)}
                  />
                }
                label="Include Numbers"
                sx={{
                  display: "block",
                  "& .MuiFormControlLabel-label": {
                    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#000000",
                    fontWeight: "regular",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generatorState.includeSymbols}
                    onChange={(e) => updateOption("includeSymbols", e.target.checked)}
                  />
                }
                label="Include Symbols"
                sx={{
                  display: "block",
                  "& .MuiFormControlLabel-label": {
                    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#000000",
                    fontWeight: "regular",
                  },
                }}
              />
            </MDBox>

            {/* Generate Button */}
            <MDBox mb={3}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleGeneratePassword}
                fullWidth
                startIcon={<Icon>autorenew</Icon>}
              >
                Generate Password
              </MDButton>
            </MDBox>

            {/* Generated Password Display */}
            {generatorState.generatedPassword && (
              <>
                <MDBox mb={2}>
                  <MDTypography
                    variant="body2"
                    fontWeight="bold"
                    mb={1}
                    sx={{ color: darkMode ? "white" : "#000000" }}
                  >
                    Generated Password:
                  </MDTypography>
                  <MDBox display="flex" gap={1}>
                    <MDInput
                      type="text"
                      value={generatorState.generatedPassword}
                      fullWidth
                      readOnly
                      sx={{
                        input: {
                          cursor: "pointer",
                          color: darkMode ? "white" : "#222",
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                        },
                        background: darkMode ? "rgba(255, 255, 255, 0.05)" : "#fff",
                      }}
                      onClick={(e) => e.target.select()}
                    />
                    <IconButton
                      color="info"
                      onClick={handleCopyToClipboard}
                      sx={{
                        border: "1px solid",
                        borderColor: "info.main",
                        borderRadius: 1,
                      }}
                    >
                      <Icon>content_copy</Icon>
                    </IconButton>
                  </MDBox>
                </MDBox>

                {/* Password Strength Indicator */}
                {passwordStrength && (
                  <MDBox mb={3}>
                    <MDBox display="flex" justifyContent="space-between" mb={0.5}>
                      <MDTypography
                        variant="caption"
                        sx={{ color: darkMode ? "white" : "#000000" }}
                      >
                        Strength:
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        color={passwordStrength.color}
                        fontWeight="bold"
                      >
                        {passwordStrength.label}
                      </MDTypography>
                    </MDBox>
                    <Box
                      sx={{
                        width: "100%",
                        height: 4,
                        bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${passwordStrength.value}%`,
                          height: "100%",
                          bgcolor: `${passwordStrength.color}.main`,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </MDBox>
                )}
              </>
            )}

            {/* Apply Button */}
            <MDButton
              variant="gradient"
              color="success"
              onClick={handleApply}
              fullWidth
              disabled={!generatorState.generatedPassword}
              startIcon={<Icon>check</Icon>}
            >
              Use This Password
            </MDButton>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );
}

PasswordGeneratorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPasswordGenerated: PropTypes.func.isRequired,
};
