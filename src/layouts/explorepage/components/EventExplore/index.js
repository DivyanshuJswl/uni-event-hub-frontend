import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import EventCard from "examples/Cards/EventCard/indexProject";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import CategoryFilter from "./components/Category";
import MDBox from "components/MDBox";
import axios from "axios";

const Explore = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inputValue, setInputValue] = useState("9");
  const [articlesPerPage, setArticlesPerPage] = useState(9);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);

      const res = await axios.get(BASE_URL + "/api/events", { withCredentials: true });
      const fetchedEvents = res?.data?.data?.events || [];

      setEvents(fetchedEvents);
      setError(null);

      console.log("Events fetched:", fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refreshNews = async () => {
    try {
      console.log("Refreshing events...");
      setRefreshing(true);
      setError(null);
      await fetchEvents();
      console.log("Events refreshed successfully");
      setPage(1); // Reset to first page when refreshing
    } catch (err) {
      console.error("Error refreshing events:", err);
      setError(err.message);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleArticlesPerPageChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      if (parseInt(value) > 12) {
        setInputValue("12");
        setArticlesPerPage(12);
      } else {
        setArticlesPerPage(parseInt(value));
        setPage(1); // Reset to first page when changing items per page
      }
    }
  };

  // Filter events based on search term and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || event.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Calculate current page events range
  const indexOfLastEvent = page * articlesPerPage;
  const indexOfFirstEvent = indexOfLastEvent - articlesPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / articlesPerPage);

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
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: darkMode ? "white" : "primary",
            }}
          >
            Explore Events
          </Typography>
          <MDTypography
            variant="subtitle1"
            sx={{
              color: darkMode ? "white" : "primary",
            }}
          >
            Discover upcoming events in your area
          </MDTypography>
        </Box>

        {/* Search and Filter Section */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <MDBox display="flex" gap={2} flexGrow={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
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
                },
              }}
            />
            <CategoryFilter
              categoryFilter={categoryFilter}
              setCategoryFilter={(category) => {
                setCategoryFilter(category);
              }}
              setPage={setPage}
            />
          </MDBox>
          <MDBox display="flex" alignItems="center">
            <TextField
              label="Items per page"
              type="number"
              value={inputValue}
              onChange={handleArticlesPerPageChange}
              size="small"
              sx={{ width: 120, mr: 2 }}
            />
            <Button
              variant="outlined"
              sx={{
                borderRadius: "8px",
                fontWeight: 300,
                borderWidth: "1px",
                color: darkMode ? "primary.main" : "text.primary",
                borderColor: darkMode ? "primary.main" : "text.primary",
                "&:hover": {
                  borderColor: darkMode ? "primary.dark" : "text.secondary",
                },
                "&.Mui-disabled": {
                  borderColor: darkMode ? "text.disabled" : "action.disabledBackground",
                  color: darkMode ? "text.disabled" : "action.disabled",
                },
              }}
              onClick={refreshNews}
              disabled={loading || refreshing}
              startIcon={
                refreshing ? <CircularProgress size={20} color="inherit" /> : <Icon>refresh</Icon>
              }
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </MDBox>
        </Box>

        {/* Events Grid */}
        {loading ? (
          <MDBox display="flex" justifyContent="center" py={4}>
            <CircularProgress color="info" />
          </MDBox>
        ) : error ? (
          <MDBox py={2} textAlign="center">
            <MDTypography variant="body2" color="error">
              Error loading events: {error}
            </MDTypography>
            <Button
              variant="text"
              color="info"
              onClick={refreshNews}
              startIcon={<Icon>refresh</Icon>}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </MDBox>
        ) : (
          <>
            <Grid container spacing={4}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id || index}>
                    <EventCard
                      image={
                        event.featuredImage?.url ||
                        event.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60"
                      }
                      title={event.title}
                      description={event.description}
                      category={event.category}
                      date={event.date}
                      location={event.location}
                      maxParticipants={event.maxParticipants}
                      currentParticipants={event.participants.length}
                      organizerName={event.organizer.name}
                      organizerEmail={event.organizer.email}
                      status={event.status}
                      isFull={event.isFull}
                      _id={event._id}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: darkMode ? "white" : "black", mt: 4 }}>
                    {filteredEvents.length === 0 && events.length > 0
                      ? "No events match your filters."
                      : "No events found."}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Pagination and Results Count */}
            {filteredEvents.length > 0 && (
              <>
                <MDBox display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="secondary"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-page.Mui-selected": {
                        color: "white",
                      },
                      //make non selected text white
                      "& .MuiPaginationItem-page": {
                        color: darkMode ? "white" : "text.primary",
                      },
                    }}
                  />
                </MDBox>
                <MDBox display="flex" justifyContent="center" mt={1} mb={3}>
                  <MDTypography variant="button" color={darkMode ? "white" : "text"}>
                    Showing {indexOfFirstEvent + 1}-
                    {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length}{" "}
                    events
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
