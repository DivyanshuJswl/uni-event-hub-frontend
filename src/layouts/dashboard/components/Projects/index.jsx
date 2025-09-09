// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCalendar from "components/MDCalendar";

// Axios for API calls
import axios from "axios";
import { useState, useEffect } from "react";

function Projects() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/events?status=upcoming`
        );
        setEvents(response.data.data?.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <MDBox
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <MDCalendar color="success" events={events} loading={loading} />
    </MDBox>
  );
}

export default Projects;
