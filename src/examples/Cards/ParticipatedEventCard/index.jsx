import { useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { Card, Chip, Divider, LinearProgress, Box, CircularProgress } from "@mui/material";
import {
  EventAvailable as EventAvailableIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

function ParticipatedEventCard({ event, onUnenroll, unenrollLoading = false }) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const navigate = useNavigate();

  // Memoized event status calculation
  const eventMetrics = useMemo(() => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventEnd = event.endDate
      ? new Date(event.endDate)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    let status = "completed";
    if (event.status === "cancelled") status = "cancelled";
    else if (now < eventDate) status = "upcoming";
    else if (now >= eventDate && now <= eventEnd) status = "ongoing";

    const statusColors = {
      upcoming: "primary",
      ongoing: "warning",
      cancelled: "error",
      completed: "success",
    };

    const participationPercentage = Math.round(
      ((event.participants?.length || 0) / Math.max(event.maxParticipants || 1, 1)) * 100
    );

    const canUnenroll = status === "upcoming" || status === "ongoing";

    return {
      status,
      statusColor: statusColors[status],
      participationPercentage,
      canUnenroll,
    };
  }, [event.date, event.endDate, event.status, event.participants, event.maxParticipants]);

  // Memoized display data
  const displayData = useMemo(
    () => ({
      formattedDate: new Date(event.date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      imageUrl:
        event.featuredImage?.url ||
        event.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60",
    }),
    [event.date, event.featuredImage, event.images]
  );

  // Memoized handlers
  const handleViewDetails = useCallback(() => {
    navigate(`/events/${event._id}`);
  }, [navigate, event._id]);

  const handleUnenroll = useCallback(() => {
    onUnenroll(event._id);
  }, [onUnenroll, event._id]);

  // Memoized unenrollment message
  const unenrollMessage = useMemo(() => {
    if (eventMetrics.status === "completed") return "Event completed - cannot unenroll";
    if (eventMetrics.status === "cancelled") return "Event cancelled";
    return "Unenrollment not available";
  }, [eventMetrics.status]);

  // Memoized card hover styles
  const cardStyles = useMemo(
    () => ({
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      position: "relative",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
      },
    }),
    [darkMode]
  );

  // Memoized image styles
  const imageStyles = useMemo(
    () => ({
      objectFit: "cover",
      borderRadius: "lg",
      boxShadow: darkMode ? 2 : 3,
      border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
    }),
    [darkMode]
  );

  return (
    <Card sx={cardStyles}>
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        <Chip
          label={eventMetrics.status}
          color={eventMetrics.statusColor}
          size="small"
          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        />
      </Box>

      <MDBox padding="1rem">
        <MDBox position="relative">
          <MDBox
            component="img"
            src={displayData.imageUrl}
            alt={event.title}
            width="100%"
            height="12.5rem"
            sx={imageStyles}
          />
        </MDBox>

        <MDBox pt={3} pb={1} px={1}>
          <MDTypography
            variant="h6"
            textTransform="capitalize"
            gutterBottom
            sx={{ fontWeight: "bold", lineHeight: 1.2 }}
          >
            {event.title}
          </MDTypography>

          <Box display="flex" alignItems="center" mt={0.5}>
            <CategoryIcon fontSize="small" color="secondary" />
            <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
              {event.category || "Uncategorized"}
            </MDTypography>
          </Box>

          <Divider
            sx={{
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
              my: 1,
            }}
          />

          <Box display="flex" alignItems="center" mb={0.5}>
            <EventAvailableIcon fontSize="small" color="secondary" />
            <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
              {displayData.formattedDate}
            </MDTypography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <LocationOnIcon fontSize="small" color="secondary" />
            <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
              {event.location || "Location not specified"}
            </MDTypography>
          </Box>

          <Box mb={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Box display="flex" alignItems="center">
                <GroupIcon fontSize="small" color="secondary" />
                <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                  {event.participants?.length || 0}/{event.maxParticipants || 0} participants
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
                (event.participants?.length || 0) >= (event.maxParticipants || 0)
                  ? "error"
                  : eventMetrics.participationPercentage > 80
                    ? "warning"
                    : "secondary"
              }
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={1}>
            <MDButton
              variant="outlined"
              color={sidenavColor}
              size="small"
              fullWidth
              onClick={handleViewDetails}
            >
              View Details
            </MDButton>

            <MDButton
              variant="gradient"
              color="error"
              fullWidth
              size="medium"
              disabled={!eventMetrics.canUnenroll || unenrollLoading}
              onClick={handleUnenroll}
              startIcon={
                unenrollLoading ? <CircularProgress size={16} color="inherit" /> : <CancelIcon />
              }
            >
              {unenrollLoading ? "Unenrolling..." : "Unenroll"}
            </MDButton>
          </MDBox>

          {!eventMetrics.canUnenroll && (
            <MDTypography
              variant="caption"
              color="text"
              sx={{ display: "block", textAlign: "center", mt: 1 }}
            >
              {unenrollMessage}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

ParticipatedEventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    maxParticipants: PropTypes.number,
    participants: PropTypes.array,
    featuredImage: PropTypes.object,
    images: PropTypes.array,
  }).isRequired,
  onUnenroll: PropTypes.func.isRequired,
  unenrollLoading: PropTypes.bool,
};

ParticipatedEventCard.displayName = "ParticipatedEventCard";

export default memo(ParticipatedEventCard);
