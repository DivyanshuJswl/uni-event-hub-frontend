import { useCallback, useMemo, memo } from "react";
import { Snackbar, Alert, Box, Typography, IconButton, Slide } from "@mui/material";
import { Close, Event, Warning, CheckCircle, Info, Error as ErrorIcon } from "@mui/icons-material";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";

const NotificationToast = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { toast, hideToast } = useNotifications();

  // Memoized handle close
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") return;
      hideToast();
    },
    [hideToast]
  );

  // Memoized icon mapping
  const iconMap = useMemo(
    () => ({
      event: <Event fontSize="small" />,
      warning: <Warning fontSize="small" />,
      success: <CheckCircle fontSize="small" />,
      error: <ErrorIcon fontSize="small" />,
      info: <Info fontSize="small" />,
    }),
    []
  );

  // Memoized severity mapping
  const severityMap = useMemo(
    () => ({
      success: "success",
      warning: "warning",
      error: "error",
      event: "info",
      info: "info",
    }),
    []
  );

  // Memoized icon getter
  const getIcon = useMemo(() => iconMap[toast.type] || iconMap.info, [toast.type, iconMap]);

  // Memoized severity getter
  const getSeverity = useMemo(() => severityMap[toast.type] || "info", [toast.type, severityMap]);

  // Memoized alert styles
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

  // Memoized title styles
  const titleStyles = useMemo(
    () => ({
      fontSize: "0.875rem",
      lineHeight: 1.4,
      color: darkMode ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.87)",
    }),
    [darkMode]
  );

  // Memoized message styles
  const messageStyles = useMemo(
    () => ({
      fontSize: "0.8rem",
      lineHeight: 1.3,
      mt: 0.25,
      opacity: 0.85,
      color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
    }),
    [darkMode]
  );

  // Memoized event caption styles
  const eventCaptionStyles = useMemo(
    () => ({
      opacity: 0.65,
      fontStyle: "italic",
      fontSize: "0.7rem",
      display: "block",
      mt: 0.5,
      color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
    }),
    [darkMode]
  );

  // Early return if toast is not open
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
        severity={getSeverity}
        icon={getIcon}
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
          <Typography variant="body2" fontWeight="600" sx={titleStyles}>
            {toast.title}
          </Typography>
          {toast.message && (
            <Typography variant="body2" sx={messageStyles}>
              {toast.message}
            </Typography>
          )}
          {!toast.isManual && toast.notification?.relatedEvent && (
            <Typography variant="caption" sx={eventCaptionStyles}>
              {toast.notification.relatedEvent.title}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

NotificationToast.displayName = "NotificationToast";

export default memo(NotificationToast);
