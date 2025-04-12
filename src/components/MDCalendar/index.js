import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";

// Highlighted dates for illustration
const highlightedDates = [
  { day: 4, month: 3 },
  { day: 9, month: 3 },
  { day: 15, month: 3 },
  { day: 18, month: 3 },
  { day: 20, month: 3 },
];

const MDCalendar = ({ color = "primary" }) => {
  const [controller] = useMaterialUIController();
  const { darkMode, transparentSidenav, sidenavColor, transparentNavbar, fixedNavbar } = controller;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const isHighlighted = (day) => {
    return highlightedDates.some(
      (date) => date.day === day.getDate() && date.month === day.getMonth() + 1
    );
  };

  // Get styles based on theme context
  const getStyles = () => {
    const isTransparent = transparentNavbar || transparentSidenav;

    return {
      calendar: {
        backgroundColor: darkMode
          ? isTransparent
            ? "rgba(30, 30, 30, 0.9)"
            : "#1e1e1e"
          : isTransparent
          ? "rgba(255, 255, 255, 0.9)"
          : "#fff",
        color: darkMode ? "#fff" : "#000",
      },
      header: {
        color: darkMode ? "#90caf9" : sidenavColor || color,
      },
      day: {
        today: {
          backgroundColor: darkMode ? "#3949ab" : "#e3f2fd",
        },
        highlighted: {
          backgroundColor: darkMode ? "#c5cae9" : "#e1e4ff",
        },
        hover: {
          backgroundColor: darkMode ? "#333" : "#f5f5f5",
        },
      },
      button: {
        color: darkMode ? "secondary" : sidenavColor || color,
      },
    };
  };

  const styles = getStyles();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        mx: "auto",
        p: 2,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: styles.calendar.backgroundColor,
        color: styles.calendar.color,
        backdropFilter: transparentNavbar || transparentSidenav ? "blur(6px)" : "none",
      }}
    >
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color={styles.header.color}>
          Your Schedule
        </Typography>
        <Box>
          <Button
            onClick={goToToday}
            variant="contained"
            color={styles.button.color}
            size="small"
            sx={{ mr: 1 }}
          >
            Today
          </Button>
          <IconButton onClick={prevMonth}>
            <ArrowBackIos fontSize="small" sx={{ color: styles.calendar.color }} />
          </IconButton>
          <IconButton onClick={nextMonth}>
            <ArrowForwardIos fontSize="small" sx={{ color: styles.calendar.color }} />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Headers */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Typography
            key={day}
            align="center"
            fontWeight="bold"
            sx={{ color: styles.calendar.color, opacity: 0.8 }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Days */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {days.map((day) => (
          <Box
            key={day}
            sx={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: isToday(day)
                ? styles.day.today.backgroundColor
                : isHighlighted(day)
                ? styles.day.highlighted.backgroundColor
                : "transparent",
              color: styles.calendar.color,
              fontWeight: isHighlighted(day) || isToday(day) ? "bold" : "normal",
              "&:hover": {
                bgcolor: styles.day.hover.backgroundColor,
              },
            }}
          >
            {day.getDate()}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

MDCalendar.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
};

export default MDCalendar;
