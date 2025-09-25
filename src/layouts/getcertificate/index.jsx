import React from "react";
import { CircularProgress } from "@mui/material";
import { Verified } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import HackathonTable from "./HackathonTable";
import { useHackathonWinners } from "./hooks/useHackathonWinners";
import { withAuth } from "context/AuthContext";

// Reusable components
function LoadingIndicator() {
  return (
    <MDBox display="flex" height="25vh" justifyContent="center" alignItems="center" m={3}>
      <CircularProgress m="50px" sx={{ color: "white"}} />
    </MDBox>
  );
}

function ErrorDisplay({ error, hasApiKey }) {
  return (
    <MDBox mx="auto" p={3} maxWidth="800px">
      <MDAlert color="error" mb={3}>
        <MDTypography variant="h6" color="white">
          Error
        </MDTypography>
        {error}
      </MDAlert>
      {!hasApiKey && (
        <MDAlert color="warning">
          <MDTypography variant="body2" color="white">
            Please ensure you have a .env file with VITE_GOOGLE_API_KEY set.
          </MDTypography>
        </MDAlert>
      )}
    </MDBox>
  );
}

function EmptyState() {
  return (
    <MDBox mx="auto" p={3} textAlign="center" maxWidth="800px">
      <MDTypography variant="h5" gutterBottom color="white">
        No Data Available
      </MDTypography>
      <MDTypography variant="body2" color="white">
        The Google Sheet is empty or couldn&apos;t be loaded.
      </MDTypography>
    </MDBox>
  );
}

const HackathonWinners = () => {
  const { data, loading, error, stats } = useHackathonWinners();
  const hasApiKey = Boolean((import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_VITE_GOOGLE_API_KEY || "").trim());

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mx={3} mt={5}>
        <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h4" mt={1}>
            Hackathon Winners
          </MDTypography>
          <MDButton mt={2} variant="gradient" color="success" startIcon={<Verified />} size="small">
            Verify All
          </MDButton>
        </MDBox>
        {loading && <LoadingIndicator />}
        {!loading && error && <ErrorDisplay error={error} hasApiKey={hasApiKey} />}
        {!loading && !error && (
          <MDBox mb={3} display="flex">
            <HackathonTable data={data} />
          </MDBox>
        )}
        {!loading && !error && (
          <MDBox mt={3}>
            <MDTypography variant="body2" fontStyle="italic">
              {stats.total} certificates issued. All certificates are stored on IPFS and verifiable
              on-chain.
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default withAuth(HackathonWinners, "participant");
