import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";
import { InsertDriveFile, Download } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

const GoogleFormData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vite environment variable - must be prefixed with VITE_
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
        const response = await axios.get(url);
        if (response.data?.values) {
          setData(response.data.values);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Alert severity="error" sx={{ mb: 3, color: "white" }}>
          <AlertTitle sx={{ color: "white" }}>Error</AlertTitle>
          {error}
        </Alert>
        {!apiKey && (
          <Alert severity="warning" sx={{ color: "white" }}>
            Please ensure you have a .env file with VITE_GOOGLE_API_KEY set. Create a .env file in
            your project root with:
            <pre style={{ color: "white" }}>abc</pre>
          </Alert>
        )}
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
          No Data Available
        </Typography>
        <Typography sx={{ color: "white" }}>
          The Google Sheet is empty or couldnt be loaded.
        </Typography>
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar absolute />

      <Box sx={{ maxWidth: "100%", overflow: "auto", p: 3, mt: 5, bgcolor: "white" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: "white" }}>
          Form Responses
        </Typography>

        <TableContainer component={Paper} elevation={3} sx={{ mb: 3, backgroundColor: "white" }}>
          <Table sx={{ minWidth: 650 }} aria-label="form responses table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "white" }}>
                {data[0].map((header, index) => (
                  <TableCell key={index} sx={{ color: "white", fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex} sx={{ backgroundColor: "white" }}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} sx={{ color: "white" }}>
                      {typeof cell === "string" && cell.startsWith("https://drive.google.com") ? (
                        <MDBox sx={{ display: "flex", gap: 1 }}>
                          <MDButton
                            variant="outlined"
                            size="small"
                            startIcon={<InsertDriveFile />}
                            href={cell}
                            target="_blank"
                            rel="noopener"
                            color="white"
                            sx={{ color: "white", borderColor: "primary.main" }}
                          >
                            View
                          </MDButton>
                          <MDButton
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<Download />}
                            href={cell.replace("view", "uc?export=download")}
                            download
                          >
                            Download
                          </MDButton>
                        </MDBox>
                      ) : (
                        cell || "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};

export default GoogleFormData;
