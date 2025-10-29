import { useState, useCallback, useMemo } from "react";
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
import { useNotifications } from "context/NotifiContext";
import axios from "axios";

const modalStyle = {
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

export default function ResetPasswordModal({ open, onClose, onSubmit }) {
  const { showToast } = useNotifications();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Consolidated state
  const [modalState, setModalState] = useState({
    email: "",
    sent: false,
    loading: false,
    error: "",
  });

  // Email validation
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(modalState.email);
  }, [modalState.email]);

  // Update email field
  const handleEmailChange = useCallback((e) => {
    setModalState((prev) => ({
      ...prev,
      email: e.target.value,
      error: "",
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isEmailValid) {
        setModalState((prev) => ({ ...prev, error: "Please enter a valid email address" }));
        showToast("Please enter a valid email address", "warning", "Invalid Email");
        return;
      }

      setModalState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const response = await axios.post(`${BASE_URL}/api/password/forgot`, {
          email: modalState.email,
        });

        if (response.data.message) {
          setModalState((prev) => ({ ...prev, sent: true, loading: false }));
          showToast(`Reset link sent to ${modalState.email}`, "success", "Email Sent");
          onSubmit?.(modalState.email);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to send reset email. Please try again.";

        setModalState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        showToast(errorMessage, "error", "Failed to Send");
        console.error("Error sending reset email:", error);
      }
    },
    [modalState.email, isEmailValid, BASE_URL, showToast, onSubmit]
  );

  // Handle modal close with state reset
  const handleClose = useCallback(() => {
    setModalState({
      email: "",
      sent: false,
      loading: false,
      error: "",
    });
    onClose();
  }, [onClose]);

  // Render success state
  const renderSuccessState = useMemo(
    () => (
      <>
        <Icon sx={{ fontSize: 48, color: "#21cbf3", mb: 1 }}>check_circle</Icon>
        <MDTypography variant="h5" fontWeight="bold" color="text" mb={1}>
          Link Sent!
        </MDTypography>
        <MDTypography variant="body2" color="text" mb={2}>
          If an account exists for <b>{modalState.email}</b>, a reset link has been sent.
          <br />
          Please check your inbox and spam folder.
        </MDTypography>
        <MDButton variant="gradient" color="info" onClick={handleClose} sx={{ mt: 2 }} fullWidth>
          Back to Sign In
        </MDButton>
      </>
    ),
    [modalState.email, handleClose]
  );

  // Render form state
  const renderFormState = useMemo(
    () => (
      <form onSubmit={handleSubmit}>
        <MDTypography variant="body2" mb={2} sx={{ color: "text" }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </MDTypography>
        <MDInput
          type="email"
          label="Email"
          fullWidth
          value={modalState.email}
          onChange={handleEmailChange}
          required
          error={!!modalState.error}
          sx={{
            mb: modalState.error ? 1 : 2,
            background: "#fff",
            input: { color: "#222" },
            borderRadius: 1,
            boxShadow: "0 1px 4px rgba(33,203,243,0.08)",
            border: modalState.error ? "1px solid #d32f2f" : "1px solid #e0e0e0",
          }}
          autoFocus
        />
        {modalState.error && (
          <MDTypography variant="caption" color="error" sx={{ display: "block", mb: 2 }}>
            {modalState.error}
          </MDTypography>
        )}
        <MDButton
          type="submit"
          variant="gradient"
          color="info"
          fullWidth
          disabled={modalState.loading || !isEmailValid}
        >
          {modalState.loading ? "Sending..." : "Send Reset Link"}
        </MDButton>
      </form>
    ),
    [modalState, isEmailValid, handleSubmit, handleEmailChange]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="forgot-password-title"
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
              <Icon sx={{ color: "white" }}>lock_reset</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Reset Password
              </MDTypography>
            </MDBox>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: "white" }}
              disabled={modalState.loading}
            >
              <Icon>close</Icon>
            </IconButton>
          </MDBox>

          {/* Content */}
          <MDBox px={4} py={modalState.sent ? 4 : 3} textAlign="center">
            {modalState.sent ? renderSuccessState : renderFormState}
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );
}

ResetPasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};
