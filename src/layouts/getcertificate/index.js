import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
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

// Reusable components
function LoadingIndicator() {
  return (
    <MDBox display="flex" justifyContent="center" mt={4}>
      <CircularProgress sx={{ color: "white" }} />
    </MDBox>
  );
}

function ErrorDisplay({ error, apiKey }) {
  return (
    <MDBox mx="auto" p={3} maxWidth="800px">
      <MDAlert color="error" mb={3}>
        <MDTypography variant="h6" color="white">
          Error
        </MDTypography>
        {error}
      </MDAlert>
      {!apiKey && (
        <MDAlert color="warning">
          <MDTypography variant="body2" color="white">
            Please ensure you have a .env file with VITE_GOOGLE_API_KEY set.
          </MDTypography>
        </MDAlert>
      )}
    </MDBox>
  );
}

ErrorDisplay.propTypes = {
  error: PropTypes.string.isRequired,
  apiKey: PropTypes.string,
};

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "AIzaSyBbnjxZ4ow31wroa_CpwN-EIZM_vU9fxzk";
  const sheetId = "1z01tSHzfTOXxTTL888LxbmOFhGUJWQmcDbjFfxclwUA";
  const range = "Form Responses 1";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  useEffect(() => {
    if (!apiKey) {
      setError("Google API key is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Actual API call would look like:
        const response = await axios.get(url);
        if (response.data?.values) {
          const [headers, ...rows] = response.data.values;
          const formattedData = rows.map((row) => ({
            timestamp: row[0],
            name: row[3],
            metamaskId: row[2],
            certificateId: row[4] || "N/A",
          }));
          setData(formattedData);
        } else {
          setError("No data found in the sheet");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, apiKey]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay error={error} apiKey={apiKey} />;
  if (data.length === 0) return <EmptyState />;

  return (
    <DashboardLayout>
      <DashboardNavbar absolute />
      <MDBox mx={3} mt={5}>
        <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h4" mt={1}>
            Hackathon Winners
          </MDTypography>
          <MDButton mt={2} variant="gradient" color="success" startIcon={<Verified />} size="small">
            Verify All
          </MDButton>
        </MDBox>
        <MDBox mb={3} display="flex">
          <HackathonTable data={data} />
        </MDBox>
        <MDBox mt={3}>
          <MDTypography variant="body2" fontStyle="italic">
            {data.length} certificates issued. All certificates are stored on IPFS and verifiable
            on-chain.
          </MDTypography>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default HackathonWinners;
