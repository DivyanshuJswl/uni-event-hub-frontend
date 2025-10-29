import { useEffect, useMemo, useState, useCallback } from "react";
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
import { useNotifications } from "context/NotifiContext";
import { useAuth } from "context/AuthContext";
import ParticipatedEventCard from "examples/Cards/ParticipatedEventCard";
import EventSkeleton from "components/EventSkeleton";
import { useNavigate } from "react-router-dom";

function MyParticipatedEvents() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user, token } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // Consolidated state
  const [pageState, setPageState] = useState({
    events: [],
    loading: true,
    refreshing: false,
    error: null,
    searchTerm: "",
    statusFilter: "all",
    page: 1,
    itemsPerPage: 9,
    inputValue: "9",
    unenrollLoading: null,
  });

  // Memoized fetch function
  const fetchParticipatedEvents = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) {
        setPageState((prev) => ({
          ...prev,
          error: "Please log in to view your events",
          loading: false,
        }));
        return;
      }

      setPageState((prev) => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      try {
        const res = await axios.get(`${BASE_URL}/api/events/students/${user.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
          timeout: 10000,
        });

        setPageState((prev) => ({
          ...prev,
          events: res?.data?.data?.events || [],
          loading: false,
          refreshing: false,
          error: null,
          page: isRefresh ? 1 : prev.page,
        }));

        if (isRefresh) {
          showToast(
            `Loaded ${res?.data?.data?.events?.length || 0} events`,
            "success",
            "Events Refreshed"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.code === "ECONNABORTED"
            ? "Request timeout"
            : "Failed to fetch participated events";

        setPageState((prev) => ({
          ...prev,
          events: [],
          loading: false,
          refreshing: false,
          error: errorMessage,
        }));

        showToast(errorMessage, "error", "Failed to Load Events");
      }
    },
    [user?.id, BASE_URL, token, showToast]
  );

  // Initial fetch
  useEffect(() => {
    fetchParticipatedEvents();
  }, [fetchParticipatedEvents]);

  // Memoized handlers
  const handleRefresh = useCallback(() => {
    fetchParticipatedEvents(true);
  }, [fetchParticipatedEvents]);

  const handleUnenroll = useCallback(
    async (eventId) => {
      if (!user?.id) return;

      setPageState((prev) => ({ ...prev, unenrollLoading: eventId }));

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

        setPageState((prev) => ({
          ...prev,
          events: prev.events.filter((event) => event._id !== eventId),
          unenrollLoading: null,
        }));

        showToast("Successfully unenrolled from event", "success", "Unenrolled");
      } catch (err) {
        console.error("Error unenrolling from event:", err);
        const errorMessage = err.response?.data?.message || "Failed to unenroll from event";

        setPageState((prev) => ({ ...prev, unenrollLoading: null }));
        showToast(errorMessage, "error", "Unenrollment Failed");
      }
    },
    [user?.id, BASE_URL, token, showToast]
  );

  const handleItemsPerPageChange = useCallback((e) => {
    const value = e.target.value;
    setPageState((prev) => ({ ...prev, inputValue: value }));

    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      const newValue = Math.min(parseInt(value), 12);
      setPageState((prev) => ({
        ...prev,
        itemsPerPage: newValue,
        inputValue: newValue.toString(),
        page: 1,
      }));
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    setPageState((prev) => ({
      ...prev,
      searchTerm: e.target.value,
      page: 1,
    }));
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setPageState((prev) => ({
      ...prev,
      statusFilter: status,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((_, value) => {
    setPageState((prev) => ({ ...prev, page: value }));
  }, []);

  // Calculate event statistics
  const stats = useMemo(() => {
    const now = new Date();
    return pageState.events.reduce(
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
      { total: pageState.events.length, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
    );
  }, [pageState.events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return pageState.events.filter((event) => {
      const matchesSearch =
        pageState.searchTerm === "" ||
        event.title?.toLowerCase().includes(pageState.searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(pageState.searchTerm.toLowerCase());

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

      const matchesStatus =
        pageState.statusFilter === "all" || pageState.statusFilter === computedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [pageState.events, pageState.searchTerm, pageState.statusFilter]);

  // Pagination data
  const paginationData = useMemo(() => {
    const indexOfLast = pageState.page * pageState.itemsPerPage;
    const indexOfFirst = indexOfLast - pageState.itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEvents.length / pageState.itemsPerPage) || 1;

    return { currentEvents, totalPages, indexOfFirst, indexOfLast };
  }, [filteredEvents, pageState.page, pageState.itemsPerPage]);

  // Memoized status chips
  const statusChips = useMemo(
    () => [
      { key: "all", label: `All ${stats.total}`, color: "primary" },
      { key: "upcoming", label: `Upcoming ${stats.upcoming}`, color: "success" },
      { key: "ongoing", label: `Ongoing ${stats.ongoing}`, color: "warning" },
      { key: "completed", label: `Completed ${stats.completed}`, color: "secondary" },
      { key: "cancelled", label: `Cancelled ${stats.cancelled}`, color: "error" },
    ],
    [stats]
  );

  if (!user) {
    return (
      <Container maxWidth="xl">
        <MDBox py={4} textAlign="center">
          <MDTypography variant="h6" color="error" sx={{ mb: 2 }}>
            Please log in to view your participated events.
          </MDTypography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/authentication/sign-in")}
          >
            Log In
          </Button>
        </MDBox>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "text.main" }}>
            My Participated Events
          </Typography>
          <MDTypography variant="subtitle1" color="text">
            View and manage your event registrations
            {pageState.events.length > 0 && (
              <span style={{ color: "#2ca630ff", fontWeight: "bold", marginLeft: "8px" }}>
                • Participated in {pageState.events.length} event(s)
              </span>
            )}
          </MDTypography>
        </Box>

        {/* Status Chips */}
        <Stack direction="row" sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {statusChips.map((chip) => (
            <Chip
              key={chip.key}
              label={chip.label}
              color={chip.color}
              onClick={() => handleStatusFilterChange(chip.key)}
              variant={pageState.statusFilter === chip.key ? "filled" : "outlined"}
              sx={{ mb: 1, borderRadius: "8px", fontWeight: 400, fontSize: "0.75rem" }}
            />
          ))}
        </Stack>

        {/* Search and Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            alignItems: isSmall ? "center" : "flex-end",
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <TextField
            fullWidth={isSmall}
            size="small"
            variant="outlined"
            placeholder="Search your events..."
            value={pageState.searchTerm}
            onChange={handleSearchChange}
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: isSmall ? "100%" : "auto",
            }}
          >
            <TextField
              label="Items per page"
              type="number"
              value={pageState.inputValue}
              onChange={handleItemsPerPageChange}
              size="small"
              inputProps={{ min: 1, max: 12 }}
              sx={{ width: isSmall ? "100%" : "140px" }}
            />

            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={pageState.loading || pageState.refreshing}
              startIcon={
                pageState.refreshing ? (
                  <MUICircularProgress size={20} color="inherit" />
                ) : (
                  <Icon>refresh</Icon>
                )
              }
              sx={{ borderRadius: "4px", color: "primary.main", borderColor: "primary.main" }}
            >
              {pageState.refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </Box>
        </Box>

        {/* Events Grid */}
        {pageState.loading ? (
          <Grid container spacing={4}>
            <EventSkeleton />
          </Grid>
        ) : pageState.error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading events: {pageState.error}
            </MDTypography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              startIcon={<Icon>refresh</Icon>}
            >
              Try Again
            </Button>
          </MDBox>
        ) : (
          <>
            <Grid container spacing={4}>
              {paginationData.currentEvents.length > 0 ? (
                paginationData.currentEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={event._id}>
                    <ParticipatedEventCard
                      event={event}
                      onUnenroll={handleUnenroll}
                      unenrollLoading={pageState.unenrollLoading === event._id}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <MDBox textAlign="center" py={8}>
                    <Typography variant="h6" sx={{ color: "text.main", mb: 2 }}>
                      {pageState.events.length === 0
                        ? "You haven't participated in any events yet."
                        : "No events match your filters."}
                    </Typography>
                    {pageState.events.length === 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/explore")}
                      >
                        Explore Events
                      </Button>
                    )}
                  </MDBox>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredEvents.length > 0 && paginationData.totalPages > 1 && (
              <>
                <MDBox display="flex" justifyContent="center" mt={3} mb={2}>
                  <Pagination
                    count={paginationData.totalPages}
                    page={pageState.page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
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
                    Showing {paginationData.indexOfFirst + 1}-
                    {Math.min(paginationData.indexOfLast, filteredEvents.length)} of{" "}
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
