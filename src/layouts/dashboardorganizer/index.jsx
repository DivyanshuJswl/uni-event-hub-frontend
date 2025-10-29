import { useState, useEffect, useCallback, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import EventCard from "examples/Cards/EventCard";
import Projects from "layouts/dashboard/components/Calendar";
import OrdersOverview from "layouts/dashboard/components/UpcomingEvents";
import WelcomeBox from "layouts/dashboard/components/WelcomeBox";
import LeaderboardTable from "layouts/dashboard/components/Leaderboard";
import EventSkeleton from "components/EventSkeleton";
import { useNotifications } from "context/NotifiContext";
import MDButton from "components/MDButton";

function DashboardOrg() {
  const { showToast } = useNotifications();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Consolidated state
  const [dashboardState, setDashboardState] = useState({
    recommendedEvents: [],
    upcomingEvents: [],
    loading: true,
    error: null,
  });

  // Memoized fetch function
  const fetchEvents = useCallback(async () => {
    setDashboardState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Parallel API calls for better performance
      const [recommendedResponse, upcomingResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/events?limit=3&sort=-createdAt`, { timeout: 10000 }),
        axios.get(`${BASE_URL}/api/events?status=upcoming&limit=3&sort=startDate`, {
          timeout: 10000,
        }),
      ]);

      const recommendedEvents = recommendedResponse.data.data?.events || [];
      const upcomingEvents = upcomingResponse.data.data?.events || [];

      setDashboardState({
        recommendedEvents,
        upcomingEvents,
        loading: false,
        error: null,
      });

      // Show info if no events found
      if (recommendedEvents.length === 0 && upcomingEvents.length === 0) {
        showToast("No events found. Start creating events!", "info", "No Events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);

      const errorMessage =
        error.response?.data?.message || error.code === "ECONNABORTED"
          ? "Request timeout - Please check your connection"
          : "Failed to load events";

      setDashboardState({
        recommendedEvents: [],
        upcomingEvents: [],
        loading: false,
        error: errorMessage,
      });

      showToast(errorMessage, "error", "Failed to Load Events");
    }
  }, [BASE_URL, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoized formatted events for calendar
  const formattedEvents = useMemo(() => {
    return dashboardState.upcomingEvents.map((event) => ({
      date: {
        month: new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase(),
        day: new Date(event.date).getDate(),
      },
      title: event.title,
      time: new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }, [dashboardState.upcomingEvents]);

  // Render error state
  const renderErrorState = useCallback(
    () => (
      <Grid item xs={12}>
        <MDBox textAlign="center" py={4}>
          <Typography variant="h6" color="error" gutterBottom>
            {dashboardState.error}
          </Typography>
          <MDButton variant="gradient" color="info" onClick={fetchEvents} sx={{ mt: 2 }}>
            Retry
          </MDButton>
        </MDBox>
      </Grid>
    ),
    [dashboardState.error, fetchEvents]
  );

  // Render empty state
  const renderEmptyState = useCallback(
    () => (
      <Grid item xs={12}>
        <MDBox textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No recommended events available at this time
          </Typography>
        </MDBox>
      </Grid>
    ),
    []
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <WelcomeBox />
        </MDBox>

        {/* Recommended Events Section */}
        <MDBox mt={4.5}>
          <Typography variant="h4" gutterBottom sx={{ pb: 4 }}>
            Recommended Events
          </Typography>
          <Grid container spacing={3}>
            {dashboardState.loading ? (
              <EventSkeleton />
            ) : dashboardState.error ? (
              renderErrorState()
            ) : dashboardState.recommendedEvents.length > 0 ? (
              dashboardState.recommendedEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <MDBox mb={3}>
                    <EventCard event={event} />
                  </MDBox>
                </Grid>
              ))
            ) : (
              renderEmptyState()
            )}
          </Grid>
        </MDBox>

        {/* Calendar and Upcoming Events */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview events={formattedEvents} loading={dashboardState.loading} />
            </Grid>
            <Grid item xs={12}>
              <LeaderboardTable />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DashboardOrg;
