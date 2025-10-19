import React, { useState, useMemo } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";
import { Skeleton } from "@mui/material";

const MDCalendar = ({ events = [], loading = false }) => {
  const [controller] = useMaterialUIController();
  const { darkMode, transparentSidenav, sidenavColor, transparentNavbar } = controller;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Process events to create a map of dates to event names
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (event.date) {
        const dateKey = format(new Date(event.date), "yyyy-MM-dd");
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(event.title);
      }
    });
    return map;
  }, [events]);

  const hasEvent = (day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return eventsByDate[dateKey] && eventsByDate[dateKey].length > 0;
  };

  const getEventNames = (day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return eventsByDate[dateKey] || [];
  };

  // Get styles based on theme context
  const getStyles = () => {
    const isTransparent = transparentNavbar || transparentSidenav;

    return {
      calendar: {
        backgroundColor: "background.card", // Rich dark background
        color: darkMode ? "white.main" : "grey.900", // Softer text colors
        boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
      },
      header: {
        color: darkMode
          ? "#4fc3f7" // Bright cyan for dark mode
          : sidenavColor || "#1976d2", // Primary blue or custom color
      },
      day: {
        today: {
          backgroundColor: darkMode ? "#4fc2f732" : "#bbdefbb0", // Blue tones
          color: darkMode ? "#ffffff" : "#0d47a1", // Contrast text
          fontWeight: "bold",
        },
        event: {
          backgroundColor: darkMode
            ? "linear-gradient(135deg, #6dfc71ff, #388e3c)" // Green gradient for dark
            : "linear-gradient(135deg, #c8e6c9, #a5d6a7)", // Subtle green gradient for light
          color: darkMode ? "#ebebebff" : "#1b5e20", // Light green text
          boxShadow: darkMode ? "0 2px 4px rgba(76, 175, 80, 0.3)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        hover: {
          backgroundColor: darkMode
            ? "rgba(66, 66, 66, 0.8)" // Dark gray with transparency
            : "rgba(236, 239, 241, 0.7)", // Light blue-gray
          transform: "scale(1.05)",
          transition: "all 0.2s ease",
        },
        selected: {
          backgroundColor: darkMode ? "#7b1fa2" : "#e1bee7", // Purple tones
          color: darkMode ? "#ffffff" : "#4a148c",
        },
      },
      button: {
        color: darkMode
          ? "#4dd0e1" // Teal for dark mode
          : "#2196f3", // Blue or custom color
        hover: {
          backgroundColor: darkMode ? "rgba(77, 208, 225, 0.1)" : "rgba(33, 150, 243, 0.04)",
        },
      },
      border: {
        color: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.25)",
      },
    };
  };

  const styles = getStyles();

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          p: 3,
          borderRadius: 3,
          boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
          backgroundColor: styles.calendar.backgroundColor,
          border: `1px solid ${styles.border.color}`,
        }}
      >
        {/* Header Skeleton */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
          sx={{
            borderBottom: `1px solid ${styles.border.color}`,
            pb: 1.5,
          }}
        >
          <Skeleton
            variant="rounded"
            width={75}
            height={30}
            sx={{
              bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
            }}
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Skeleton
              variant="rounded"
              width={60}
              height={32}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                borderRadius: 1,
              }}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              }}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>
        </Box>

        {/* Weekday Headers Skeleton */}
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={2} gap={1}>
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width="100%"
              height={30}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                borderRadius: 1,
              }}
            />
          ))}
        </Box>

        {/* Calendar Days Skeleton */}
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
          {Array.from({ length: 30 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width="100%"
              height={35}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
                borderRadius: 2,
              }}
            />
          ))}
        </Box>

        {/* Legend Skeleton */}
        <Box mt={1.5} pt={1.5} sx={{ borderTop: `1px solid ${styles.border.color}` }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Skeleton
              variant="rounded"
              width={16}
              height={15}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                borderRadius: 1,
                mr: 1,
              }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={20}
              sx={{
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        p: 3,
        borderRadius: 3,
        boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
        backgroundColor: styles.calendar.backgroundColor,
        color: styles.calendar.color,
        backdropFilter: transparentNavbar || transparentSidenav ? "blur(12px)" : "none",
      }}
    >
      {/* Header Section with enhanced styling */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
        sx={{
          borderBottom: `1px solid ${styles.border.color}`,
          pb: 1.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color={styles.header.color}
          sx={{
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}
        >
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            onClick={goToToday}
            variant="outlined"
            size="small"
            sx={{
              color: styles.button.color,
              borderColor: styles.border.color,
              "&:hover": {
                backgroundColor: styles.button.hover.backgroundColor,
                borderColor: styles.button.color,
              },
            }}
          >
            Today
          </Button>
          <IconButton
            onClick={prevMonth}
            size="small"
            sx={{
              color: styles.calendar.color,
              "&:hover": {
                backgroundColor: styles.button.hover.backgroundColor,
              },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            onClick={nextMonth}
            size="small"
            sx={{
              color: styles.calendar.color,
              "&:hover": {
                backgroundColor: styles.button.hover.backgroundColor,
              },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Headers with enhanced styling */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1} gap={1}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <Typography
            key={`${day}-${index}`}
            align="center"
            fontWeight="medium"
            variant="body2"
            sx={{
              color: styles.calendar.color,
              opacity: 0.7,
              fontSize: "0.875rem",
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Days with enhanced styling */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {days.map((day) => {
          const isEventDay = hasEvent(day);
          const eventNames = getEventNames(day);

          return (
            <Tooltip
              key={day}
              title={
                isEventDay ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Events on {format(day, "MMM d")}:
                    </Typography>
                    {eventNames.map((name, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {name}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  `No events on ${format(day, "MMM d")}`
                )
              }
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: darkMode ? "grey.800" : "grey.100",
                    color: darkMode ? "grey.100" : "grey.800",
                    boxShadow: darkMode
                      ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                      : "0 4px 20px rgba(0, 0, 0, 0.1)",
                    "& .MuiTooltip-arrow": {
                      color: darkMode ? "grey.800" : "grey.100",
                    },
                  },
                },
              }}
            >
              <Box
                sx={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  cursor: "pointer",
                  position: "relative",
                  background: isToday(day)
                    ? styles.day.today.backgroundColor
                    : isEventDay
                      ? styles.day.event.backgroundColor
                      : "transparent",
                  color: isToday(day)
                    ? styles.day.today.color
                    : isEventDay
                      ? styles.day.event.color
                      : styles.calendar.color,
                  fontWeight: isEventDay || isToday(day) ? "600" : "normal",
                  "&:hover": styles.day.hover,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {format(day, "d")}
                {isEventDay && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: darkMode ? "#e8f5e9" : "#1b5e20",
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Event Legend with enhanced styling */}
      {events.length > 0 && (
        <Box mt={1.5} pt={1.5} sx={{ borderTop: `1px solid ${styles.border.color}` }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: "1rem",
                height: "1rem",
                borderRadius: "4px",
                background: styles.day.event.background,
                mr: 1,
              }}
            />
            <Typography variant="caption" sx={{ color: styles.calendar.color, opacity: 0.8 }}>
              Days with events
            </Typography>
          </Box>
        </Box>
      )}
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
  events: PropTypes.array,
  loading: PropTypes.bool,
};

export default MDCalendar;
