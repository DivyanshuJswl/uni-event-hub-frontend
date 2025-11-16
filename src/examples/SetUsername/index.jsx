import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { useNotifications } from "context/NotifiContext";

const modalStyle = () => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 340,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.default",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
});

function UsernameSetupModal({ open, onSubmit, loading, error }) {
  const [username, setUsername] = useState("");
  const [localError, setLocalError] = useState("");
  const { showToast } = useNotifications();

  useEffect(() => {
    setUsername("");
    setLocalError("");
  }, [open]);

  // Validation (simplified)
  const validateUsername = (val) => {
    if (!val.trim()) return "Username is required";
    if (val.length < 4 || val.length > 24) return "Username must be 4-24 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Letters, numbers, and underscores only";
    return "";
  };

  const handleSave = () => {
    const err = validateUsername(username);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    onSubmit(username);
  };

  return (
    <Modal
      open={open}
      // disable closing the modal except by saving a valid username
      onClose={null}
      closeAfterTransition
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
    >
      <Fade in={open}>
        <MDBox sx={modalStyle}>
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
              <Icon sx={{ color: "white" }}>person</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Choose Your Username
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox px={4} py={2}>
            <MDTypography
              variant="body2"
              color="text"
              sx={{
                opacity: 0.9,
                fontWeight: 500,
              }}
            >
              This public username is required to activate your profile.
              <span style={{ color: "#e91c18ff", fontWeight: 600 }}>
                You must set one before using site features.
              </span>
            </MDTypography>
            <MDTypography variant="caption" sx={{ mb: 2 }}>
              Profile link: <b>profile/{username || "your_username"}</b>
            </MDTypography>
            <MDInput
              fullWidth
              label="Unique Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              error={!!localError || !!error}
              inputProps={{ maxLength: 24 }}
              required
            />
            {error && (
              <MDTypography variant="caption">
                {error}
                <br />
              </MDTypography>
            )}
            <MDTypography variant="caption">Between 4 and 24 characters</MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              sx={{ mt: 1, fontWeight: "bold", py: 1.25 }}
              disabled={loading || !username || !!validateUsername(username)}
              onClick={handleSave}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? "Saving..." : "Save Username"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Fade>
    </Modal>
  );
}

UsernameSetupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default memo(UsernameSetupModal);
