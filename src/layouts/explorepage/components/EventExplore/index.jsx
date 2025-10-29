import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  Container,
  Typography,
  Box,
  Pagination,
  TextField,
  InputAdornment,
  Icon,
  Button,
  CircularProgress,
} from "@mui/material";
import EventCard from "examples/Cards/EventCard";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";
import MDTypography from "components/MDTypography";
import CategoryFilter from "./components/Category";
import MDBox from "components/MDBox";
import EventSkeleton from "components/EventSkeleton";
import { useAuth } from "context/AuthContext";
import axios from "axios";

const Explore = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user } = useAuth();
  const { showToast } = useNotifications();

  // Consolidated state
  const [exploreState, setExploreState] = useState({
    events: [],
    loading: true,
    refreshing: false,
    error: null,
    page: 1,
    searchTerm: "",
    categoryFilter: "all",
    articlesPerPage: 9,
    inputValue: "9",
  });

  // Memoized fetch function
  const fetchEvents = useCallback(
    async (isRefresh = false) => {
      setExploreState((prev) => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      try {
        const res = await axios.get(`${BASE_URL}/api/events`, {
          withCredentials: true,
          timeout: 10000,
        });

        const fetchedEvents = res?.data?.data?.events || [];

        setExploreState((prev) => ({
          ...prev,
          events: fetchedEvents,
          loading: false,
          refreshing: false,
          error: null,
          page: isRefresh ? 1 : prev.page,
        }));

        if (isRefresh) {
          showToast(`Loaded ${fetchedEvents.length} events`, "success", "Events Refreshed");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        const errorMessage =
          err.response?.data?.message || err.code === "ECONNABORTED"
            ? "Request timeout"
            : "Failed to fetch events";

        setExploreState((prev) => ({
          ...prev,
          events: [],
          loading: false,
          refreshing: false,
          error: errorMessage,
        }));

        showToast(errorMessage, "error", "Failed to Load Events");
      }
    },
    [BASE_URL, showToast]
  );

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoized handlers
  const handlePageChange = useCallback((event, value) => {
    setExploreState((prev) => ({ ...prev, page: value }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setExploreState((prev) => ({ ...prev, searchTerm: e.target.value, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setExploreState((prev) => ({ ...prev, categoryFilter: category, page: 1 }));
  }, []);

  const handleArticlesPerPageChange = useCallback((e) => {
    const value = e.target.value;
    setExploreState((prev) => ({ ...prev, inputValue: value }));

    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      const newValue = Math.min(parseInt(value), 12);
      setExploreState((prev) => ({
        ...prev,
        articlesPerPage: newValue,
        inputValue: newValue.toString(),
        page: 1,
      }));
    }
  }, []);

  const refreshEvents = useCallback(() => {
    fetchEvents(true);
  }, [fetchEvents]);

  // Check if user is enrolled
  const isUserEnrolled = useCallback(
    (eventId) => {
      return user?.enrolledEvents?.includes(eventId) || false;
    },
    [user]
  );

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    return exploreState.events.filter((event) => {
      const matchesSearch =
        exploreState.searchTerm === "" ||
        event.title.toLowerCase().includes(exploreState.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(exploreState.searchTerm.toLowerCase());

      const matchesCategory =
        exploreState.categoryFilter === "all" ||
        event.category.toLowerCase() === exploreState.categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [exploreState.events, exploreState.searchTerm, exploreState.categoryFilter]);

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const indexOfLastEvent = exploreState.page * exploreState.articlesPerPage;
    const indexOfFirstEvent = indexOfLastEvent - exploreState.articlesPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / exploreState.articlesPerPage);

    return {
      currentEvents,
      totalPages,
      indexOfFirstEvent,
      indexOfLastEvent,
    };
  }, [filteredEvents, exploreState.page, exploreState.articlesPerPage]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "text.main" }}>
            Explore Events
          </Typography>
          <MDTypography variant="subtitle1" color="text">
            Discover upcoming events in your area
            {user?.enrolledEvents?.length > 0 && (
              <span style={{ color: "#2ca630ff", fontWeight: "bold", marginLeft: "8px" }}>
                • Enrolled in {user.enrolledEvents.length} event(s)
              </span>
            )}
          </MDTypography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexDirection: { xs: "column", md: "row" } }}>
          <MDBox display="flex" gap={2} flexGrow={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={exploreState.searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ borderRadius: 2, backgroundColor: "background.default" }}
                  >
                    <Icon fontSize="small" sx={{ color: "text.main" }}>
                      search
                    </Icon>
                  </InputAdornment>
                ),
              }}
            />
            <CategoryFilter
              categoryFilter={exploreState.categoryFilter}
              setCategoryFilter={handleCategoryChange}
              setPage={(page) => setExploreState((prev) => ({ ...prev, page }))}
            />
          </MDBox>
          <MDBox display="flex" alignItems="center">
            <TextField
              label="Items per page"
              type="number"
              value={exploreState.inputValue}
              onChange={handleArticlesPerPageChange}
              size="small"
              inputProps={{ min: 1, max: 12 }}
              sx={{ width: 120, mr: 2, "& .MuiInputBase-input": { color: "text.main" } }}
            />
            <Button
              variant="outlined"
              onClick={refreshEvents}
              disabled={exploreState.loading || exploreState.refreshing}
              startIcon={
                exploreState.refreshing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Icon>refresh</Icon>
                )
              }
              sx={{
                borderRadius: "8px",
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(25, 118, 210, 0.08)"
                    : "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              {exploreState.refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </MDBox>
        </Box>

        {/* Events Grid */}
        {exploreState.loading ? (
          <Grid container spacing={4}>
            <EventSkeleton />
          </Grid>
        ) : exploreState.error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading events: {exploreState.error}
            </MDTypography>
            <Button
              variant="contained"
              color="primary"
              onClick={refreshEvents}
              startIcon={<Icon>refresh</Icon>}
              sx={{ borderRadius: 2 }}
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
                    <EventCard event={event} isEnrolled={isUserEnrolled(event._id)} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "text.main", mt: 4 }}>
                    {filteredEvents.length === 0 && exploreState.events.length > 0
                      ? "No events match your filters."
                      : "No events found."}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredEvents.length > 0 && paginationData.totalPages > 1 && (
              <>
                <MDBox display="flex" justifyContent="center" mt={3} mb={2}>
                  <Pagination
                    count={paginationData.totalPages}
                    page={exploreState.page}
                    onChange={handlePageChange}
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
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <MDTypography variant="button" color="text">
                    Showing {paginationData.indexOfFirstEvent + 1}-
                    {Math.min(paginationData.indexOfLastEvent, filteredEvents.length)} of{" "}
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
};

export default Explore;
