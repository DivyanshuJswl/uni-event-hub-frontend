import { useState, useEffect, useCallback, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import EventCard from "examples/Cards/EventCard";
import EventSkeleton from "components/EventSkeleton";
import Projects from "layouts/dashboard/components/Calendar";
import OrdersOverview from "layouts/dashboard/components/UpcomingEvents";
import WelcomeBox from "./components/WelcomeBox";
import LeaderboardTable from "./components/Leaderboard";
import { useNotifications } from "context/NotifiContext";

function Dashboard() {
  const navigate = useNavigate();
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

      setDashboardState({
        recommendedEvents: recommendedResponse.data.data?.events || [],
        upcomingEvents: upcomingResponse.data.data?.events || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching events:", error);

      const errorMessage =
        error.response?.data?.message || error.code === "ECONNABORTED"
          ? "Request timeout - Please try again"
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

  // Memoized navigation handlers
  const handleCertificatesClick = useCallback(() => {
    navigate("/my-certificate");
  }, [navigate]);

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

  // Memoized statistics data (placeholder - replace with real API data)
  const statistics = useMemo(
    () => [
      {
        color: "dark",
        icon: "weekend",
        title: "Events Attended",
        count: 281,
        percentage: { color: "success", amount: "+5%", label: "than last week" },
      },
      {
        icon: "redeem",
        title: "Certificates",
        count: "12",
        percentage: { color: "success", amount: "+3%", label: "than last month" },
        onClick: handleCertificatesClick,
      },
      {
        color: "success",
        icon: "store",
        title: "Points Earned",
        count: "340",
        percentage: { color: "success", amount: "+1%", label: "than yesterday" },
      },
      {
        color: "primary",
        icon: "people",
        title: "Communities Joined",
        count: "+9",
        percentage: { color: "success", amount: "", label: "Just updated" },
      },
    ],
    [handleCertificatesClick]
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <WelcomeBox />
          {/* Statistics Cards */}
          <Grid container spacing={3}>
            {statistics.map((stat, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <MDBox
                  mb={1.5}
                  onClick={stat.onClick}
                  sx={{ cursor: stat.onClick ? "pointer" : "default" }}
                >
                  <ComplexStatisticsCard {...stat} />
                </MDBox>
              </Grid>
            ))}
          </Grid>
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
              <Grid item xs={12}>
                <MDBox textAlign="center" py={4}>
                  <Typography variant="body1" color="error" gutterBottom>
                    {dashboardState.error}
                  </Typography>
                  <MDBox mt={2}>
                    <button onClick={fetchEvents}>Retry</button>
                  </MDBox>
                </MDBox>
              </Grid>
            ) : dashboardState.recommendedEvents.length > 0 ? (
              dashboardState.recommendedEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <MDBox mb={3}>
                    <EventCard event={event} />
                  </MDBox>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <MDBox textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    No recommended events available
                  </Typography>
                </MDBox>
              </Grid>
            )}
          </Grid>
        </MDBox>

        {/* Calendar and Upcoming Events */}
        <MDBox mt={4.5}>
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

export default Dashboard;
