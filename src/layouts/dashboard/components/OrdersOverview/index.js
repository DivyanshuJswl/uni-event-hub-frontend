import React from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";

const EventCard = ({ date, title, time, sidenavColor }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        mb: 2,
        backgroundColor: darkMode ? "background.default" : "background.paper",
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
          }}
        >
          <Typography variant="body2" fontWeight="regular" sx={{ color: "white" }}>
            {date.month}
          </Typography>
          <Typography variant="h6" fontWeight="regular" sx={{ color: "white" }}>
            {date.day}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <MDTypography variant="h6" color={darkMode ? "white" : "text.primary"}>
            {title}
          </MDTypography>
          <MDTypography
            variant="button"
            ml={1}
            color={darkMode ? "white" : "text"}
            fontWeight="regular"
          >
            {time}
          </MDTypography>
        </Box>
        <MDButton
          component="a"
          variant="gradient"
          color={sidenavColor}
          sx={{
            height: 50,
            width: 60,
            marginLeft: "auto",
            minWidth: "unset",
            padding: "0.5rem",
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
  }).isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  sidenavColor: PropTypes.string,
};

const UpcomingEvents = ({ events = [] }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card
      sx={{
        padding: 3,
        mb: 3,
      }}
    >
      <Typography variant="h5" gutterBottom color={darkMode ? "white" : "text.primary"}>
        Upcoming Events
      </Typography>
      <Box py></Box>
      {events.length > 0 ? (
        events
          .slice(0, 3)
          .map((event, index) => (
            <EventCard key={index} {...event} sidenavColor={controller.sidenavColor} />
          ))
      ) : (
        <Typography color={darkMode ? "text.secondary" : "text.secondary"}>
          No upcoming events.
        </Typography>
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
};

export default UpcomingEvents;
