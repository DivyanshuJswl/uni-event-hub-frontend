// @mui material components
import Grid from "@mui/material/Grid";
import React from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
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

function DashboardOrg() {
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
                  title="Tech Era 2.0 - A Fusion of Technical & Non-Technical Challenges"
                  description="Apex Techno Warriors, in collaboration with Alexa Developers Community, GeeksforGeeks CU, and Rotaract Club, invites you to Tech Era 2.0 – a two-day extravaganza featuring coding challenges, project exhibitions, debates, marketing competitions, and more! 🎯"
                  date="April 1-2, 2025"
                  location="Chandigarh University"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EventCard
                  image={hack2}
                  title="What The Hack: 24 hour hackathon In collaboration with C Square & CyberLock"
                  description="The ultimate 24-hour national-level hackathon is calling YOU! 💻⚡
Are you ready to push boundaries, innovate, and compete with the best?"
                  date="April 4-5, 2025"
                  location="Chandigarh University, Punjab"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EventCard
                  image={hack3}
                  title="Curie Lab: Empowering Students in Science & Innovation!"
                  description="Explore opportunities in engineering, tech, & business with expert insights, career guidance, and entrepreneurial strategies!"
                  date="April 11, 2025"
                  location="Curie Lab, Chandigarh University"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview events={events} />
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
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
