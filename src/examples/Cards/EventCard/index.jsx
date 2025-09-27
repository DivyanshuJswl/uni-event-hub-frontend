import React, { useState } from "react";
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
import { useAuth } from "context/AuthContext";
import dayjs from "dayjs";

function EventCard({ event, isEnrolled = false }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isCurrentlyEnrolled, setIsCurrentlyEnrolled] = useState(isEnrolled);
  const [err, setError] = useState();
  const { token } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Extract data from event object
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

  // Calculate derived values
  const currentParticipants = participants.length;
  const isFull = currentParticipants >= maxParticipants;
  const participationPercentage = Math.round(
    (currentParticipants / Math.max(maxParticipants, 1)) * 100
  );

  const displayImage = featuredImage?.url || images[0]?.url;
  const formattedDate = dayjs(date).format("MMMM D, YYYY h:mm A");
  const daysUntilText =
    daysUntil !== undefined && daysUntil > 0 ? `${daysUntil} days until event` : null;
  const organizerName = organizer?.name || "Unknown Organizer";
  const organizerEmail = organizer?.email || "";

  // Calculate status if not provided
  const calculatedStatus = (() => {
    const now = new Date();
    const eventDate = new Date(date);
    const eventEnd = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    if (now < eventDate) return "upcoming";
    if (now >= eventDate && now <= eventEnd) return "ongoing";
    return "completed";
  })();

  const getStatusColor = () => {
    switch (calculatedStatus) {
      case "upcoming":
        return "primary";
      case "ongoing":
        return "secondary";
      case "completed":
        return "error";
      default:
        return "default";
    }
  };

  const statusColor = getStatusColor();

  const handleRegister = async () => {
    if (isFull || calculatedStatus === "completed") return;

    try {
      if (isCurrentlyEnrolled) {
        const res = await axios.post(
          `${BASE_URL}/api/events/unenroll/${_id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setIsCurrentlyEnrolled(false);
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/events/enroll/${_id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setIsCurrentlyEnrolled(true);
      }
    } catch (err) {
      setError(err);
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: darkMode ? "background.default" : "background.paper",
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        {isCurrentlyEnrolled && (
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label="Enrolled"
              color="success"
              size="small"
              sx={{
                fontWeight: "bold",
                backgroundColor: darkMode ? "rgba(76, 175, 80, 0.9)" : "rgba(76, 175, 80, 0.9)",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
            />
          </Box>
        )}

        {/* Event Settings Badge */}
        <Box sx={{ position: "absolute", top: 0, right: 8, zIndex: 10, display: "flex", gap: 0.5 }}>
          {digitalCertificates && (
            <Chip
              icon={<CertificateIcon />}
              label="Certificates"
              size="small"
              color="info"
              sx={{ fontSize: "0.6rem", height: 24 }}
            />
          )}
          {sendReminders && (
            <Chip
              icon={<NotificationsIcon />}
              label="Reminders"
              size="small"
              color="warning"
              sx={{ fontSize: "0.6rem", height: 24 }}
            />
          )}
        </Box>

        <MDBox padding="1rem">
          <MDBox position="relative">
            <MDBox
              component="img"
              src={displayImage}
              alt={title}
              width="100%"
              height="12.5rem"
              sx={{
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: darkMode ? 2 : 3,
                mt: -5,
                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            />
            <Chip
              label={calculatedStatus}
              color={statusColor}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            />
          </MDBox>

          <MDBox pt={3} pb={1} px={1}>
            <MDTypography
              variant="h6"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </MDTypography>

            <Box display="flex" alignItems="center" mt={0.5}>
              <CategoryIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {category}
              </MDTypography>
            </Box>

            {daysUntilText && (
              <Box display="flex" alignItems="center" mt={0.5}>
                <MDTypography variant="caption" color="primary" fontWeight="medium">
                  {daysUntilText}
                </MDTypography>
              </Box>
            )}

            <Divider
              sx={{
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                my: 1,
              }}
            />

            <Box display="flex" alignItems="center" mb={0.5}>
              <EventAvailableIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {formattedDate}
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
                    {currentParticipants}/{maxParticipants} spots filled
                  </MDTypography>
                </Box>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {participationPercentage}%
                </MDTypography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={participationPercentage}
                color={isFull ? "error" : participationPercentage > 80 ? "warning" : "secondary"}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            <MDBox display="flex" justifyContent="center" alignItems="center" padding="8px" mt={2}>
              <MDButton
                variant="gradient"
                color={isCurrentlyEnrolled ? "success" : isFull ? "error" : sidenavColor}
                size="medium"
                disabled={isFull && !isCurrentlyEnrolled}
              >
                {isCurrentlyEnrolled ? "VIEW DETAILS" : isFull ? "FULLY BOOKED" : "SHOW DETAILS"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Enhanced Event Details Modal */}
      <Modal
        open={open}
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
        <Fade in={open} timeout={300}>
          <Box
            sx={{
              position: "relative",
              width: isMobile ? "90vw" : "70vw",
              maxHeight: "90vh",
              bgcolor: darkMode ? "background.paper" : "background.default",
              boxShadow: 24,
              borderRadius: "16px",
              overflow: "auto",
              outline: "none",
            }}
          >
            <IconButton
              onClick={handleClose}
              color={sidenavColor}
              sx={{
                position: "absolute",
                right: 30,
                top: 25,
                zIndex: 1000,
                backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Card sx={{ backgroundColor: darkMode ? "background.default" : "background.paper" }}>
              <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={displayImage}
                    alt={title}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "60vh",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
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
                        {isCurrentlyEnrolled && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Enrolled"
                            color="success"
                            size="medium"
                          />
                        )}
                        <Chip label={calculatedStatus} color={statusColor} size="medium" />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDTypography variant="body2" color="text">
                        {currentParticipants}/{maxParticipants} participants
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {participationPercentage}% filled
                      </MDTypography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={participationPercentage}
                      color={
                        isFull ? "error" : participationPercentage > 80 ? "warning" : "secondary"
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
                        {formattedDate}
                      </MDTypography>
                    </Box>
                    {daysUntilText && (
                      <MDTypography variant="caption" color="primary" ml={2}>
                        {daysUntilText}
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
                      Organized by: {organizerName}
                    </MDTypography>
                  </Box>

                  {organizerEmail && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <EmailIcon color="secondary" />
                      <MDTypography variant="body1" ml={1} color="text">
                        {organizerEmail}
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
                  <MDTypography variant="body1" color="text" sx={{ mb: 3, whiteSpace: "pre-wrap", lineHeight: 1 }}>
                    {description}
                  </MDTypography>

                  <MDButton
                    onClick={handleRegister}
                    variant="gradient"
                    color={
                      isCurrentlyEnrolled
                        ? "error"
                        : isFull || calculatedStatus === "completed"
                          ? "error"
                          : sidenavColor
                    }
                    size="large"
                    fullWidth
                    disabled={(isFull && !isCurrentlyEnrolled) || calculatedStatus === "completed"}
                  >
                    {isCurrentlyEnrolled
                      ? "Unenroll from Event"
                      : isFull
                        ? "Event Full"
                        : calculatedStatus === "completed"
                          ? "Event Completed"
                          : "Register Now"}
                  </MDButton>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  isEnrolled: PropTypes.bool,
};

EventCard.defaultProps = {
  isEnrolled: false,
};

export default EventCard;
