// @mui material components
import Grid from "@mui/material/Grid";
import React from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { motion } from "framer-motion";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Typography from "@mui/material/Typography";

// Data
import EventCard from "examples/Cards/EventCard/indexProject";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import WelcomeBox from "./components/WelcomeBox";
import LeaderboardTable from "./components/Leaderboard";

import hack1 from "assets/images/hackathon/1.jpg";
import hack2 from "assets/images/hackathon/2.jpg";
import hack3 from "assets/images/hackathon/3.jpg";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const events = [
    {
      date: {
        month: "MAR",
        day: 20,
      },
      title: "Web Development Workshop",
      time: "2:00 PM - 4:00 PM",
    },
    {
      date: {
        month: "MAR",
        day: 22,
      },
      title: "Data Science Meetup",
      time: "3:00 PM - 5:00 PM",
    },
    {
      date: {
        month: "APR",
        day: 3,
      },
      title: "Hack With Tricity Hackathon",
      time: "10:00 AM - 5:00 PM",
    },
  ];
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
                    label: "than lask week",
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
        {/* mAIN */}
        <MDBox mt={4.5}>
          <Typography variant="h4" gutterBottom paddingBottom={4}>
            Recommended Events
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EventCard
                  image={hack1}
                  title="Future Tech Summit 2025"
                  description="Annual technology conference featuring AI, blockchain, and quantum computing experts"
                  category="conference"
                  date="September 15, 2025 at 9:00 AM"
                  location="Convention Center, San Francisco"
                  maxParticipants={500}
                  currentParticipants={427}
                  organizerName="Tech Events Inc."
                  organizerEmail="events@techevents.com"
                  status="upcoming"
                  isFull={false}
                  _id="techconf_2025_001"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EventCard
                  image={hack2}
                  title="Sunrise Yoga Retreat"
                  description="Morning yoga session with meditation and breathing exercises by the beach"
                  category="wellness"
                  date="July 8, 2025 at 5:30 AM"
                  location="Beachfront Park, Miami"
                  maxParticipants={30}
                  currentParticipants={30}
                  organizerName="Zen Life"
                  organizerEmail="contact@zenlife.com"
                  status="upcoming"
                  isFull={true}
                  _id="yoga_retreat_0725"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EventCard
                  image={hack3}
                  title="Innovation Challenge 2025"
                  description="Pitch your startup idea to top VCs and win $100,000 in funding"
                  category="competition"
                  date="November 20, 2025 at 2:00 PM"
                  location="Tech Hub, New York"
                  maxParticipants={15}
                  currentParticipants={8}
                  organizerName="Venture Network"
                  organizerEmail="info@venturenetwork.co"
                  status="ongoing"
                  isFull={false}
                  _id="pitch_comp_1125"
                />
              </MDBox>
            </Grid>
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

export default Dashboard;
