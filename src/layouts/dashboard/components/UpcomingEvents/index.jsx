import { useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box, Skeleton } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

// Memoized EventCard Skeleton Component
const EventCardSkeleton = memo(({ darkMode }) => {
  const cardStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      padding: 2,
      mb: 2,
      borderRadius: 3,
      boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.12)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
    }),
    [darkMode]
  );

  return (
    <Card sx={cardStyles}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: "20%", mr: 2 }} />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1 }}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton
          variant="rounded"
          width={60}
          height={40}
          sx={{ marginLeft: "auto", borderRadius: 1 }}
        />
      </Box>
    </Card>
  );
});

EventCardSkeleton.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

EventCardSkeleton.displayName = "EventCardSkeleton";

// Memoized EventCard Component
const EventCard = memo(({ date, title, time, sidenavColor, loading = false, eventId }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      padding: 2,
      mb: 2,
      backgroundColor: "background.default",
      borderRadius: 3,
      boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.12)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: darkMode ? "0 8px 24px rgba(0, 0, 0, 0.18)" : "0 8px 24px rgba(0, 0, 0, 0.08)",
      },
    }),
    [darkMode]
  );

  // Memoized date box styles
  const dateBoxStyles = useMemo(
    () => ({
      width: 50,
      height: 50,
      backgroundColor: darkMode ? "steelblue" : "#bbbcc4",
      borderRadius: "20%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      px: 3,
      mr: 2,
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    }),
    [darkMode]
  );

  // Memoized navigation handler
  const handleViewEvent = useCallback(() => {
    if (eventId) {
      navigate(`/events/${eventId}`);
    }
  }, [eventId, navigate]);

  if (loading) {
    return <EventCardSkeleton darkMode={darkMode} />;
  }

  return (
    <Card sx={cardStyles}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        {/* Date Box */}
        <Box sx={dateBoxStyles}>
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={{
              color: "white",
              lineHeight: 1,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {date.month}
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "white",
              lineHeight: 1.2,
              fontSize: "1.25rem",
            }}
          >
            {date.day}
          </Typography>
        </Box>

        {/* Event Details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,
            pr: 1,
          }}
        >
          <MDTypography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </MDTypography>
          <MDTypography
            variant="button"
            color={darkMode ? "white" : "text"}
            fontWeight="medium"
            sx={{
              display: "flex",
              alignItems: "center",
              opacity: 0.8,
              fontSize: "0.8rem",
            }}
          >
            {time}
          </MDTypography>
        </Box>

        {/* View Button */}
        <MDButton
          variant="gradient"
          color={sidenavColor}
          onClick={handleViewEvent}
          sx={{
            height: 40,
            width: 60,
            marginLeft: "auto",
            minWidth: "unset",
            padding: "0.5rem",
            borderRadius: 1,
            fontWeight: 600,
            fontSize: "0.8rem",
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          }}
        >
          View
        </MDButton>
      </Box>
    </Card>
  );
});

EventCard.propTypes = {
  date: PropTypes.shape({
    month: PropTypes.string.isRequired,
    day: PropTypes.number.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  sidenavColor: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  eventId: PropTypes.string,
};

EventCard.displayName = "EventCard";

// Main UpcomingEvents Component
const UpcomingEvents = ({ events = [], loading = false }) => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      padding: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.12)" : "0 8px 32px rgba(0, 0, 0, 0.05)",
    }),
    [darkMode]
  );

  // Memoized title styles
  const titleStyles = useMemo(
    () => ({
      fontWeight: 700,
      mb: 3,
      pb: 1,
      borderBottom: darkMode
        ? "1px solid rgba(255, 255, 255, 0.12)"
        : "1px solid rgba(0, 0, 0, 0.08)",
    }),
    [darkMode]
  );

  // Memoized upcoming events (limit to 3)
  const upcomingEvents = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  // Loading state
  if (loading) {
    return (
      <Card sx={cardStyles}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3, borderRadius: 1 }} />
        {[1, 2, 3].map((item) => (
          <EventCardSkeleton key={item} darkMode={darkMode} />
        ))}
      </Card>
    );
  }

  return (
    <Card sx={cardStyles}>
      <MDTypography variant="h5" gutterBottom sx={titleStyles}>
        Upcoming Events
      </MDTypography>

      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
          <EventCard
            key={event.id || event._id || `${event.title}-${event.date.day}`}
            {...event}
            sidenavColor={sidenavColor}
          />
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <MDTypography variant="body1" sx={{ mb: 1, opacity: 0.7 }}>
            No upcoming events
          </MDTypography>
          <MDTypography variant="body2" sx={{ opacity: 0.5 }}>
            Check back later for new events
          </MDTypography>
        </Box>
      )}
    </Card>
  );
};

UpcomingEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      date: PropTypes.shape({
        month: PropTypes.string.isRequired,
        day: PropTypes.number.isRequired,
      }).isRequired,
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

export default UpcomingEvents;
