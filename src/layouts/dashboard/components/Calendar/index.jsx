import { useState, useEffect, useCallback, useMemo } from "react";
import MDBox from "components/MDBox";
import MDCalendar from "components/MDCalendar";
import { useNotifications } from "context/NotifiContext";
import axios from "axios";

function Projects() {
  const { showToast } = useNotifications();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Consolidated state
  const [calendarState, setCalendarState] = useState({
    events: [],
    loading: true,
    error: null,
  });

  // Memoized fetch function
  const fetchEvents = useCallback(async () => {
    setCalendarState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(`${BASE_URL}/api/events?status=upcoming`, {
        timeout: 10000, // 10 second timeout
      });

      const fetchedEvents = response.data.data?.events || [];

      setCalendarState({
        events: fetchedEvents,
        loading: false,
        error: null,
      });

      if (fetchedEvents.length === 0) {
        showToast("No upcoming events found", "info", "Calendar Updated");
      }
    } catch (error) {
      console.error("Error fetching events:", error);

      const errorMessage =
        error.response?.data?.message || error.code === "ECONNABORTED"
          ? "Request timeout - Please try again"
          : "Failed to load events";

      setCalendarState({
        events: [],
        loading: false,
        error: errorMessage,
      });

      showToast(errorMessage, "error", "Failed to Load Events");
    }
  }, [BASE_URL, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoized container styles
  const containerStyles = useMemo(
    () => ({
      width: "100%",
      maxWidth: "100%",
      display: "flex",
      justifyContent: "center",
      minHeight: "20rem",
    }),
    []
  );

  return (
    <MDBox sx={containerStyles}>
      <MDCalendar
        events={calendarState.events}
        loading={calendarState.loading}
        error={calendarState.error}
        onRetry={fetchEvents}
      />
    </MDBox>
  );
}

export default Projects;
