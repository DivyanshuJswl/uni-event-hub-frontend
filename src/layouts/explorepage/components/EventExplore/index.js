import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Typography,
  Box,
  Pagination,
  MenuItem,
  TextField,
  InputAdornment,
  Icon,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import EventCard from "examples/Cards/ProjectCards/indexProject";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import CategoryFilter from "./components/Category";

import axios from "axios";
import { BASE_URL } from "utils/constants";

// Mock data for events (replace with your actual data source)
const mockEvents = [
  {
    image: "https://source.unsplash.com/random/300x200?event=1",
    title: "Tech Conference 2023",
    description: "Annual technology summit featuring industry leaders",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=2",
    title: "Art Exhibition",
    description: "Contemporary art showcase from local artists",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=3",
    title: "Music Festival",
    description: "3-day outdoor festival with multiple stages",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=4",
    title: "Startup Pitch Night",
    description: "Early-stage startups present to investors",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=5",
    title: "Cooking Workshop",
    description: "Learn authentic Italian cuisine from master chefs",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=6",
    title: "Yoga Retreat",
    description: "Weekend wellness program in the mountains",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=7",
    title: "Book Launch",
    description: "Meet the author of this year's bestseller",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=8",
    title: "Film Premiere",
    description: "Exclusive screening of the award-winning documentary",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=9",
    title: "Science Fair",
    description: "Interactive exhibits for all ages",
  },
  {
    image: "https://source.unsplash.com/random/300x200?event=10",
    title: "Charity Gala",
    description: "Black-tie fundraiser for children's education",
  },
];

const Explore = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const eventsPerPage = 9;

  // // Calculate current events to display
  // const currentEvents = mockEvents.slice((page - 1) * eventsPerPage, page * eventsPerPage);

  const [events, setEvents] = useState();
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      console.log("inside events");
      const res = await axios.get(BASE_URL + "/api/events", { withCredentials: true });
      setEvents(res?.data?.data?.events);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term and category
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate current events to display
  const currentEvents = filteredEvents.slice((page - 1) * eventsPerPage, page * eventsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
              color: darkMode ? "white" : "text.primary",
            }}
          >
            Explore Events
          </Typography>
          <MDTypography
            variant="subtitle1"
            sx={{
              color: darkMode ? "white" : "text.primary",
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
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page when searching
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
            setCategoryFilter={setCategoryFilter}
            setPage={setPage}
          />
        </Box>

        {/* Events Grid */}
        <Grid container spacing={4}>
          {events !== null &&
            events !== undefined &&
            events.length !== 0 &&
            events.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <EventCard
                  image="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60"
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  date={event.date}
                  location={event.location}
                  maxParticipants={event.maxParticipants}
                  status={event.status}
                  _id={event._id}
                />
              </Grid>
            ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(mockEvents.length / eventsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: darkMode ? "white" : "text.primary",
              },
            }}
          />
        </Box>
        <p>{error}</p>
      </Container>
    </Box>
  );
};

export default Explore;
