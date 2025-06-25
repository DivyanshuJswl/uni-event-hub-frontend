// @mui material components
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import NewsSection from "./components/NewsSection";
import Transactions from "./components/Transactions";
import Explore from "./components/EventExplore";

function ExplorePage() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute />
      <MDBox mt={8}>
        <Explore />
      </MDBox>
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <NewsSection />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ExplorePage;
