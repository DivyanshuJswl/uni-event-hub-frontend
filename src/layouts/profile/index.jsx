// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/EventCard/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

import MetaMaskIntegration from "./components/LinkMetaMask";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

function Overview() {
  // Images
  const team1 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-1_a7rqfy.jpg";
  const team2 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-2_aq8yoc.jpg";
  const team3 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375375/team-3_njhtzr.jpg";
  const team4 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-4_efvdcl.jpg";
  // Get student data from localStorage
  const student = JSON.parse(localStorage.getItem("student"));
  const token = localStorage.getItem("token");

  if (!student || !token) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={5} mb={3}>
          <MDTypography variant="h4" fontWeight="medium" textAlign="center">
            Please log in to view your profile.
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Format student data for display
  const studentInfo = {
    year: student.year,
    email: student.email,
    branch: student.branch,
    metaMaskAddress: student.metaMaskAddress || "Not connected",
    role: student.role,
    isVerified: student.isVerified ? "Verified" : "Not Verified",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={student.name} avatar={student.avatar}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings role={student.role} />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 2 }} />
              <ProfileInfoCard
                title="Student Profile"
                description="Here you can find your profile information and manage your projects."
                info={studentInfo}
                social={[
                  {
                    link: "https://www.facebook.com/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "/profile/edit", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0, ml: 2 }} />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MetaMaskIntegration />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={`https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915812/home-decor-1_yioetq.jpg`}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={`https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915817/home-decor-2_dbiguz.jpg`}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={`https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915827/home-decor-3_yg04jv.jpg`}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={`https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915799/home-decor-4_awposa.jpg`}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
