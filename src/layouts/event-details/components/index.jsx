// layouts/event-details/components/index.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Chip,
  Divider,
  Alert,
  IconButton,
  Paper,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Snackbar,
  Card,
  CardContent,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  EventAvailable as EventAvailableIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  CardMembership as CertificateIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import axios from "axios";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";
import EventDetailsSkeleton from "./EventDetailsSkeleton";
import dayjs from "dayjs";

function EventDetails() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };
      const res = await axios.get(`${BASE_URL}/api/events/${eventId}`, config);

      setEvent(res.data.data.event);

      if (user && res.data.data.event.participants) {
        const enrolled = res.data.data.event.participants.some(
          (participant) => participant._id === user.id || participant === user.id
        );
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/authentication/sign-in");
      return;
    }

    try {
      setActionLoading(true);
      await axios.post(
        `${BASE_URL}/api/events/enroll/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setIsEnrolled(true);
      showSnackbar("Successfully enrolled in the event!");
      await fetchEventDetails();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to enroll in event";
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnenroll = async () => {
    try {
      setActionLoading(true);
      await axios.post(
        `${BASE_URL}/api/events/unenroll/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setIsEnrolled(false);
      showSnackbar("Successfully unenrolled from the event!");
      await fetchEventDetails();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to unenroll from event";
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const calculateStatus = () => {
    if (!event) return "loading";
    if (event.status === "cancelled") return "cancelled";

    const now = new Date();
    const eventDate = new Date(event.date);
    const eventEnd = event.endDate
      ? new Date(event.endDate)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    if (now < eventDate) return "upcoming";
    if (now >= eventDate && now <= eventEnd) return "ongoing";
    return "completed";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "primary";
      case "ongoing":
        return "secondary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  if (error && !event) {
    return (
      <Container maxWidth="xl">
        <MDBox py={4} textAlign="center">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <MDButton
            variant="gradient"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </MDButton>
        </MDBox>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="xl">
        <MDBox py={4} textAlign="center">
          <MDTypography variant="h4" color="error">
            Event not found
          </MDTypography>
          <MDButton
            variant="gradient"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Go Back
          </MDButton>
        </MDBox>
      </Container>
    );
  }

  const participationPercentage = Math.round(
    ((event.participants?.length || 0) / Math.max(event.maxParticipants || 1, 1)) * 100
  );
  const status = calculateStatus();
  const statusColor = getStatusColor(status);
  const isFull = (event.participants?.length || 0) >= (event.maxParticipants || 0);
  const canEnroll = user && status === "upcoming" && !isFull && !isEnrolled;
  const canUnenroll = user && (status === "upcoming" || status === "ongoing") && isEnrolled;

  const imageUrl =
    event.featuredImage?.url ||
    event.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60";

  const formattedDate = dayjs(event.date).format("MMMM D, YYYY h:mm A");
  const createdDate = dayjs(event.createdAt).format("MMM D, YYYY");
  const updatedDate = dayjs(event.updatedAt).format("MMM D, YYYY");
  const daysUntil =
    event.daysUntil !== undefined ? event.daysUntil : dayjs(event.date).diff(dayjs(), "day");
  const isOrganizer = user?.email === event.organizer?.email;

  return (
    <Container maxWidth="xl">
      <MDBox display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} component={Link} to={-1}>
          <ArrowBackIcon color={sidenavColor} />
        </IconButton>
        <MDTypography variant="h4" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          Event Details
        </MDTypography>
      </MDBox>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Event Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imageUrl}
            alt={event.title}
            sx={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: 3,
            }}
          />

          {/* Event Settings Card */}
          <Card sx={{ mt: 3, backgroundColor: "background.default" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SettingsIcon color="secondary" sx={{ mr: 1 }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Event Settings
                </MDTypography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon
                      color={event.enableRegistration ? "success" : "disabled"}
                      sx={{ mr: 1 }}
                    />
                    <MDTypography variant="body2">
                      Registration: {event.enableRegistration ? "Enabled" : "Disabled"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <CertificateIcon
                      color={event.digitalCertificates ? "info" : "disabled"}
                      sx={{ mr: 1 }}
                    />
                    <MDTypography variant="body2">
                      Certificates: {event.digitalCertificates ? "Yes" : "No"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <NotificationsIcon
                      color={event.sendReminders ? "warning" : "disabled"}
                      sx={{ mr: 1 }}
                    />
                    <MDTypography variant="body2">
                      Reminders: {event.sendReminders ? "Enabled" : "Disabled"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <MDTypography variant="body2">
                      {daysUntil > 0 ? `${daysUntil} days until` : "Event ongoing"}
                    </MDTypography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card sx={{ mt: 2, backgroundColor: "background.default" }}>
            <CardContent>
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Event Metadata
              </MDTypography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  icon={<CalendarIcon />}
                  label={`Created: ${createdDate}`}
                  variant="outlined"
                  size="medium"
                  color="warning"
                />
                {event.createdAt !== event.updatedAt && (
                  <Chip
                    icon={<UpdateIcon />}
                    label={`Updated: ${updatedDate}`}
                    variant="outlined"
                    size="medium"
                    color="info"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.default",
            }}
          >
            {/* Title and Status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <MDTypography variant="h3" fontWeight="bold" color={darkMode ? "white" : "dark"}>
                {event.title}
              </MDTypography>
              <Chip
                label={status}
                color={statusColor}
                variant="filled"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              />
            </Box>

            {/* Category */}
            <Box display="flex" alignItems="center" mb={2}>
              <CategoryIcon color="secondary" sx={{ mr: 1 }} />
              <MDTypography variant="h6" color="text">
                {event.category || "Uncategorized"}
              </MDTypography>
            </Box>

            {/* Event URL */}
            {event.eventURL && (
              <Box display="flex" alignItems="center" mb={2}>
                <LinkIcon color="secondary" sx={{ mr: 1 }} />
                <MuiLink
                  href={
                    event.eventURL.startsWith("http") ? event.eventURL : `https://${event.eventURL}`
                  }
                  target="_blank"
                  rel="noopener"
                >
                  <MDTypography variant="body2" color="primary">
                    {event.eventURL}
                  </MDTypography>
                </MuiLink>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Date and Time */}
            <Box display="flex" alignItems="center" mb={2}>
              <EventAvailableIcon color="secondary" sx={{ mr: 1 }} />
              <Box>
                <MDTypography variant="body1" fontWeight="medium">
                  Date & Time
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formattedDate}
                </MDTypography>
                {daysUntil > 0 && (
                  <MDTypography variant="caption" color="primary">
                    {daysUntil} days until event
                  </MDTypography>
                )}
              </Box>
            </Box>

            {/* Location */}
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
              <Box>
                <MDTypography variant="body1" fontWeight="medium">
                  Location
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {event.location || "To be announced"}
                </MDTypography>
              </Box>
            </Box>

            {/* Organizer */}
            <Box display="flex" alignItems="center" mb={3}>
              <PersonIcon color="secondary" sx={{ mr: 1 }} />
              <Box>
                <MDTypography variant="body1" fontWeight="medium">
                  Organizer
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {event.organizer?.name || "Unknown Organizer"}
                </MDTypography>
                {event.organizer?.email && (
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <EmailIcon fontSize="small" sx={{ mr: 0.5, color: "primary.main" }} />
                    <MDTypography variant="caption" color="text">
                      {event.organizer.email}
                    </MDTypography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Participation Status */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <MDTypography variant="body1" fontWeight="medium">
                  Participation
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {event.participants?.length || 0} / {event.maxParticipants || 0} participants (
                  {participationPercentage}%)
                </MDTypography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={participationPercentage}
                color={isFull ? "error" : participationPercentage > 80 ? "warning" : "secondary"}
                sx={{ height: 8, borderRadius: 2 }}
              />
              {isFull && (
                <MDTypography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                  This event is fully booked
                </MDTypography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
              {!user ? (
                <MDButton
                  variant="gradient"
                  color="primary"
                  fullWidth
                  component={Link}
                  to="/authentication/sign-in"
                >
                  Log In to Enroll
                </MDButton>
              ) : isOrganizer ? (
                <MDButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={Link}
                  to="/organized-events"
                >
                  Manage Your Event
                </MDButton>
              ) : canEnroll ? (
                <MDButton
                  variant="gradient"
                  color="success"
                  fullWidth
                  onClick={handleEnroll}
                  disabled={actionLoading}
                  startIcon={actionLoading ? <Box width={20} height={20} /> : <CheckCircleIcon />}
                >
                  {actionLoading ? "Enrolling..." : "Enroll in Event"}
                </MDButton>
              ) : canUnenroll ? (
                <MDButton
                  variant="gradient"
                  color="error"
                  fullWidth
                  onClick={handleUnenroll}
                  disabled={actionLoading}
                  startIcon={actionLoading ? <Box width={20} height={20} /> : <CancelIcon />}
                >
                  {actionLoading ? "Unenrolling..." : "Unenroll from Event"}
                </MDButton>
              ) : isEnrolled ? (
                <MDButton
                  variant="outlined"
                  color="success"
                  fullWidth
                  disabled
                  startIcon={<CheckCircleIcon />}
                >
                  Already Enrolled
                </MDButton>
              ) : (
                <MDButton variant="outlined" color="error" fullWidth disabled>
                  {status === "completed"
                    ? "Event Completed"
                    : status === "cancelled"
                      ? "Event Cancelled"
                      : "Enrollment Closed"}
                </MDButton>
              )}

              {user?.id === event.organizer?._id && (
                <MDButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={Link}
                  to="/organized-events"
                >
                  Manage Event
                </MDButton>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Event Description */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.default",
            }}
          >
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Event Description
            </MDTypography>
            <MDTypography
              variant="body2"
              color="text"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1 }}
            >
              {event.description || "No description provided for this event."}
            </MDTypography>
          </Paper>
        </Grid>

        {/* Gallery if multiple images exist */}
        {event.images && event.images.length > 1 && (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "background.default",
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Event Gallery ({event.images.length} images)
              </MDTypography>
              <Grid container spacing={2}>
                {event.images.map((img, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      component="img"
                      src={img.url}
                      alt={`${event.title} - Image ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Participants List */}
        {user?.id === event.organizer?._id &&
          event.participants &&
          event.participants.length > 0 && (
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "background.default",
                }}
              >
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  Participants ({event.participants.length})
                </MDTypography>
                <List>
                  {event.participants.map((participant, index) => (
                    <ListItem key={participant._id || index} divider>
                      <ListItemAvatar>
                        <Avatar>
                          {participant.name ? participant.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.name || "Unknown User"}
                        secondary={participant.email || "No email provided"}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EventDetails;
