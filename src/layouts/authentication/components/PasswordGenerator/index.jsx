import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Fade from "@mui/material/Fade";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: "90vw",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
};

export default function PasswordGeneratorModal({ open, onClose, onPasswordGenerated }) {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    setGeneratedPassword(password);
  };

  const handleApply = () => {
    onPasswordGenerated(generatedPassword);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="password-generator-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
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
            <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>
          {/* Content */}
          <MDBox px={4} py={3}>
            <MDBox mb={3}>
              <MDTypography variant="body2" fontWeight="regular" mb={1} sx={{ color: "#000000" }}>
                Length: {length}
              </MDTypography>
              <Slider
                value={length}
                onChange={(e, newValue) => setLength(newValue)}
                min={6}
                max={32}
                step={1}
                valueLabelDisplay="auto"
              />
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="body2" fontWeight="bold" mb={1} sx={{ color: "#000000" }}>
                Character Types:
              </MDTypography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                }
                label="Include Uppercase Letters"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#000000", // Black color
                    fontWeight: "regular",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                }
                label="Include Numbers"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#000000", // Black color
                    fontWeight: "regular",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                }
                label="Include Symbols"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#000000", // Black color
                    fontWeight: "regular",
                  },
                }}
              />
            </MDBox>

            <MDBox mb={3}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={generatePassword}
                fullWidth
                startIcon={<Icon>autorenew</Icon>}
              >
                Generate Password
              </MDButton>
            </MDBox>

            {generatedPassword && (
              <MDBox mb={3}>
                <MDTypography variant="body2" fontWeight="bold" mb={1} sx={{ color: "#000000" }}>
                  Generated Password:
                </MDTypography>
                <MDInput
                  type="text"
                  value={generatedPassword}
                  fullWidth
                  readOnly
                  sx={{
                    input: { cursor: "pointer", color: "#222" },
                    background: "#fff",
                  }}
                  onClick={(e) => e.target.select()}
                />
              </MDBox>
            )}

            <MDButton
              variant="gradient"
              color="success"
              onClick={handleApply}
              fullWidth
              disabled={!generatedPassword}
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
