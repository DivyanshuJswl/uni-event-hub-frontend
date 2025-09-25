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
} from "@mui/material";
import axios from "axios";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";
import ParticipatedEventCard from "examples/Cards/ParticipatedEventCard";
import EventSkeleton from "components/EventSkeleton";

function MyParticipatedEvents() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [unenrollLoading, setUnenrollLoading] = useState(null);

  const fetchParticipatedEvents = async () => {
    if (!user?.id) {
      setError("Please log in to view your events");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/api/events/students/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      setEvents(res?.data?.data?.events || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch participated events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipatedEvents();
  }, [user?.id, BASE_URL, token]);

  const handleUnenroll = async (eventId) => {
    if (!user?.id) return;

    try {
      setUnenrollLoading(eventId);
      await axios.post(
        `${BASE_URL}/api/events/unenroll/${_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // Remove the event from the list
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error("Error unenrolling from event:", err);
      setError("Failed to unenroll from event");
    } finally {
      setUnenrollLoading(null);
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
        backgroundColor: darkMode ? "background.default" : "grey.100",
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
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
          {[
            { key: "all", label: `All: ${stats.total}`, color: "primary" },
            { key: "upcoming", label: `Upcoming: ${stats.upcoming}`, color: "secondary" },
            { key: "ongoing", label: `Ongoing: ${stats.ongoing}`, color: "warning" },
            { key: "completed", label: `Completed: ${stats.completed}`, color: "success" },
            { key: "cancelled", label: `Cancelled: ${stats.cancelled}`, color: "error" },
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
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search your events..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon fontSize="small" color={darkMode ? "white" : "black"}>
                    search
                  </Icon>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: darkMode ? "" : "white",
                maxWidth: "400px",
              },
            }}
          />
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
              onClick={fetchParticipatedEvents}
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
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
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
                        href="/explore"
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
                    color="primary"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: darkMode ? "white" : "text.primary",
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: darkMode ? "primary.main" : "primary.main",
                        color: "white",
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
