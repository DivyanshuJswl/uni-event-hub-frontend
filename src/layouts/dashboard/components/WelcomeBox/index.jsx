import { Card, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

const WelcomeBox = () => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = localStorage.getItem("student") ? JSON.parse(localStorage.getItem("student")) : null;
  const userRole = localStorage.getItem("role");

  // Check if user is an organizer
  const isOrganizer = userRole === "organizer";
  const isParticipant = userRole === "participant";
  return (
    <Card
      sx={{
        p: 3,
        mb: 6,
        borderRadius: 4,
        background: darkMode
          ? { sidenavColor }
          : "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
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
      }}
    >
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
          ml={1}
          color={darkMode ? "white" : "text"}
          fontWeight="light"
          py={3}
        >
          {isOrganizer
            ? "Let's get started by exploring or creating events!"
            : "Let's get started by exploring events happening this week!"}
        </MDTypography>

        <MDBox mt={2} sx={{ display: "flex", gap: 2 }}>
          <MDButton
            variant="gradient"
            color={sidenavColor}
            size="medium"
            onClick={() => navigate("/explore")}
          >
            Browse Events
          </MDButton>

          {isOrganizer ? (
            <MDButton
              variant="gradient"
              color={sidenavColor}
              onClick={() => navigate("/create-event")}
            >
              Create Event
            </MDButton>
          ) : isParticipant ? (
            <MDButton
              variant="gradient"
              color={sidenavColor}
              onClick={() => navigate("/my-events")}
            >
              Participated Events
            </MDButton>
          ) : null}
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default WelcomeBox;
