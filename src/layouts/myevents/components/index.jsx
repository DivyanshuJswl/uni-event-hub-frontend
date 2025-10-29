import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Icon,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
  CircularProgress as MUICircularProgress,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";
import ParticipatedEventCard from "examples/Cards/ParticipatedEventCard";
import EventSkeleton from "components/EventSkeleton";
import { useNavigate } from "react-router-dom";

function MyParticipatedEvents() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("9");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [unenrollLoading, setUnenrollLoading] = useState(null);

  const fetchParticipatedEvents = async () => {
    if (!user?.id) {
      setError("Please log in to view your events");
      setLoading(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/api/events/students/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      console.log(res?.data?.data?.events);
      setEvents(res?.data?.data?.events || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch participated events");
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParticipatedEvents();
  }, [user?.id, BASE_URL, token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchParticipatedEvents();
    setPage(1);
  };

  const handleUnenroll = async (eventId) => {
    if (!user?.id) return;

    try {
      setUnenrollLoading(eventId);
      const res = await axios.post(
        `${BASE_URL}/api/events/unenroll/${eventId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(res);
      // Remove the event from the list
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error("Error unenrolling from event:", err);
      setError("Failed to unenroll from event");
    } finally {
      setUnenrollLoading(null);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      const next = Math.min(parseInt(value), 12);
      setInputValue(String(next));
      setItemsPerPage(next);
      setPage(1);
    }
  };

  // Calculate event statistics
  const stats = useMemo(() => {
    const now = new Date();
    return events.reduce(
      (acc, event) => {
        const eventDate = new Date(event.date);
        const eventEnd = event.endDate
          ? new Date(event.endDate)
          : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

        if (event.status === "cancelled") {
          acc.cancelled += 1;
        } else if (now < eventDate) {
          acc.upcoming += 1;
        } else if (now >= eventDate && now <= eventEnd) {
          acc.ongoing += 1;
        } else {
          acc.completed += 1;
        }

        return acc;
      },
      { total: events.length, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
    );
  }, [events]);

  // Filter events based on search and status
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      const eventDate = new Date(event.date);
      const eventEnd = event.endDate
        ? new Date(event.endDate)
        : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

      let computedStatus = "completed";
      if (event.status === "cancelled") {
        computedStatus = "cancelled";
      } else if (now < eventDate) {
        computedStatus = "upcoming";
      } else if (now >= eventDate && now <= eventEnd) {
        computedStatus = "ongoing";
      }

      const matchesStatus = statusFilter === "all" || statusFilter === computedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  // Pagination
  const indexOfLast = page * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  if (!user) {
    return (
      <Container maxWidth="xl">
        <MDBox py={4} textAlign="center">
          <MDTypography variant="h6" color="error" sx={{ mb: 2 }}>
            Please log in to view your participated events.
          </MDTypography>
          <Button variant="contained" color="primary" href="/authentication/sign-in">
            Log In
          </Button>
        </MDBox>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: darkMode ? "white" : "primary" }}>
            My Participated Events
          </Typography>
          <MDTypography variant="subtitle1" sx={{ color: darkMode ? "white" : "primary" }}>
            View and manage your event registrations
            {events.length > 0 && (
              <span style={{ color: "#2ca630ff", fontWeight: "bold", marginLeft: "8px" }}>
                • Participated in {events.length} event(s)
              </span>
            )}
          </MDTypography>
        </Box>

        {/* Statistics Chips */}
        <Stack direction="row" sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {[
            { key: "all", label: `All ${stats.total}`, color: "primary" },
            { key: "upcoming", label: `Upcoming ${stats.upcoming}`, color: "success" },
            { key: "ongoing", label: `Ongoing ${stats.ongoing}`, color: "warning" },
            { key: "completed", label: `Completed ${stats.completed}`, color: "secondary" },
            { key: "cancelled", label: `Cancelled ${stats.cancelled}`, color: "error" },
          ].map((s) => (
            <Chip
              key={s.key}
              label={s.label}
              color={s.color}
              onClick={() => {
                setStatusFilter(s.key);
                setPage(1);
              }}
              variant={statusFilter === s.key ? "filled" : "outlined"}
              sx={{
                mb: 1,
                borderRadius: "8px",
                fontWeight: 400,
                fontSize: "0.75rem",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          ))}
        </Stack>

        {/* Search and Controls - Responsive Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            alignItems: isSmall ? "center" : "flex-end",
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
            width: "100%",
          }}
        >
          {/* Search Field - Left aligned on large screens, centered on small */}
          <Box
            sx={{
              display: "flex",
              justifyContent: isSmall ? "center" : "flex-start",
              width: isSmall ? "100%" : "auto",
            }}
          >
            <TextField
              fullWidth={isSmall}
              size="small"
              variant="outlined"
              placeholder="Search your events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              sx={{
                width: isSmall ? "100%" : "350px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "background.default",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon fontSize="small" sx={{ color: "text.main" }}>
                      search
                    </Icon>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Controls - Right aligned on large screens, centered on small */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              alignItems: "center",
              justifyContent: isSmall ? "center" : "flex-end",
              gap: 2,
              width: isSmall ? "100%" : "auto",
            }}
          >
            <TextField
              label="Items per page"
              type="number"
              value={inputValue}
              onChange={handleItemsPerPageChange}
              size="small"
              inputProps={{ min: 1, max: 12 }}
              sx={{
                width: isSmall ? "100%" : "140px",
                "& .MuiInputBase-input": {
                  color: darkMode ? "white" : "text.primary",
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                },
              }}
            />

            <Button
              variant="outlined"
              sx={{
                borderRadius: "8px",
                fontWeight: 400,
                borderWidth: "1px",
                color: darkMode ? "primary.main" : "primary.main",
                borderColor: darkMode ? "primary.main" : "primary.main",
                minWidth: "auto",
                px: 2,
                width: isSmall ? "100%" : "auto",
                "&:hover": {
                  borderColor: darkMode ? "primary.dark" : "primary.dark",
                  backgroundColor: darkMode
                    ? "rgba(25, 118, 210, 0.08)"
                    : "rgba(25, 118, 210, 0.04)",
                },
                "&.Mui-disabled": {
                  borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
                  color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
                },
              }}
              onClick={handleRefresh}
              disabled={loading || refreshing || !user?.id}
              startIcon={
                refreshing ? (
                  <MUICircularProgress size={20} color="inherit" />
                ) : (
                  <Icon>refresh</Icon>
                )
              }
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {refreshing ? "Refreshing..." : "Refresh"}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {refreshing ? "" : "Refresh"}
              </Box>
            </Button>
          </Box>
        </Box>

        {/* Events Grid */}
        {loading ? (
          <Grid container spacing={4}>
            <EventSkeleton />
          </Grid>
        ) : error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading events: {error}
            </MDTypography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              startIcon={<Icon>refresh</Icon>}
              sx={{ borderRadius: 2 }}
            >
              Try Again
            </Button>
          </MDBox>
        ) : (
          <>
            <Grid container spacing={4}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={event._id}>
                    <ParticipatedEventCard
                      event={event}
                      onUnenroll={handleUnenroll}
                      unenrollLoading={unenrollLoading === event._id}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <MDBox textAlign="center" py={8}>
                    <Typography variant="h6" sx={{ color: darkMode ? "white" : "black", mb: 2 }}>
                      {events.length === 0
                        ? "You haven't participated in any events yet."
                        : "No events match your filters."}
                    </Typography>
                    {events.length === 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/explore")}
                        sx={{ borderRadius: 2 }}
                      >
                        Explore Events
                      </Button>
                    )}
                  </MDBox>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredEvents.length > 0 && totalPages > 1 && (
              <>
                <MDBox display="flex" justifyContent="center" mt={3} mb={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "text.main",
                        borderColor: "primary.main",
                        "&:hover": {
                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                      },
                      "& .MuiPaginationItem-page.Mui-selected": {
                        backgroundColor: "info.main",
                        color: "white",
                        borderColor: "info.main",
                        "&:hover": {
                          backgroundColor: "info.dark",
                        },
                      },
                      "& .MuiPaginationItem-ellipsis": {
                        color: "text.main",
                      },
                    }}
                  />
                </MDBox>

                <MDBox
                  p={2}
                  display="flex"
                  justifyContent="center"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <MDTypography variant="button" color="text">
                    Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredEvents.length)} of{" "}
                    {filteredEvents.length} events
                  </MDTypography>
                </MDBox>
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default MyParticipatedEvents;
