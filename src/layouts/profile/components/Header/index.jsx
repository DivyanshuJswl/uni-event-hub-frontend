import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header({ name, avatar, children, onAvatarUpdate }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { role, becomeOrganizer, showToast, updateProfilePicture } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    if (role === "organizer") {
      setIsOrganizer(true);
    } else {
      setIsOrganizer(false);
    }

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation, role]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleAvatarClick = (event) => {
    setAvatarMenu(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenu(null);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
    handleAvatarMenuClose();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    setIsUploading(true);

    try {
      const result = await updateProfilePicture(file);

      if (result.success) {
        showToast("Profile picture updated successfully!", "success");
        if (onAvatarUpdate) {
          onAvatarUpdate(result.avatarUrl);
        }
      } else {
        showToast(result.message || "Failed to update profile picture", "error");
      }
    } catch (error) {
      showToast("An error occurred while uploading", "error");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleBecomeOrganizer = async () => {
    setIsLoading(true);
    const result = await becomeOrganizer();

    if (result.success) {
      showToast("You are now an organizer!", "success");
      setIsOrganizer(true);
    } else if (result.requiresLogin) {
      navigate("/authentication/sign-in");
    }
    setIsLoading(false);
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915286/bg-profile_lvutak.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDBox
              sx={{
                position: "relative",
                cursor: "pointer",
                "&:hover .camera-overlay": {
                  opacity: 1,
                },
              }}
              onClick={handleAvatarClick}
            >
              <MDAvatar
                src={
                  avatar ||
                  `https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915034/abstract-user-flat-4_liw6zf.png`
                }
                alt="profile-image"
                size="xl"
                shadow="sm"
              />
              <MDBox
                className="camera-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)", // Slightly lighter overlay
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  color: "white",
                }}
              >
                <Icon
                  sx={{
                    fontSize: "2rem",
                    color: "white", // Bright white color
                    filter: `
            drop-shadow(0 2px 2px rgba(0, 0, 0, 0.8)) 
            drop-shadow(0 4px 4px rgba(0, 0, 0, 0.6))
            drop-shadow(0 6px 6px rgba(0, 0, 0, 0.4))
          `, // Multiple shadows for depth
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.9)", // Additional text shadow
                  }}
                >
                  photo_camera
                </Icon>
              </MDBox>
              {isUploading && (
                <MDBox
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress color="inherit" size={32} sx={{ color: "white" }} />
                </MDBox>
              )}
            </MDBox>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            {/* Avatar menu */}
            <Menu
              anchorEl={avatarMenu}
              open={Boolean(avatarMenu)}
              onClose={handleAvatarMenuClose}
            >
              <MenuItem onClick={handleFileInputClick}>
                <Icon sx={{ mr: 1, color: "info.main" }}>photo_camera</Icon>
                <MDTypography variant="button" fontWeight="medium">
                  Upload Photo
                </MDTypography>
              </MenuItem>
              {avatar && (
                <MenuItem onClick={handleAvatarMenuClose}>
                  <Icon sx={{ mr: 1, color: "error.main" }}>delete</Icon>
                  <MDTypography variant="button" fontWeight="medium" color="error">
                    Remove Photo
                  </MDTypography>
                </MenuItem>
              )}
            </Menu>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5" fontWeight="medium">
                  {name}
                </MDTypography>
                {!isOrganizer ? (
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="small"
                    onClick={handleBecomeOrganizer}
                    startIcon={<Icon>event_available</Icon>}
                    sx={{ ml: 2 }}
                  >
                    {isLoading ? "Processing..." : "Become an Organizer"}
                  </MDButton>
                ) : (
                  <MDBox
                    display="flex"
                    alignItems="center"
                    bgcolor="success.main"
                    borderRadius="lg"
                    px={1.5}
                    py={0.5}
                    ml={2}
                  >
                    <Icon color="success" sx={{ fontSize: "1rem", mr: 0.5 }}>
                      verified
                    </Icon>
                    <MDTypography
                      varient="gradient"
                      color="white"
                      fontWeight="regular"
                      fontSize="0.875rem"
                    >
                      Organizer
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
  name: "Student Name",
  avatar: "",
  onAvatarUpdate: null,
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  avatar: PropTypes.string,
  onAvatarUpdate: PropTypes.func,
};

export default Header;
