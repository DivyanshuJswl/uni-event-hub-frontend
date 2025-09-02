// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyParticipatedEvents() {
  const defaultEventImage =
    "https://res.cloudinary.com/dh5cebjwj/image/upload/v1750793771/samples/animals/kitten-playing.gif";
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "event", accessor: "event", width: "35%", align: "left" },
      { Header: "organizer", accessor: "organizer", width: "25%", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipatedEvents = async () => {
      try {
        const student = JSON.parse(localStorage.getItem("student"));
        const token = localStorage.getItem("token");

        if (!student?._id || !token) {
          throw new Error("Authentication data not found");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/events/students/${student._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const events = response.data.data?.events || [];
        const rows = events.map((event) => createEventRow(event));

        setTableData((prev) => ({ ...prev, rows }));
      } catch (error) {
        console.error("Error fetching events:", error);
        // Show error to user
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedEvents();
  }, []);

  // Function to create a table row from event data
  const createEventRow = (event) => {
    // Event component
    const Event = ({ image, name, description }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image || defaultEventImage} name={name} size="sm" variant="rounded" />
        <MDBox ml={2} lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Event.propTypes = {
      image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    };

    // Organizer component
    const Organizer = ({ name, email }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Organizer.propTypes = {
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    };

    // Action buttons component
    const ActionButtons = ({ eventId }) => (
      <MDBox display="flex" justifyContent="space-around">
        <Tooltip title="View Details" placement="top">
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={() => navigate(`/events/${eventId}`)}
          >
            <Icon>visibility</Icon>
          </MDButton>
        </Tooltip>
        <Tooltip title="Unenroll" placement="top">
          <MDButton
            variant="text"
            color="error"
            size="small"
            onClick={() => handleUnenroll(eventId)}
          >
            <Icon>delete</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
    );

    ActionButtons.propTypes = {
      eventId: PropTypes.string.isRequired,
    };

    // Determine status
    const getStatusBadge = () => {
      const now = new Date();
      const startDate = new Date(event.date);
      const endDate = new Date(event.date);

      if (event.status === "cancelled") {
        return <MDBadge badgeContent="cancelled" color="error" variant="gradient" size="sm" />;
      }

      if (now > endDate) {
        return <MDBadge badgeContent="completed" color="success" variant="gradient" size="sm" />;
      }

      if (now >= startDate && now <= endDate) {
        return <MDBadge badgeContent="ongoing" color="warning" variant="gradient" size="sm" />;
      }

      return <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />;
    };

    return {
      id: event._id,
      event: (
        <Event
          image={event.featuredImage?.url || event.images?.[0]?.url}
          name={event.title}
          description={event.description}
        />
      ),
      organizer: (
        <Organizer
          name={event.organizer?.name || "Unknown Organizer"}
          email={event.organizer?.email || "N/A"}
        />
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(event.date).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </MDTypography>
      ),
      status: <MDBox ml={-1}>{getStatusBadge()}</MDBox>,
      actions: <ActionButtons eventId={event._id} />,
    };
  };

  const handleUnenroll = async (eventId) => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student?._id) {
        throw new Error("Student data not found");
      }

      // Call API to unenroll
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/students/${student._id}/events/${eventId}`
      );

      // Update UI
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.filter((row) => row.id !== eventId),
      }));

      // Show success message
      alert("Successfully unenrolled from event");
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert("Failed to unenroll: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <MDBox pt={6} pb={3}>
        <MDTypography variant="body2" color="text">
          Loading your events...
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox pt={6} pb={3}>
      <MDBox mb={3}>
        <MDTypography variant="h3" textTransform="capitalize">
          My Participated Events
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Events you&apos;ve registered for
        </MDTypography>
      </MDBox>
      <MDBox>
        {tableData.rows.length > 0 ? (
          <DataTable
            table={tableData}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
            showTotalEntries={true}
            noEndBorder
            canSearch
          />
        ) : (
          <MDTypography variant="body2" color="text">
            You haven&apos;t enrolled in any events yet.
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}

export default MyParticipatedEvents;
