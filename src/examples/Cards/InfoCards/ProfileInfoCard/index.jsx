import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { useAuth } from "context/AuthContext";

const modalStyle = (darkMode) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 500,
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: darkMode ? "background.default" : "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
});

// Constants for validation
const ALLOWED_BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT"];
const MIN_YEAR = 1;
const MAX_YEAR = 5;

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateYear = (year) => {
  return year >= MIN_YEAR && year <= MAX_YEAR;
};

const validateBranch = (branch) => {
  return ALLOWED_BRANCHES.includes(branch.toUpperCase());
};

const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

// Function to format user data for display
const formatUserData = (user) => {
  if (!user) return {};

  return {
    name: user.name || "",
    year: user.year || "",
    email: user.email || "",
    branch: user.branch || "",
    metaMaskAddress: user.metaMaskAddress || "Not linked",
    role: user.role || "Not set",
    isVerified: user.isVerified ? "Verified" : "Not Verified",
  };
};

function ProfileInfoCard({ title, description, social, action, shadow, darkMode }) {
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Use API context for making API calls
  const { updateProfile, user } = useAuth();

  // Format user data for display
  const userInfo = formatUserData(user);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    year: "",
    branch: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  // Reset form when modal opens or when user data changes
  useEffect(() => {
    const formattedUserData = formatUserData(user);
    setEditForm({
      name: formattedUserData.name,
      email: formattedUserData.email,
      year: formattedUserData.year,
      branch: formattedUserData.branch,
    });
  }, [user, editModalOpen]);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
    setEditErrors({});
    setEditMessage({ type: "", text: "" });
    if (action && action.onClick) {
      action.onClick();
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditErrors({});
    setEditMessage({ type: "", text: "" });
  };

  const validateEditField = (field, value) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value.trim())) return "Please enter a valid email address";
        return "";

      case "name":
        if (!value.trim()) return "Name is required";
        if (!validateName(value.trim())) return "Name must be between 2 and 50 characters";
        return "";

      case "year":
        if (!value) return "Year is required";
        const yearNum = parseInt(value);
        if (isNaN(yearNum)) return "Year must be a number";
        if (!validateYear(yearNum)) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
        return "";

      case "branch":
        if (!value) return "Branch is required";
        if (!validateBranch(value)) return `Branch must be one of: ${ALLOWED_BRANCHES.join(", ")}`;
        return "";

      default:
        return "";
    }
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const hasChanges = () => {
    const currentData = formatUserData(user);
    return Object.keys(editForm).some((key) => {
      const currentVal = currentData[key];
      const newVal = editForm[key];

      if (typeof currentVal === "number" || typeof newVal === "number") {
        return Number(currentVal) !== Number(newVal);
      }
      return currentVal !== newVal;
    });
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(editForm).forEach((field) => {
      const error = validateEditField(field, editForm[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      setEditMessage({ type: "error", text: "Please fix the errors before submitting" });
      return;
    }

    if (!hasChanges()) {
      setEditMessage({ type: "info", text: "No changes detected" });
      return;
    }

    setEditLoading(true);
    setEditMessage({ type: "", text: "" });

    try {
      // Prepare data for API call - only include fields that have changed
      const updateData = {};
      Object.keys(editForm).forEach((key) => {
        const currentVal = formatUserData(user)[key];
        const newVal = editForm[key];

        if (currentVal !== newVal) {
          updateData[key] = key === "year" ? parseInt(newVal) : newVal;
        }
      });

      const response = await updateProfile(updateData);

      if (response.success) {
        setEditMessage({ type: "success", text: "Profile updated successfully!" });

        // Close modal after successful update
        setTimeout(() => {
          handleCloseEditModal();
          // Refresh parent component data
          if (action && action.onRefresh) {
            action.onRefresh();
          }
        }, 1500);
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      setEditMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Format specific fields with special display logic
  const formatValue = (key, value) => {
    switch (key) {
      case "metaMaskAddress":
        return value && value !== "Not linked" ? (
          <Tooltip title={value} placement="top">
            <Chip
              label={`${value.substring(0, 4)}...${value.substring(value.length - 4)}`}
              size="small"
            />
          </Tooltip>
        ) : (
          "Not linked"
        );
      case "role":
        return (
          <Chip
            label={value}
            color={value === "admin" ? "error" : value === "organizer" ? "warning" : "success"}
            size="small"
          />
        );
      case "isVerified":
        return (
          <Chip label={value} color={value === "Verified" ? "success" : "error"} size="small" />
        );
      default:
        return value || "Not set";
    }
  };

  // Prepare the info items for rendering - only show the filtered fields
  const renderItems = Object.entries(userInfo).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    const formattedValue = formatValue(key, value);

    if (formattedValue === undefined || formattedValue === "" || formattedKey === "Name")
      return null;

    return (
      <MDBox key={key} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {formattedKey}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          {formattedValue}
        </MDTypography>
      </MDBox>
    );
  });

  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  // Render Edit Profile Modal following the same pattern as OrganizerEventCard
  const renderEditProfileModal = () => (
    <Modal
      open={editModalOpen}
      onClose={handleCloseEditModal}
      aria-labelledby="edit-profile-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
    >
      <Fade in={editModalOpen}>
        <Box sx={modalStyle(darkMode)}>
          {/* Header */}
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
            py={2}
            sx={{
              background: "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "white" }}>edit</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Edit Profile
              </MDTypography>
            </MDBox>
            <IconButton onClick={handleCloseEditModal} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>

          {/* Content */}
          <MDBox px={4} py={3}>
            {editMessage.text && (
              <Alert severity={editMessage.type || "info"} sx={{ mb: 2 }}>
                {editMessage.text}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Full Name
                  </MDTypography>
                  <MDInput
                    value={editForm.name}
                    onChange={(e) => handleEditFieldChange("name", e.target.value)}
                    error={!!editErrors.name}
                    helperText={editErrors.name}
                    fullWidth
                    placeholder="Enter your full name"
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Email Address
                  </MDTypography>
                  <MDInput
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditFieldChange("email", e.target.value)}
                    error={!!editErrors.email}
                    helperText={editErrors.email}
                    fullWidth
                    placeholder="Enter your email address"
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Academic Year
                  </MDTypography>
                  <FormControl fullWidth error={!!editErrors.year}>
                    <Select
                      value={editForm.year}
                      onChange={(e) => handleEditFieldChange("year", e.target.value)}
                      displayEmpty
                      sx={{ height: "2.75rem" }}
                    >
                      <MenuItem value="">Select year</MenuItem>
                      {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i).map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            Year {year}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {editErrors.year && (
                      <MDTypography variant="caption" color="error">
                        {editErrors.year}
                      </MDTypography>
                    )}
                  </FormControl>
                </MDBox>
              </Grid>

              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Branch
                  </MDTypography>
                  <FormControl fullWidth error={!!editErrors.branch}>
                    <Select
                      value={editForm.branch}
                      onChange={(e) => handleEditFieldChange("branch", e.target.value)}
                      displayEmpty
                      sx={{ height: "2.75rem" }}
                    >
                      <MenuItem value="">Select branch</MenuItem>
                      {ALLOWED_BRANCHES.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                    {editErrors.branch && (
                      <MDTypography variant="caption" color="error">
                        {editErrors.branch}
                      </MDTypography>
                    )}
                  </FormControl>
                </MDBox>
              </Grid>
            </Grid>

            <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={handleCloseEditModal}
                disabled={editLoading}
              >
                Cancel
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleSubmit}
                disabled={editLoading || !hasChanges()}
                startIcon={editLoading ? <CircularProgress size={16} /> : null}
              >
                {editLoading ? "Updating..." : "Update Profile"}
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );

  return (
    <>
      <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
          {action && (
            <MDTypography
              component="span"
              variant="body2"
              color="secondary"
              onClick={handleOpenEditModal}
              style={{ cursor: "pointer" }}
            >
              <Tooltip title={action.tooltip} placement="top">
                <Icon>edit</Icon>
              </Tooltip>
            </MDTypography>
          )}
        </MDBox>
        <MDBox p={2}>
          <MDBox mb={2} lineHeight={1}>
            <MDTypography variant="button" color="text" fontWeight="light">
              {description}
            </MDTypography>
          </MDBox>
          <MDBox opacity={0.3}>
            <Divider />
          </MDBox>
          <MDBox>
            {renderItems}
            {social.length > 0 && (
              <>
                <MDBox opacity={0.3}>
                  <Divider />
                </MDBox>
                <MDBox display="flex" py={1} pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    Social: &nbsp;
                  </MDTypography>
                  {renderSocial}
                </MDBox>
              </>
            )}
          </MDBox>
        </MDBox>
      </Card>

      {/* Render Edit Profile Modal */}
      {renderEditProfileModal()}
    </>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  action: null,
  social: [],
  title: "",
  description: "",
  darkMode: false,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      icon: PropTypes.node,
      color: PropTypes.oneOf([
        "facebook",
        "twitter",
        "instagram",
        "linkedin",
        "pinterest",
        "youtube",
        "github",
      ]),
    })
  ),
  action: PropTypes.shape({
    route: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    onRefresh: PropTypes.func,
  }),
  shadow: PropTypes.bool,
  darkMode: PropTypes.bool,
};

export default ProfileInfoCard;
