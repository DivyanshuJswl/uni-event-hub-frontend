// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useAuth, withRole } from "context/AuthContext";
// Custom components
import CreateEvent from "./component";
import { Alert, IconButton } from "@mui/material";
import { useMaterialUIController } from "context";

// Data fetching
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Visibility } from "@mui/icons-material";

// DataTable Skeleton Component
function DataTableSkeleton({ columns, rowCount = 5, darkMode }) {
  return (
    <MDBox>
      {/* Table Header Skeleton */}
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <MDBox display="flex" alignItems="center" gap={1}>
          <Skeleton
            variant="rounded"
            width={80}
            height={40}
            sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
          />
          <Skeleton
            variant="text"
            width={120}
            height={25}
            sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
          />
        </MDBox>
        <Skeleton
          variant="rounded"
          width={200}
          height={40}
          sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
        />
      </MDBox>

      {/* Table Container */}
      <MDBox
        sx={{
          overflow: "hidden",
        }}
      >
        {/* Table Head Skeleton */}
        <MDBox
          display="flex"
          sx={{
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            px: 2,
            py: 1.5,
          }}
        >
          {columns.map((column, index) => (
            <MDBox
              key={index}
              flex={`0 0 ${100 / columns.length}%`}
              textAlign={column.align || "left"}
            >
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                sx={{
                  mx: column.align === "center" ? "auto" : "inherit",
                  ml: column.align === "right" ? "auto" : "inherit",
                  mr: column.align === "left" ? "auto" : "inherit",
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                }}
              />
            </MDBox>
          ))}
        </MDBox>

        {/* Table Body Skeleton */}
        <MDBox>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <MDBox
              key={rowIndex}
              display="flex"
              sx={{
                px: 2,
                py: 1.5,
                borderBottom:
                  rowIndex < rowCount - 1
                    ? darkMode
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(0, 0, 0, 0.08)"
                    : "none",
              }}
            >
              {columns.map((column, colIndex) => (
                <MDBox
                  key={colIndex}
                  flex={`0 0 ${100 / columns.length}%`}
                  textAlign={column.align || "left"}
                >
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems={
                      column.align === "center"
                        ? "center"
                        : column.align === "right"
                          ? "flex-end"
                          : "flex-start"
                    }
                    gap={0.5}
                  >
                    <Skeleton
                      variant="text"
                      width={colIndex === 0 ? "90%" : "70%"}
                      height={16}
                      sx={{
                        bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                      }}
                    />
                    {colIndex === 0 && (
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={12}
                        sx={{
                          bgcolor: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
                        }}
                      />
                    )}
                  </MDBox>
                </MDBox>
              ))}
            </MDBox>
          ))}
        </MDBox>
      </MDBox>

      {/* Table Footer Skeleton */}
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
          borderTop: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Skeleton
          variant="text"
          width={150}
          height={20}
          sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
        />
        <MDBox display="flex" gap={1}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={32}
              height={32}
              sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
            />
          ))}
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

function createEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user, token } = useAuth();
  const name = user.name;
  const navigate = useNavigate();

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

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
          <MDTypography display="block" variant="button" fontWeight="medium" component="div">
            {event.title}
          </MDTypography>
          <MDTypography variant="caption" component="div">
            {event.description.length > 30
              ? `${event.description.substring(0, 30)}...`
              : event.description}
          </MDTypography>
        </MDBox>
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium" component="div">
          {dayjs(event.date).format("DD MMM YYYY")}
        </MDTypography>
      ),
      location: (
        <MDTypography variant="caption" color="text" fontWeight="medium" component="div">
          {event.location}
        </MDTypography>
      ),
      organizer: (
        <MDBox lineHeight={1} ml={-1}>
          <MDTypography display="block" variant="button" fontWeight="medium" component="div">
            {event.organizer?.name || "Unknown"}
          </MDTypography>
          <MDTypography variant="caption" component="div">
            {event.organizer?.email || "Unknown"}
          </MDTypography>
        </MDBox>
      ),
      action: (
        <IconButton
          size="small"
          onClick={() => handleViewEvent(event._id)}
          sx={{
            color: "text.main",
          }}
        >
          <MDTypography
            component="span"
            variant="caption"
            color="text"
            fontWeight="medium"
            sx={{ mr: 0.5 }}
          >
            Details
          </MDTypography>
        </IconButton>
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
          <MDTypography display="block" variant="button" fontWeight="medium" component="div">
            {event.title}
          </MDTypography>
          <MDTypography variant="caption" component="div">
            {event.category}
          </MDTypography>
        </MDBox>
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium" component="div">
          {dayjs(event.date).format("DD MMM YYYY")}
        </MDTypography>
      ),
      participants: (
        <MDTypography variant="caption" color="text" fontWeight="medium" component="div">
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
        <IconButton
          size="small"
          onClick={() => handleViewEvent(event._id)}
          sx={{
            color: "text.main",
          }}
        >
          <MDTypography
            component="span"
            variant="caption"
            color="text"
            fontWeight="medium"
            sx={{ mr: 0.5 }}
          >
            Details
          </MDTypography>
        </IconButton>
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
          <Grid container spacing={6}>
            {/* Upcoming Events Skeleton */}
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
                    Upcoming Events
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTableSkeleton
                    columns={upcomingEventsColumns}
                    rowCount={4}
                    darkMode={darkMode}
                  />
                </MDBox>
              </Card>
            </Grid>

            {/* Organized Events Skeleton */}
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
                    Organized Events
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTableSkeleton
                    columns={organizedEventsColumns}
                    rowCount={3}
                    darkMode={darkMode}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
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

export default withRole(createEvent, "organizer");
