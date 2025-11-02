import { useState, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Divider,
  Modal,
  Box,
  IconButton,
  useMediaQuery,
  Grid,
  Fade,
  Backdrop,
  LinearProgress,
  Chip,
  Link,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";
import { useAuth } from "context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkIcon from "@mui/icons-material/Link";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CertificateIcon from "@mui/icons-material/CardMembership";
import axios from "axios";
import dayjs from "dayjs";

function EventCard({ event, isEnrolled = false }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { showToast } = useNotifications();
  const { token } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Consolidated state
  const [cardState, setCardState] = useState({
    open: false,
    isCurrentlyEnrolled: isEnrolled,
  });

  // Memoized handlers
  const handleOpen = useCallback(() => {
    setCardState((prev) => ({ ...prev, open: true }));
  }, []);

  const handleClose = useCallback(() => {
    setCardState((prev) => ({ ...prev, open: false }));
  }, []);

  // Memoized event data
  const {
    _id,
    title,
    description,
    category,
    date,
    location,
    maxParticipants = 0,
    organizer,
    eventURL,
    enableRegistration,
    digitalCertificates,
    sendReminders,
    status,
    participants = [],
    featuredImage,
    images = [],
    createdAt,
    daysUntil,
  } = event;

  // Memoized derived values
  const eventMetrics = useMemo(() => {
    const currentParticipants = participants.length;
    const isFull = currentParticipants >= maxParticipants;
    const participationPercentage = Math.round(
      (currentParticipants / Math.max(maxParticipants, 1)) * 100
    );

    const now = new Date();
    const eventDate = new Date(date);
    const eventEnd = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    let calculatedStatus = "completed";
    if (now < eventDate) calculatedStatus = "upcoming";
    else if (now >= eventDate && now <= eventEnd) calculatedStatus = "ongoing";

    return {
      currentParticipants,
      isFull,
      participationPercentage,
      calculatedStatus,
    };
  }, [participants.length, maxParticipants, date]);

  const displayData = useMemo(
    () => ({
      image: featuredImage?.url || images[0]?.url,
      formattedDate: dayjs(date).format("MMMM D, YYYY h:mm A"),
      daysUntilText: daysUntil > 0 ? `${daysUntil} days until event` : null,
      organizerName: organizer?.name || "Unknown Organizer",
      organizerEmail: organizer?.email || "",
    }),
    [featuredImage, images, date, daysUntil, organizer]
  );

  const statusColor = useMemo(() => {
    const colors = {
      upcoming: "primary",
      ongoing: "secondary",
      completed: "error",
    };
    return colors[eventMetrics.calculatedStatus] || "default";
  }, [eventMetrics.calculatedStatus]);

  // Memoized registration handler
  const handleRegister = useCallback(async () => {
    if (eventMetrics.isFull || eventMetrics.calculatedStatus === "completed") return;

    try {
      const endpoint = cardState.isCurrentlyEnrolled ? "unenroll" : "enroll";
      await axios.post(
        `${BASE_URL}/api/events/${endpoint}/${_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          timeout: 10000,
        }
      );

      setCardState((prev) => ({
        ...prev,
        isCurrentlyEnrolled: !prev.isCurrentlyEnrolled,
      }));

      showToast(
        `Successfully ${cardState.isCurrentlyEnrolled ? "unenrolled from" : "enrolled in"} ${title}`,
        "success",
        cardState.isCurrentlyEnrolled ? "Unenrolled" : "Enrolled"
      );
    } catch (err) {
      console.error("Registration error:", err);
      showToast(
        err.response?.data?.message || "Registration failed. Please try again.",
        "error",
        "Registration Error"
      );
    }
  }, [
    eventMetrics.isFull,
    eventMetrics.calculatedStatus,
    cardState.isCurrentlyEnrolled,
    BASE_URL,
    _id,
    token,
    title,
    showToast,
  ]);

  return (
    <>
      <Card
        onClick={handleOpen}
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        {cardState.isCurrentlyEnrolled && (
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <Chip icon={<CheckCircleIcon />} label="Enrolled" color="success" size="small" />
          </Box>
        )}

        <MDBox padding="1rem">
          <MDBox position="relative">
            <MDBox
              component="img"
              src={displayData.image}
              alt={title}
              width="100%"
              height="12.5rem"
              sx={{
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: darkMode ? 2 : 3,
                mt: -5,
              }}
            />
            <Chip
              label={eventMetrics.calculatedStatus}
              color={statusColor}
              size="small"
              sx={{ position: "absolute", top: 10, right: 10, fontWeight: "bold" }}
            />
          </MDBox>

          <MDBox pt={3} pb={1} px={1}>
            <MDTypography
              variant="h6"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
            >
              {title}
            </MDTypography>

            <Box display="flex" alignItems="center" mt={0.5}>
              <CategoryIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {category}
              </MDTypography>
            </Box>

            {displayData.daysUntilText && (
              <MDTypography variant="caption" color="primary" fontWeight="medium">
                {displayData.daysUntilText}
              </MDTypography>
            )}

            <Divider sx={{ my: 1 }} />

            <Box display="flex" alignItems="center" mb={0.5}>
              <EventAvailableIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {displayData.formattedDate}
              </MDTypography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {location}
              </MDTypography>
            </Box>

            <Box mb={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Box display="flex" alignItems="center">
                  <GroupIcon fontSize="small" color="secondary" />
                  <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                    {eventMetrics.currentParticipants}/{maxParticipants} spots filled
                  </MDTypography>
                </Box>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {eventMetrics.participationPercentage}%
                </MDTypography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={eventMetrics.participationPercentage}
                color={
                  eventMetrics.isFull
                    ? "error"
                    : eventMetrics.participationPercentage > 80
                      ? "warning"
                      : "secondary"
                }
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            <MDBox display="flex" justifyContent="center" mt={2}>
              <MDButton
                variant="gradient"
                color={
                  cardState.isCurrentlyEnrolled
                    ? "success"
                    : eventMetrics.isFull
                      ? "error"
                      : sidenavColor
                }
                size="medium"
                disabled={eventMetrics.isFull && !cardState.isCurrentlyEnrolled}
              >
                {cardState.isCurrentlyEnrolled
                  ? "VIEW DETAILS"
                  : eventMetrics.isFull
                    ? "FULLY BOOKED"
                    : "SHOW DETAILS"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Modal
        open={cardState.open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Fade in={cardState.open} timeout={300}>
          <Box
            sx={{
              position: "relative",
              width: isMobile ? "90vw" : "70vw",
              maxHeight: "90vh",
              bgcolor: "background.default",
              boxShadow: 24,
              borderRadius: "16px",
              overflow: "auto",
              outline: "none",
            }}
          >
            <IconButton
              onClick={handleClose}
              color={sidenavColor}
              sx={{ position: "absolute", right: 30, top: 25, zIndex: 1000 }}
            >
              <CloseIcon />
            </IconButton>

            <Card>
              <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={displayData.image}
                    alt={title}
                    sx={{ width: "100%", borderRadius: "12px" }}
                  />
                  {/* Event Settings */}
                  <Box
                    mt={3}
                    p={2}
                    sx={{
                      backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                    }}
                  >
                    <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mb={1}>
                      <SettingsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Event Settings
                    </MDTypography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      <Chip
                        icon={enableRegistration ? <CheckCircleIcon /> : <CloseIcon />}
                        label={`Registration ${enableRegistration ? "Enabled" : "Disabled"}`}
                        color={enableRegistration ? "success" : "default"}
                        size="small"
                      />
                      <Chip
                        icon={digitalCertificates ? <CertificateIcon /> : <CloseIcon />}
                        label="Digital Certificates"
                        color={digitalCertificates ? "info" : "default"}
                        size="small"
                      />
                      <Chip
                        icon={sendReminders ? <NotificationsIcon /> : <CloseIcon />}
                        label="Reminder Emails"
                        color={sendReminders ? "warning" : "default"}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Additional Info */}
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                        Participation Status
                      </MDTypography>
                      <Box display="flex" gap={1}>
                        {cardState.isCurrentlyEnrolled && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Enrolled"
                            color="success"
                            size="medium"
                          />
                        )}
                        <Chip
                          label={eventMetrics.calculatedStatus}
                          color={statusColor}
                          size="medium"
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDTypography variant="body2" color="text">
                        {eventMetrics.currentParticipants} participants
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {eventMetrics.participationPercentage}% filled
                      </MDTypography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={eventMetrics.participationPercentage}
                      color={
                        eventMetrics.isFull
                          ? "error"
                          : eventMetrics.participationPercentage > 80
                            ? "warning"
                            : "secondary"
                      }
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDTypography variant="h3" color={darkMode ? "white" : "dark"} sx={{ mb: 1 }}>
                    {title}
                  </MDTypography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <CategoryIcon color="secondary" />
                    <MDTypography variant="h6" ml={1} color="text">
                      {category}
                    </MDTypography>
                  </Box>

                  {eventURL && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <LinkIcon color="secondary" />
                      <Link
                        href={eventURL.startsWith("http") ? eventURL : `https://${eventURL}`}
                        target="_blank"
                      >
                        <MDTypography variant="body2" ml={1} color="primary">
                          {eventURL}
                        </MDTypography>
                      </Link>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" alignItems="center" mb={2}>
                    <EventAvailableIcon color="secondary" />
                    <Box ml={1}>
                      <MDTypography variant="body1" color="text">
                        {displayData.formattedDate}
                      </MDTypography>
                    </Box>
                    {displayData.daysUntilText && (
                      <MDTypography variant="caption" color="primary" ml={2}>
                        {displayData.daysUntilText}
                      </MDTypography>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text">
                      {location}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text">
                      Organized by: {displayData.organizerName}
                    </MDTypography>
                  </Box>

                  {displayData.organizerEmail && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <EmailIcon color="secondary" />
                      <MDTypography variant="body1" ml={1} color="text">
                        {displayData.organizerEmail}
                      </MDTypography>
                    </Box>
                  )}

                  <MDTypography
                    variant="h6"
                    color={darkMode ? "white" : "dark"}
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Event Description
                  </MDTypography>

                  <MDTypography
                    variant="body1"
                    color="text"
                    sx={{ mb: 3, whiteSpace: "pre-wrap", lineHeight: 1.25 }}
                  >
                    {description}
                  </MDTypography>

                  <MDButton
                    onClick={handleRegister}
                    variant="gradient"
                    color={cardState.isCurrentlyEnrolled ? "error" : sidenavColor}
                    size="large"
                    fullWidth
                    disabled={
                      (eventMetrics.isFull && !cardState.isCurrentlyEnrolled) ||
                      eventMetrics.calculatedStatus === "completed"
                    }
                  >
                    {cardState.isCurrentlyEnrolled
                      ? "Unenroll from Event"
                      : eventMetrics.isFull
                        ? "Event Full"
                        : "Register Now"}
                  </MDButton>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  isEnrolled: PropTypes.bool,
};

EventCard.displayName = "EventCard";

export default memo(EventCard);
