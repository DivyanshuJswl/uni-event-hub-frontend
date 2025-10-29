import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import { Alert, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useAuth, withRole } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import CreateEvent from "./component";
import { useMaterialUIController } from "context";
import axios from "axios";
import dayjs from "dayjs";

// Memoized DataTable Skeleton Component
const DataTableSkeleton = ({ columns, rowCount = 5, darkMode }) => {
  const skeletonBg = darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const borderColor = darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

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
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <MDBox display="flex" alignItems="center" gap={1}>
          <Skeleton variant="rounded" width={80} height={40} sx={{ bgcolor: skeletonBg }} />
          <Skeleton variant="text" width={120} height={25} sx={{ bgcolor: skeletonBg }} />
        </MDBox>
        <Skeleton variant="rounded" width={200} height={40} sx={{ bgcolor: skeletonBg }} />
      </MDBox>

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
                bgcolor: skeletonBg,
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
              borderBottom: rowIndex < rowCount - 1 ? `1px solid ${borderColor}` : "none",
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
                    sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" }}
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
  );
};

function CreateEventPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user, token } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Consolidated state
  const [pageState, setPageState] = useState({
    events: [],
    loading: true,
    error: null,
  });

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setPageState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setPageState({
        events: res?.data?.data?.events || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch events";
      setPageState({
        events: [],
        loading: false,
        error: errorMessage,
      });
      showToast(errorMessage, "error", "Failed to Load Events");
    }
  }, [BASE_URL, token, showToast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Navigate to event details
  const handleViewEvent = useCallback(
    (eventId) => {
      navigate(`/events/${eventId}`);
    },
    [navigate]
  );

  // Table columns definitions
  const upcomingEventsColumns = useMemo(
    () => [
      { Header: "event", accessor: "event", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "location", accessor: "location", align: "center" },
      { Header: "organizer", accessor: "organizer", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    []
  );

  const organizedEventsColumns = useMemo(
    () => [
      { Header: "event", accessor: "event", width: "30%", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "participants", accessor: "participants", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    []
  );

  // Upcoming events rows
  const upcomingEventsRows = useMemo(() => {
    return pageState.events
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
          <IconButton
            size="small"
            onClick={() => handleViewEvent(event._id)}
            sx={{ color: "text.main" }}
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
  }, [pageState.events, handleViewEvent]);

  // Organized events rows
  const organizedEventsRows = useMemo(() => {
    return pageState.events
      .filter((event) => event.organizer?.name === user.name)
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
          <IconButton
            size="small"
            onClick={() => handleViewEvent(event._id)}
            sx={{ color: "text.main" }}
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
  }, [pageState.events, user.name, handleViewEvent]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CreateEvent onEventCreated={fetchEvents} />
      <MDBox pt={6} pb={3}>
        {pageState.loading ? (
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
        ) : pageState.error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {pageState.error}
          </Alert>
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

export default withRole(CreateEventPage, "organizer");
