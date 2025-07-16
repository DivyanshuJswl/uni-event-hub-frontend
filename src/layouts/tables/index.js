// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Custom components
import CreateEvent from "./createEvent";
import { Alert } from "@mui/material";

// Data fetching
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

function Tables() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const stu = localStorage.getItem("student");
  const name = JSON.parse(stu).name;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEvents(res?.data?.data?.events || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Format events for the upcoming events table
  const upcomingEventsColumns = [
    { Header: "event", accessor: "event", align: "left" },
    { Header: "date", accessor: "date", align: "center" },
    { Header: "location", accessor: "location", align: "center" },
    { Header: "organizer", accessor: "organizer", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const upcomingEventsRows = events
    .filter((event) => event.status === "upcoming")
    .map((event) => ({
      event: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="button" fontWeight="medium">
            {event.title}
          </MDTypography>
          <MDTypography variant="caption">
            {event.description.length > 30
              ? `${event.description.substring(0, 30)}...`
              : event.description}
          </MDTypography>
        </MDBox>
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {dayjs(event.date).format("DD MMM YYYY")}
        </MDTypography>
      ),
      location: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {event.location}
        </MDTypography>
      ),
      organizer: (
        <MDBox lineHeight={1} ml={-1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {event.organizer?.name || "Unknown"}
          </MDTypography>
          <MDTypography variant="caption">{event.organizer?.email || "Unknown"}</MDTypography>
        </MDBox>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Details
        </MDTypography>
      ),
    }));

  // Format events for the organized events table
  const organizedEventsColumns = [
    { Header: "event", accessor: "event", width: "30%", align: "left" },
    { Header: "date", accessor: "date", align: "center" },
    { Header: "participants", accessor: "participants", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const organizedEventsRows = events
    .filter((event) => event.organizer?.name === name)
    .map((event) => ({
      event: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="button" fontWeight="medium">
            {event.title}
          </MDTypography>
          <MDTypography variant="caption">{event.category}</MDTypography>
        </MDBox>
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {dayjs(event.date).format("DD MMM YYYY")}
        </MDTypography>
      ),
      participants: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {event.participants?.length || 0}/{event.maxParticipants}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={event.status}
            color={
              event.status === "upcoming"
                ? "info"
                : event.status === "completed"
                ? "success"
                : event.status === "cancelled"
                ? "error"
                : "secondary"
            }
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Details
        </MDTypography>
      ),
    }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {true ? (
        <CreateEvent />
      ) : (
        <Alert severity="error">You do not have permission to create events.</Alert>
      )}
      <MDBox pt={6} pb={3}>
        {loading ? (
          <MDBox display="flex" justifyContent="center" pt={4}>
            <MDTypography variant="body2">Loading events...</MDTypography>
          </MDBox>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Upcoming Events ({upcomingEventsRows.length})
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: upcomingEventsColumns, rows: upcomingEventsRows }}
                    isSorted={true}
                    entriesPerPage={false}
                    showTotalEntries={true}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Organized Events ({organizedEventsRows.length})
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: organizedEventsColumns, rows: organizedEventsRows }}
                    isSorted={true}
                    entriesPerPage={false}
                    showTotalEntries={true}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
