import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import breakpoints from "assets/theme/base/breakpoints";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import ImageCropper from "./ImageCropper";
import PreviewModal from "./PreviewModal";

function Header({ name = "Student name", avatar = "", children = "", onAvatarUpdate = null }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { role, becomeOrganizer, updateProfilePicture, deleteProfilePicture } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Consolidated state
  const [headerState, setHeaderState] = useState({
    tabsOrientation: "horizontal",
    tabValue: 0,
    isOrganizer: false,
    avatarMenu: null,
    isUploading: false,
    isLoading: false,
    previewModalOpen: false,
    cropModalOpen: false,
    selectedImage: null,
  });

  // Handle tabs orientation
  useEffect(() => {
    const handleTabsOrientation = () => {
      setHeaderState((prev) => ({
        ...prev,
        tabsOrientation: window.innerWidth < breakpoints.values.sm ? "vertical" : "horizontal",
      }));
    };

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, []);

  // Handle organizer status
  useEffect(() => {
    setHeaderState((prev) => ({ ...prev, isOrganizer: role === "organizer" }));
  }, [role]);

  // Memoized handlers
  const handleSetTabValue = useCallback((_, newValue) => {
    setHeaderState((prev) => ({ ...prev, tabValue: newValue }));
  }, []);

  const handleAvatarClick = useCallback((event) => {
    setHeaderState((prev) => ({ ...prev, avatarMenu: event.currentTarget }));
  }, []);

  const handleAvatarMenuClose = useCallback(() => {
    setHeaderState((prev) => ({ ...prev, avatarMenu: null }));
  }, []);

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
    handleAvatarMenuClose();
  }, [handleAvatarMenuClose]);

  const handlePreviewClick = useCallback(() => {
    setHeaderState((prev) => ({ ...prev, previewModalOpen: true, avatarMenu: null }));
  }, []);

  const handleFileSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error", "Invalid File");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error", "File Too Large");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderState((prev) => ({
          ...prev,
          selectedImage: e.target.result,
          cropModalOpen: true,
        }));
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  const handleCropComplete = useCallback(
    async (croppedImageBlob) => {
      setHeaderState((prev) => ({ ...prev, isUploading: true }));

      try {
        const result = await updateProfilePicture(croppedImageBlob);

        if (result.success) {
          showToast("Profile picture updated successfully!", "success", "Upload Complete");
          if (onAvatarUpdate) {
            onAvatarUpdate(result.avatarUrl);
          }
        } else {
          showToast(result.message || "Failed to update profile picture", "error", "Upload Failed");
        }
      } catch (error) {
        showToast("An error occurred while uploading", "error", "Upload Failed");
        console.error("Upload error:", error);
      } finally {
        setHeaderState((prev) => ({
          ...prev,
          isUploading: false,
          cropModalOpen: false,
          selectedImage: null,
        }));
      }
    },
    [updateProfilePicture, showToast, onAvatarUpdate]
  );

  const handleDeletePhoto = useCallback(async () => {
    setHeaderState((prev) => ({ ...prev, isUploading: true, avatarMenu: null }));

    try {
      const result = await deleteProfilePicture();

      if (result.success) {
        showToast("Profile picture removed successfully!", "success", "Photo Removed");
        if (onAvatarUpdate) {
          onAvatarUpdate(null);
        }
      } else {
        showToast(result.message || "Failed to remove profile picture", "error", "Removal Failed");
      }
    } catch (error) {
      showToast("An error occurred while removing photo", "error", "Removal Failed");
      console.error("Delete error:", error);
    } finally {
      setHeaderState((prev) => ({ ...prev, isUploading: false }));
    }
  }, [deleteProfilePicture, showToast, onAvatarUpdate]);

  const handleBecomeOrganizer = useCallback(async () => {
    setHeaderState((prev) => ({ ...prev, isLoading: true }));

    const result = await becomeOrganizer();

    if (result.success) {
      showToast("You are now an organizer!", "success", "Role Updated");
      setHeaderState((prev) => ({ ...prev, isOrganizer: true, isLoading: false }));
    } else if (result.requiresLogin) {
      navigate("/authentication/sign-in");
    } else {
      setHeaderState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [becomeOrganizer, showToast, navigate]);

  // Memoized default avatar
  const defaultAvatar = useMemo(
    () =>
      "https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915034/abstract-user-flat-4_liw6zf.png",
    []
  );

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
      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDBox
              sx={{
                position: "relative",
                cursor: "pointer",
                "&:hover .camera-overlay": { opacity: 1 },
              }}
              onClick={handleAvatarClick}
            >
              <MDAvatar src={avatar || defaultAvatar} alt="profile-image" size="xl" shadow="sm" />
              <MDBox
                className="camera-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Icon
                  sx={{
                    fontSize: "2rem",
                    color: "white",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))",
                  }}
                >
                  photo_camera
                </Icon>
              </MDBox>
              {headerState.isUploading && (
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
                  <CircularProgress
                    color="inherit"
                    size={32}
                    variant="indeterminate"
                    sx={{ color: "white" }}
                  />
                </MDBox>
              )}
            </MDBox>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: "none" }}
            />

            <Menu
              anchorEl={headerState.avatarMenu}
              open={Boolean(headerState.avatarMenu)}
              onClose={handleAvatarMenuClose}
            >
              <MenuItem onClick={handleFileInputClick}>
                <Icon sx={{ mr: 1, color: "info.main" }}>photo_camera</Icon>
                <MDTypography variant="button" fontWeight="medium">
                  Upload Photo
                </MDTypography>
              </MenuItem>
              {avatar && (
                <>
                  <MenuItem onClick={handlePreviewClick}>
                    <Icon sx={{ mr: 1, color: "info.main" }}>visibility</Icon>
                    <MDTypography variant="button" fontWeight="medium">
                      Preview Photo
                    </MDTypography>
                  </MenuItem>
                  <MenuItem onClick={handleDeletePhoto}>
                    <Icon sx={{ mr: 1, color: "error.main" }}>delete</Icon>
                    <MDTypography variant="button" fontWeight="medium" color="error">
                      Remove Photo
                    </MDTypography>
                  </MenuItem>
                </>
              )}
            </Menu>

            <PreviewModal
              open={headerState.previewModalOpen}
              onClose={() => setHeaderState((prev) => ({ ...prev, previewModalOpen: false }))}
              avatar={avatar}
            />

            <ImageCropper
              open={headerState.cropModalOpen}
              imageSrc={headerState.selectedImage}
              onClose={() =>
                setHeaderState((prev) => ({ ...prev, cropModalOpen: false, selectedImage: null }))
              }
              onCropComplete={handleCropComplete}
              aspect={1}
              isUploading={headerState.isUploading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5" fontWeight="medium">
                  {name}
                </MDTypography>
                {!headerState.isOrganizer ? (
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="small"
                    onClick={handleBecomeOrganizer}
                    startIcon={<Icon>event_available</Icon>}
                    sx={{ ml: 2 }}
                  >
                    {headerState.isLoading ? "Processing..." : "Become Organizer"}
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
                    <MDTypography variant="gradient" fontWeight="regular" fontSize="0.875rem">
                      Organizer
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={headerState.tabsOrientation}
                value={headerState.tabValue}
                onChange={handleSetTabValue}
              >
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

Header.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  avatar: PropTypes.string,
  onAvatarUpdate: PropTypes.func,
};

export default memo(Header);
