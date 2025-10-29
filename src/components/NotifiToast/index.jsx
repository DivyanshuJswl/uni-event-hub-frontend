import { useCallback, useMemo } from "react";
import { Snackbar, Alert, Box, Typography, IconButton, Slide } from "@mui/material";
import { Close, Event, Warning, CheckCircle, Info, Error as ErrorIcon } from "@mui/icons-material";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";

const NotificationToast = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { toast, hideToast } = useNotifications();

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") return;
      hideToast();
    },
    [hideToast]
  );

  const getIcon = useCallback(() => {
    const icons = {
      event: <Event fontSize="small" />,
      warning: <Warning fontSize="small" />,
      success: <CheckCircle fontSize="small" />,
      error: <ErrorIcon fontSize="small" />,
      info: <Info fontSize="small" />,
    };
    return icons[toast.type] || icons.info;
  }, [toast.type]);

  const getSeverity = useCallback(() => {
    const severities = {
      success: "success",
      warning: "warning",
      error: "error",
      event: "info",
      info: "info",
    };
    return severities[toast.type] || "info";
  }, [toast.type]);

  const alertStyles = useMemo(
    () => ({
      width: "100%",
      minWidth: "320px",
      maxWidth: "380px",
      alignItems: "center",
      boxShadow: darkMode
        ? "0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)"
        : "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "12px",
      backgroundColor: darkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.98)",
      "& .MuiAlert-icon": {
        marginRight: 1.5,
        alignItems: "center",
      },
      "& .MuiAlert-message": {
        width: "100%",
        py: toast.isManual ? 0.5 : 0.25,
      },
    }),
    [darkMode, toast.isManual]
  );

  if (!toast.open) return null;

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={Slide}
      sx={{ mt: 8, zIndex: 9999 }}
    >
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={alertStyles}
      >
        <Box>
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.4,
              color: darkMode ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.87)",
            }}
          >
            {toast.title}
          </Typography>
          {toast.message && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                lineHeight: 1.3,
                mt: 0.25,
                opacity: 0.85,
                color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
              }}
            >
              {toast.message}
            </Typography>
          )}
          {!toast.isManual && toast.notification?.relatedEvent && (
            <Typography
              variant="caption"
              sx={{
                opacity: 0.65,
                fontStyle: "italic",
                fontSize: "0.7rem",
                display: "block",
                mt: 0.5,
                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
              }}
            >
              {toast.notification.relatedEvent.title}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
