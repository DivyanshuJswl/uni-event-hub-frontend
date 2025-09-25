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
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress as MUICircularProgress,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import EventSkeleton from "components/EventSkeleton";
import { useMaterialUIController } from "context";
import { useAuth, withRole } from "context/AuthContext";
import OrganizerEventCard from "examples/Cards/OrganizerEventCard";
import { useNavigate } from "react-router-dom";

function OrganizedEvents() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inputValue, setInputValue] = useState("9");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const organizerId = user?.id;

  const fetchOrganizedEvents = async () => {
    if (!organizerId) {
      setLoading(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/api/events`, {
        params: { organizer: organizerId },
        withCredentials: true,
      });

      const fetched = res?.data?.data?.events || [];
      setEvents(fetched);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch organized events");
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrganizedEvents();
  }, [organizerId, BASE_URL]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrganizedEvents();
    setPage(1);
  };

  const handlePageChange = (_e, value) => setPage(value);

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      const eventDate = new Date(event.date);
      // Default event duration to 2 hours if not specified
      const eventEnd = event.endDate
        ? new Date(event.endDate)
        : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

      let computedStatus = "completed";
      if (now < eventDate) computedStatus = "upcoming";
      else if (now >= eventDate && now <= eventEnd) computedStatus = "ongoing";

      const matchesStatus = statusFilter === "all" || statusFilter === computedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const indexOfLast = page * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  // Calculate event counts
  const eventCounts = useMemo(() => {
    const now = new Date();
    return events.reduce(
      (acc, event) => {
        const eventDate = new Date(event.date);
        const eventEnd = event.endDate
          ? new Date(event.endDate)
          : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

        if (now < eventDate) acc.upcoming += 1;
        else if (now >= eventDate && now <= eventEnd) acc.ongoing += 1;
        else acc.completed += 1;

        return acc;
      },
      { total: events.length, upcoming: 0, ongoing: 0, completed: 0 }
    );
  }, [events]);

  if (!user) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={4} textAlign="center">
          <MDTypography variant="h6" color="error">
            Please log in to view your organized events.
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: darkMode ? "white" : "primary" }}
            >
              Organized Events
            </Typography>
            <MDTypography variant="subtitle1" sx={{ color: darkMode ? "white" : "primary" }}>
              View and manage your events and webinars
            </MDTypography>
          </Box>

          {/* Status Filter */}
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
            {[
              { key: "all", label: `All ${eventCounts.total}`, color: "primary" },
              { key: "upcoming", label: `Upcoming ${eventCounts.upcoming}`, color: "secondary" },
              { key: "ongoing", label: `Ongoing ${eventCounts.ongoing}`, color: "success" },
              { key: "completed", label: `Completed ${eventCounts.completed}`, color: "error" },
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

          {/* Search and Controls - Fixed Layout */}
          <Grid container spacing={2} alignItems="center" mb={4}>
            {/* Search Field - Takes full width on small screens, half on medium+ */}
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  justifyContent: isSmall ? "center" : "flex-start",
                  width: "100%",
                }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search your events..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  fullWidth={isSmall}
                  sx={{
                    width: isSmall ? "15rem" : "400px",
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
                      "& .MuiInputBase-input": {
                        color: darkMode ? "white" : "text.primary",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Controls - Takes full width on small screens, half on medium+ */}
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  justifyContent: isSmall ? "center" : "flex-end",
                  flexWrap: isSmall ? "wrap" : "nowrap",
                  width: "100%",
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
                    width: isSmall ? "120px" : "140px",
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
                  disabled={loading || refreshing || !organizerId}
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
            </Grid>
          </Grid>

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
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                      <OrganizerEventCard event={event} onUpdated={handleRefresh} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <MDBox textAlign="center" py={8}>
                      <Typography variant="h6" sx={{ color: darkMode ? "white" : "black", mb: 2 }}>
                        {events.length === 0
                          ? "You haven't organized any events yet."
                          : "No events match your filters."}
                      </Typography>
                      {events.length === 0 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate("/create-event")}
                          sx={{ borderRadius: 2 }}
                        >
                          Create Your First Event
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
                      onChange={handlePageChange}
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
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.02)"
                        : "rgba(0, 0, 0, 0.02)",
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
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default withRole(OrganizedEvents, "organizer");
