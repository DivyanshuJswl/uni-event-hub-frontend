import { Card, Typography, Button, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

const WelcomeBox = () => {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const navigate = useNavigate();

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
          // backgroundImage: "url(/path-to-your-image.png)", // Replace with your image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
        },
      }}
    >
      <MDBox sx={{ position: "relative", zIndex: 1 }}>
        <MDTypography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {localStorage.getItem("student") ? (
            <Box component="span">
              Welcome back,{" "}
              <Box
                component="span"
                sx={{
                  color: darkMode ? "#1A73E8" : "#1976D2",
                  fontWeight: "bold",
                }}
              >
                {JSON.parse(localStorage.getItem("student")).name}
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
          You have 3 upcoming events this week
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
          <MDButton
            component="a"
            target="_blank"
            rel="noreferrer"
            variant="gradient"
            color={sidenavColor}
            onClick={() => navigate("/my-events")}
          >
            Participated Events
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default WelcomeBox;
