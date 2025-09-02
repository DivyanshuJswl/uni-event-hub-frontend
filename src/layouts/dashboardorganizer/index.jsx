// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import axios from "axios";
import { motion } from "framer-motion";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Typography from "@mui/material/Typography";
// Data
import EventCard from "examples/Cards/EventCard/indexProject";
import { CircularProgress } from "@mui/material";
// Dashboard components
import Projects from "./components/Projects";
import OrdersOverview from "./components/OrdersOverview";
import WelcomeBox from "./components/WelcomeBox";
import LeaderboardTable from "./components/Leaderboard";

function DashboardOrg() {
  const hack1 =
    "https://res.cloudinary.com/dh5cebjwj/image/upload/v1750793776/samples/balloons.jpg";

  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch recommended events (latest 3 events)
        const recommendedResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/events?limit=3&sort=-createdAt`
        );

        // Fetch upcoming events (next 3 events by date)
        const upcomingResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/events?status=upcoming&limit=3&sort=startDate`
        );

        setRecommendedEvents(recommendedResponse.data.data?.events || []);
        setUpcomingEvents(upcomingResponse.data.data?.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to mock data if API fails
        setRecommendedEvents([]);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const events = upcomingEvents.map((event) => ({
    date: {
      month: new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase(),
      day: new Date(event.date).getDate(),
    },
    title: event.title,
    time: new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <WelcomeBox />
        </MDBox>
        {recommendedEvents.length > 0 && (
          <MDBox mt={4.5}>
            <Typography variant="h4" gutterBottom paddingBottom={4}>
              Recommended Events
            </Typography>
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <MDBox display="flex" justifyContent="center">
                    <CircularProgress />
                  </MDBox>
                </Grid>
              ) : (
                recommendedEvents.slice(0, 3).map((event) => (
                  <Grid item xs={12} md={6} lg={4} key={event._id}>
                    <MDBox mb={3}>
                      <EventCard
                        image={event.images?.[0]?.url || hack1}
                        title={event.title}
                        description={event.description}
                        category={event.category}
                        date={event.date}
                        location={event.location}
                        maxParticipants={event.maxParticipants}
                        currentParticipants={event.participants?.length || 0}
                        organizerName={event.organizer?.name}
                        organizerEmail={event.organizer?.email}
                        status={event.status}
                        isFull={event.participants?.length >= event.maxParticipants}
                        _id={event._id}
                      />
                    </MDBox>
                  </Grid>
                ))
              )}
            </Grid>
          </MDBox>
        )}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5} lg={8}>
                <Projects />
              </Grid>
              <Grid item xs={12} md={7} lg={4}>
                <OrdersOverview events={events} />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <LeaderboardTable />
              </Grid>
            </Grid>
          </MDBox>
        </motion.div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DashboardOrg;
