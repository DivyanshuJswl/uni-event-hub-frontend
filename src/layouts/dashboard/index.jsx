// @mui material components
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { motion } from "framer-motion";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Typography from "@mui/material/Typography";
import EventCard from "examples/Cards/EventCard";
import EventSkeleton from "components/EventSkeleton";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import WelcomeBox from "./components/WelcomeBox";
import LeaderboardTable from "./components/Leaderboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const hack1 =
    "https://res.cloudinary.com/dh5cebjwj/image/upload/v1750793776/samples/balloons.jpg";
  const navigate = useNavigate();
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Events Attended"
                  count={281}
                  percentage={{
                    color: "success",
                    amount: "+5%",
                    label: "than last week",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox
                mb={1.5}
                onClick={() => {
                  navigate("/my-certificate");
                }}
              >
                <ComplexStatisticsCard
                  icon="redeem"
                  title="Certificates"
                  count="12"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Points Earned"
                  count="340"
                  percentage={{
                    color: "success",
                    amount: "+1%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="people"
                  title="Communities Joined"
                  count="+9"
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Recommended Events Section */}
        <MDBox mt={4.5}>
          <Typography variant="h4" gutterBottom paddingBottom={4}>
            Recommended Events
          </Typography>
          <Grid container spacing={3}>
            {loading ? (
              // Skeleton loading state
              <EventSkeleton />
            ) : (
              recommendedEvents.slice(0, 3).map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <MDBox mb={3}>
                    <EventCard event={event} />
                  </MDBox>
                </Grid>
              ))
            )}
          </Grid>
        </MDBox>
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
                <OrdersOverview events={events} loading={loading} />
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

export default Dashboard;
