import { useMemo, useCallback } from "react";
import { Card, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const WelcomeBox = () => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Check user role
  const isOrganizer = role === "organizer";
  const isParticipant = role === "participant";

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      p: 3,
      mb: 6,
      borderRadius: 4,
      background: darkMode ? { sidenavColor } : "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
      position: "relative",
      overflow: "hidden",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "40%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.1,
      },
    }),
    [darkMode]
  );

  // Memoized navigation handlers
  const handleBrowseEvents = useCallback(() => {
    navigate("/explore");
  }, [navigate]);

  const handleCreateEvent = useCallback(() => {
    navigate("/create-event");
  }, [navigate]);

  const handleMyEvents = useCallback(() => {
    navigate("/my-events");
  }, [navigate]);

  // Memoized welcome message
  const welcomeMessage = useMemo(() => {
    if (isOrganizer) {
      return "Let's get started by exploring or creating events!";
    }
    return "Let's get started by exploring events happening this week!";
  }, [isOrganizer]);

  return (
    <Card sx={cardStyles}>
      <MDBox sx={{ position: "relative", zIndex: 1 }}>
        <MDTypography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {user ? (
            <Box component="span">
              Welcome back,{" "}
              <Box
                component="span"
                sx={{
                  color: darkMode ? "#1A73E8" : "#1976D2",
                  fontWeight: "bold",
                }}
              >
                {user.name}
              </Box>
            </Box>
          ) : (
            "Welcome"
          )}
        </MDTypography>

        <MDTypography
          variant="button"
          color={darkMode ? "white" : "text"}
          fontWeight="light"
          sx={{ display: "block" }}
        >
          {welcomeMessage}
        </MDTypography>

        <MDBox mt={2} sx={{ display: "flex", gap: 2 }}>
          <MDButton
            variant="gradient"
            color={sidenavColor}
            size="medium"
            onClick={handleBrowseEvents}
          >
            Browse Events
          </MDButton>

          {isOrganizer && (
            <MDButton
              variant="gradient"
              color={sidenavColor}
              size="medium"
              onClick={handleCreateEvent}
            >
              Create Event
            </MDButton>
          )}

          {isParticipant && (
            <MDButton
              variant="gradient"
              color={sidenavColor}
              size="medium"
              onClick={handleMyEvents}
            >
              Participated Events
            </MDButton>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default WelcomeBox;
