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
import { useAuth } from "context/AuthContext";
import axios from "axios";

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

export default function ResetPasswordModal({ open, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { showToast } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(BASE_URL + "/api/password/forgot", { email });
      if (response.data.message) {
        setSent(true);
        onSubmit && onSubmit(email);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      // TODO: Show error toast/alert
      // showToast();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setEmail("");
    onClose();
  };

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
              <Icon sx={{ color: "white" }}>lock_reset</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Reset Password
              </MDTypography>
            </MDBox>
            <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>
          {/* Content */}
          <MDBox px={4} py={sent ? 4 : 3} textAlign="center">
            {sent ? (
              <>
                <Icon sx={{ fontSize: 48, color: "#21cbf3", mb: 1 }}>check_circle</Icon>
                <MDTypography variant="h5" fontWeight="bold" color="text.secondary" mb={1}>
                  Link Sent!
                </MDTypography>
                <MDTypography variant="body2" color="text.secondary" mb={2}>
                  If an account exists for <b>{email}</b>, a reset link has been sent.
                  <br />
                  Please check your inbox and spam folder.
                </MDTypography>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleClose}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Back to Sign In
                </MDButton>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <MDTypography variant="body2" mb={2} sx={{ color: "text.secondary" }}>
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </MDTypography>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    mb: 2,
                    background: "#fff",
                    input: { color: "#222" },
                    borderRadius: 1,
                    boxShadow: "0 1px 4px rgba(33,203,243,0.08)",
                    border: "1px solid #e0e0e0",
                  }}
                  autoFocus
                />
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </MDButton>
              </form>
            )}
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
