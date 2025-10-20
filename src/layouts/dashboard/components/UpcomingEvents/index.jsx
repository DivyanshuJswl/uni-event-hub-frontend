import React from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box, Skeleton } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";

const EventCard = ({ date, title, time, sidenavColor, loading = false }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleViewEvent = () => {
    if (!loading) {
      console.log(`Viewing event: ${title}`);
    }
  };

  if (loading) {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          mb: 2,
          borderRadius: 3,
          boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.12)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignContent: "center", width: "100%" }}>
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
  }

  return (
    <Card
      sx={{
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
      }}
    >
      <Box sx={{ display: "flex", alignContent: "center", width: "100%" }}>
        <Box
          sx={{
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
          }}
        >
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0, // Prevents text overflow
            pr: 1,
          }}
        >
          <MDTypography
            variant="h6"
            color={darkMode ? "white" : "black.main"}
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
        <MDButton
          component="a"
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
};

EventCard.propTypes = {
  date: PropTypes.shape({
    month: PropTypes.string.isRequired,
    day: PropTypes.number.isRequired,
  }),
  title: PropTypes.string,
  time: PropTypes.string,
  sidenavColor: PropTypes.string,
  loading: PropTypes.bool,
};

const UpcomingEvents = ({ events = [], loading = false }) => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  if (loading) {
    return (
      <Card
        sx={{
          padding: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.12)" : "0 8px 32px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3, borderRadius: 1 }} />
        {[1, 2, 3].map((item) => (
          <EventCard key={item} loading={true} />
        ))}
      </Card>
    );
  }

  return (
    <Card
      sx={{
        padding: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.12)" : "0 8px 32px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        color={darkMode ? "white" : "black.main"}
        sx={{
          fontWeight: 700,
          mb: 3,
          pb: 1,
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        Upcoming Events
      </Typography>

      {events.length > 0 ? (
        events
          .slice(0, 3)
          .map((event, index) => <EventCard key={index} {...event} sidenavColor={sidenavColor} />)
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            color: darkMode ? "text.secondary" : "text.secondary",
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
