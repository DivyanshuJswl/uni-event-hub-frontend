import { useMemo, useState, useCallback, useTransition, useDeferredValue } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Skeleton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import {
  Notifications,
  Delete,
  MarkEmailRead,
  FilterList,
  MoreVert,
  Event,
  Warning,
  CheckCircle,
  Info,
  Error,
} from "@mui/icons-material";
import { useNotifications } from "context/NotifiContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Stack } from "@mui/system";
import MDAlert from "components/MDAlert";

const NotificationSkeleton = ({ isMobile }) => (
  <Card sx={{ mb: 2, borderRadius: isMobile ? 2 : 3 }}>
    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={14} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Memoized notification item component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onMenuOpen,
  darkMode,
  theme,
  isMobile,
}) => {
  const getTypeIcon = useCallback((type) => {
    const icons = {
      event: <Event sx={{ color: "info.main" }} />,
      warning: <Warning sx={{ color: "warning.main" }} />,
      success: <CheckCircle sx={{ color: "success.main" }} />,
      error: <Error sx={{ color: "error.main" }} />,
      default: <Info sx={{ color: "primary.main" }} />,
    };
    return icons[type] || icons.default;
  }, []);

  const getTypeColor = useCallback((type) => {
    const colors = {
      event: "info",
      warning: "warning",
      success: "success",
      error: "error",
      default: "primary",
    };
    return colors[type] || colors.default;
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  }, []);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: isMobile ? 2 : 3,
        borderLeft: `4px solid ${theme.palette[getTypeColor(notification.type)]?.main || theme.palette.primary.main}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        opacity: notification.isRead ? 0.7 : 1,
        backgroundColor: notification.isRead
          ? "transparent"
          : darkMode
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.01)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
      onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box sx={{ mt: 0.5 }}>{getTypeIcon(notification.type)}</Box>

          <Box flex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <MDTypography variant="h6" fontWeight="medium" sx={{ fontSize: "1rem" }}>
                {notification.title}
              </MDTypography>
              <Box display="flex" alignItems="center" gap={1}>
                {!notification.isRead && (
                  <Chip
                    label="New"
                    color="primary"
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                )}
                <IconButton
                  size="small"
                  color={darkMode ? "white" : "black"}
                  onClick={(e) => onMenuOpen(e, notification)}
                  sx={{ opacity: 0.7 }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <MDTypography
              variant="body2"
              color="text"
              sx={{ opacity: 0.8, mb: 1, lineHeight: 1.4 }}
            >
              {notification.message}
            </MDTypography>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Chip
                label={notification.type}
                color={getTypeColor(notification.type)}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
              <MDTypography variant="caption" color="text" sx={{ opacity: 0.6 }}>
                {formatTime(notification.createdAt)}
              </MDTypography>
            </Box>

            {notification.relatedEvent && (
              <MDTypography
                variant="caption"
                color="primary"
                sx={{ display: "block", mt: 1, fontStyle: "italic" }}
              >
                Related to: {notification.relatedEvent.title}
              </MDTypography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const NotificationsPage = () => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use React 18 useTransition for non-urgent updates
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("all");
  const [menuState, setMenuState] = useState({ anchor: null, notification: null });

  // Defer filter value for better performance
  const deferredFilter = useDeferredValue(filter);

  // Memoized filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (deferredFilter === "all") return true;
      if (deferredFilter === "unread") return !notification.isRead;
      return notification.type === deferredFilter;
    });
  }, [notifications, deferredFilter]);

  // Memoized handlers
  const handleMarkAsRead = useCallback(
    async (notificationId, event) => {
      event?.stopPropagation();
      try {
        await markAsRead(notificationId);
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    },
    [markAsRead]
  );

  const handleDelete = useCallback(
    async (notificationId, event) => {
      event?.stopPropagation();
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [deleteNotification]
  );

  const handleMenuOpen = useCallback((event, notification) => {
    event.stopPropagation();
    setMenuState({ anchor: event.currentTarget, notification });
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuState({ anchor: null, notification: null });
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, [markAllAsRead]);

  const handleClearAll = useCallback(async () => {
    try {
      await clearAllNotifications();
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
    handleMenuClose();
  }, [clearAllNotifications, handleMenuClose]);

  // Render functions
  const renderLoadingState = useCallback(
    () => (
      <Box>
        {Array.from({ length: 5 }).map((_, index) => (
          <NotificationSkeleton key={index} isMobile={isMobile} />
        ))}
      </Box>
    ),
    [isMobile]
  );

  const renderErrorState = useCallback(
    () => (
      <MDBox
        mb={2}
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <MDAlert color={darkMode ? "dark" : "light"} dismissible sx={{ width: "100%" }}>
          <MDBox>
            <MDTypography variant="h6" gutterBottom>
              Failed to Load Notifications
            </MDTypography>
            <MDTypography variant="body2">
              There was an error loading your notifications. Please try again.
            </MDTypography>
          </MDBox>
        </MDAlert>
        <MDButton
          onClick={() => fetchNotifications(1, 20, true)}
          variant="gradient"
          color={sidenavColor}
          size="small"
        >
          Try Again
        </MDButton>
      </MDBox>
    ),
    [darkMode, sidenavColor, fetchNotifications]
  );

  const renderEmptyState = useCallback(
    () => (
      <Card
        sx={{
          borderRadius: isMobile ? 2 : 3,
          textAlign: "center",
          background: darkMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
        }}
      >
        <CardContent sx={{ py: isMobile ? 6 : 8, px: isMobile ? 2 : 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Notifications
              sx={{
                fontSize: 40,
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
              }}
            />
          </Box>
          <MDTypography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            color="text"
            fontWeight="bold"
          >
            No Notifications Yet
          </MDTypography>
          <MDTypography
            variant="body1"
            color="text"
            sx={{ opacity: 0.7, maxWidth: 400, mx: "auto", mb: 3 }}
          >
            Notifications about events, certificates, and system updates will appear here.
          </MDTypography>
        </CardContent>
      </Card>
    ),
    [isMobile, darkMode]
  );

  const filterChips = useMemo(
    () => [
      { key: "all", label: "All", color: "primary" },
      { key: "unread", label: "Unread", color: "error" },
      { key: "event", label: "Event", color: "success" },
      { key: "system", label: "System", color: "secondary" },
      { key: "certificate", label: "Certificate", color: "warning" },
      { key: "warning", label: "Warning", color: "warning" },
      { key: "info", label: "Info", color: "info" },
      { key: "success", label: "Success", color: "success" },
      { key: "security", label: "Security", color: "error" },
    ],
    []
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  p={isMobile ? 2 : 3}
                  sx={{
                    borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box>
                      <MDTypography variant="h4" fontWeight="bold" gutterBottom>
                        Notifications
                        {(loading || isPending) && (
                          <CircularProgress size={20} sx={{ ml: 2, color: sidenavColor }} />
                        )}
                      </MDTypography>
                      <MDTypography variant="body1" color="text" sx={{ opacity: 0.7 }}>
                        Stay updated with event notifications and system alerts
                        {notifications.length > 0 && (
                          <span
                            style={{ color: sidenavColor, fontWeight: "bold", marginLeft: "8px" }}
                          >
                            • {unreadCount} unread of {notifications.length} total
                          </span>
                        )}
                      </MDTypography>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      <MDButton
                        variant="outlined"
                        color={sidenavColor}
                        startIcon={<FilterList />}
                        onClick={() => handleFilterChange(filter === "all" ? "unread" : "all")}
                        size={isMobile ? "small" : "medium"}
                      >
                        {filter === "all" ? "Show Unread" : "Show All"}
                      </MDButton>

                      {unreadCount > 0 && (
                        <MDButton
                          variant="gradient"
                          color={sidenavColor}
                          startIcon={<MarkEmailRead />}
                          onClick={handleMarkAllAsRead}
                          size={isMobile ? "small" : "medium"}
                        >
                          Mark All Read
                        </MDButton>
                      )}

                      {notifications.length > 0 && (
                        <MDButton
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={handleClearAll}
                          size={isMobile ? "small" : "medium"}
                        >
                          Clear All
                        </MDButton>
                      )}
                    </Box>
                  </Box>

                  <Stack direction="row" sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
                    {filterChips.map((f) => (
                      <Chip
                        key={f.key}
                        label={f.label}
                        color={f.color}
                        onClick={() => handleFilterChange(f.key)}
                        variant={filter === f.key ? "filled" : "outlined"}
                        sx={{
                          mb: 1,
                          borderRadius: "8px",
                          fontWeight: 400,
                          fontSize: "0.75rem",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}
                  </Stack>
                </MDBox>

                <MDBox p={isMobile ? 2 : 3}>
                  {loading
                    ? renderLoadingState()
                    : error
                      ? renderErrorState()
                      : filteredNotifications.length === 0
                        ? renderEmptyState()
                        : filteredNotifications.map((notification) => (
                            <NotificationItem
                              key={notification._id}
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
                              onMenuOpen={handleMenuOpen}
                              darkMode={darkMode}
                              theme={theme}
                              isMobile={isMobile}
                            />
                          ))}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MDBox>

      <Menu
        anchorEl={menuState.anchor}
        open={Boolean(menuState.anchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
      >
        {menuState.notification && !menuState.notification.isRead && (
          <MenuItem
            onClick={() => {
              handleMarkAsRead(menuState.notification._id);
              handleMenuClose();
            }}
          >
            <MarkEmailRead fontSize="small" sx={{ mr: 1 }} />
            Mark as Read
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleDelete(menuState.notification?._id);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Footer />
    </DashboardLayout>
  );
};

export default NotificationsPage;
