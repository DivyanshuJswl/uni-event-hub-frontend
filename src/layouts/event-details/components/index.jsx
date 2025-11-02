import { useEffect, useState, useCallback, useMemo } from "react";
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
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
  Person as PersonIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  CardMembership as CertificateIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import EventDetailsSkeleton from "./EventDetailsSkeleton";

function EventDetails() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { user, token } = useAuth();
  const { showToast } = useNotifications();

  // Consolidated state
  const [pageState, setPageState] = useState({
    event: null,
    loading: true,
    error: null,
    actionLoading: false,
    isEnrolled: false,
  });

  // Memoized fetch function
  const fetchEventDetails = useCallback(async () => {
    setPageState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
        : { withCredentials: true, timeout: 10000 };

      const res = await axios.get(`${BASE_URL}/api/events/${eventId}`, config);
      const event = res.data.data.event;

      const enrolled =
        user && event.participants
          ? event.participants.some((p) => p._id === user.id || p === user.id)
          : false;

      setPageState({
        event,
        loading: false,
        error: null,
        actionLoading: false,
        isEnrolled: enrolled,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.code === "ECONNABORTED"
          ? "Request timeout"
          : "Failed to fetch event details";

      setPageState({
        event: null,
        loading: false,
        error: errorMessage,
        actionLoading: false,
        isEnrolled: false,
      });

      showToast(errorMessage, "error", "Failed to Load Event");
    }
  }, [BASE_URL, eventId, token, user, showToast]);

  // Initial fetch
  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, fetchEventDetails]);

  // Memoized enrollment handler
  const handleEnroll = useCallback(async () => {
    if (!user) {
      navigate("/authentication/sign-in");
      return;
    }

    setPageState((prev) => ({ ...prev, actionLoading: true }));

    try {
      await axios.post(
        `${BASE_URL}/api/events/enroll/${eventId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          timeout: 10000,
        }
      );

      setPageState((prev) => ({ ...prev, isEnrolled: true, actionLoading: false }));
      showToast("Successfully enrolled in the event!", "success", "Enrollment Successful");
      await fetchEventDetails();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to enroll in event";
      setPageState((prev) => ({ ...prev, actionLoading: false, error: errorMsg }));
      showToast(errorMsg, "error", "Enrollment Failed");
    }
  }, [user, BASE_URL, eventId, token, navigate, showToast, fetchEventDetails]);

  // Memoized unenrollment handler
  const handleUnenroll = useCallback(async () => {
    setPageState((prev) => ({ ...prev, actionLoading: true }));

    try {
      await axios.post(
        `${BASE_URL}/api/events/unenroll/${eventId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          timeout: 10000,
        }
      );

      setPageState((prev) => ({ ...prev, isEnrolled: false, actionLoading: false }));
      showToast("Successfully unenrolled from the event!", "info", "Unenrollment Successful");
      await fetchEventDetails();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to unenroll from event";
      setPageState((prev) => ({ ...prev, actionLoading: false, error: errorMsg }));
      showToast(errorMsg, "error", "Unenrollment Failed");
    }
  }, [BASE_URL, eventId, token, showToast, fetchEventDetails]);

  // Memoized status calculation
  const eventStatus = useMemo(() => {
    if (!pageState.event) return { status: "loading", color: "default" };
    if (pageState.event.status === "cancelled") return { status: "cancelled", color: "error" };

    const now = new Date();
    const eventDate = new Date(pageState.event.date);
    const eventEnd = pageState.event.endDate
      ? new Date(pageState.event.endDate)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    if (now < eventDate) return { status: "upcoming", color: "primary" };
    if (now >= eventDate && now <= eventEnd) return { status: "ongoing", color: "secondary" };
    return { status: "completed", color: "success" };
  }, [pageState.event]);

  // Memoized event metadata
  const eventMetadata = useMemo(() => {
    if (!pageState.event) return null;

    const { event } = pageState;
    const participationPercentage = Math.round(
      ((event.participants?.length || 0) / Math.max(event.maxParticipants || 1, 1)) * 100
    );
    const isFull = (event.participants?.length || 0) >= (event.maxParticipants || 0);
    const isOrganizer = user?.email === event.organizer?.email;
    const daysUntil = dayjs(event.date).diff(dayjs(), "day");

    const imageUrl =
      event.featuredImage?.url ||
      event.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=700&q=60";

    return {
      participationPercentage,
      isFull,
      isOrganizer,
      daysUntil,
      imageUrl,
      formattedDate: dayjs(event.date).format("MMMM D, YYYY h:mm A"),
      createdDate: dayjs(event.createdAt).format("MMM D, YYYY"),
      updatedDate: dayjs(event.updatedAt).format("MMM D, YYYY"),
    };
  }, [pageState.event, user]);

  // Memoized enrollment conditions
  const enrollmentStatus = useMemo(() => {
    if (!pageState.event || !eventMetadata) return {};

    const { status } = eventStatus;
    const { isFull } = eventMetadata;

    return {
      canEnroll: user && status === "upcoming" && !isFull && !pageState.isEnrolled,
      canUnenroll: user && (status === "upcoming" || status === "ongoing") && pageState.isEnrolled,
    };
  }, [pageState.event, pageState.isEnrolled, eventStatus, eventMetadata, user]);

  // Loading state
  if (pageState.loading) {
    return <EventDetailsSkeleton />;
  }

  // Error state - no event
  if (pageState.error && !pageState.event) {
    return (
      <Container maxWidth="xl">
        <MDBox py={4} textAlign="center">
          <Alert severity="error" sx={{ mb: 2 }}>
            {pageState.error}
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

  // Event not found
  if (!pageState.event) {
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

  const { event } = pageState;

  return (
    <Container maxWidth="xl">
      <MDBox display="flex" alignItems="center" mb={3}>
        <IconButton sx={{ mr: 2 }} component={Link} to={-1}>
          <ArrowBackIcon color={sidenavColor} />
        </IconButton>
        <MDTypography variant="h4" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          Event Details
        </MDTypography>
      </MDBox>

      {pageState.error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setPageState((prev) => ({ ...prev, error: null }))}
        >
          {pageState.error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Event Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={eventMetadata.imageUrl}
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
                      {eventMetadata.daysUntil > 0
                        ? `${eventMetadata.daysUntil} days until`
                        : "Event ongoing"}
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
                  label={`Created: ${eventMetadata.createdDate}`}
                  variant="outlined"
                  size="medium"
                  color="warning"
                />
                {event.createdAt !== event.updatedAt && (
                  <Chip
                    icon={<UpdateIcon />}
                    label={`Updated: ${eventMetadata.updatedDate}`}
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
            sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
          >
            {/* Title and Status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <MDTypography variant="h3" fontWeight="bold" color={darkMode ? "white" : "dark"}>
                {event.title}
              </MDTypography>
              <Chip
                label={eventStatus.status}
                color={eventStatus.color}
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
                  {eventMetadata.formattedDate}
                </MDTypography>
                {eventMetadata.daysUntil > 0 && (
                  <MDTypography variant="caption" color="primary">
                    {eventMetadata.daysUntil} days until event
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
                  {eventMetadata.participationPercentage}%)
                </MDTypography>
              </Box>
              <MDProgress
                variant="contained"
                value={eventMetadata.participationPercentage}
                color={
                  eventMetadata.isFull
                    ? "error"
                    : eventMetadata.participationPercentage > 80
                      ? "warning"
                      : "secondary"
                }
              />
              {eventMetadata.isFull && (
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
              ) : eventMetadata.isOrganizer ? (
                <MDButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={Link}
                  to="/organized-events"
                >
                  Manage Your Event
                </MDButton>
              ) : enrollmentStatus.canEnroll ? (
                <MDButton
                  variant="gradient"
                  color="success"
                  fullWidth
                  onClick={handleEnroll}
                  disabled={pageState.actionLoading}
                  startIcon={<CheckCircleIcon />}
                >
                  {pageState.actionLoading ? "Enrolling..." : "Enroll in Event"}
                </MDButton>
              ) : enrollmentStatus.canUnenroll ? (
                <MDButton
                  variant="gradient"
                  color="error"
                  fullWidth
                  onClick={handleUnenroll}
                  disabled={pageState.actionLoading}
                  startIcon={<CancelIcon />}
                >
                  {pageState.actionLoading ? "Unenrolling..." : "Unenroll from Event"}
                </MDButton>
              ) : pageState.isEnrolled ? (
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
                  {eventStatus.status === "completed"
                    ? "Event Completed"
                    : eventStatus.status === "cancelled"
                      ? "Event Cancelled"
                      : "Enrollment Closed"}
                </MDButton>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Event Description */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
          >
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Event Description
            </MDTypography>
            <MDTypography
              variant="body2"
              color="text"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
            >
              {event.description || "No description provided for this event."}
            </MDTypography>
          </Paper>
        </Grid>

        {/* Gallery */}
        {event.images && event.images.length > 1 && (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
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
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Participants List */}
        {eventMetadata.isOrganizer && event.participants && event.participants.length > 0 && (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
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
    </Container>
  );
}

export default EventDetails;
