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
  minWidth: 400,
  maxWidth: "90vw",
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
    name: user.name || "Not set",
    year: user.year || "Not set",
    email: user.email || "Not set",
    branch: user.branch || "Not set",
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
  const [formData, setFormData] = useState({ ...userInfo });
  const [originalData, setOriginalData] = useState({ ...userInfo });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Reset form when modal opens/closes or when user data changes
  useEffect(() => {
    const formattedUserData = formatUserData(user);
    setFormData({ ...formattedUserData });
    setOriginalData({ ...formattedUserData });
  }, [user, editModalOpen]);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
    if (action && action.onClick) {
      action.onClick();
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingField(null);
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(formData[field] || "");
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
    setErrors((prev) => ({ ...prev, [editingField]: "" }));
  };

  const validateField = (field, value) => {
    // Skip validation for "Not set" or "Not linked" placeholder values
    if (value === "Not set" || value === "Not linked" || value === "Not Verified") {
      return "This field is required";
    }

    const trimmedValue = value.toString().trim();

    switch (field) {
      case "email":
        if (!trimmedValue) return "Email is required";
        if (!validateEmail(trimmedValue)) return "Please enter a valid email address";
        return "";

      case "name":
        if (!trimmedValue) return "Name is required";
        if (!validateName(trimmedValue)) return "Name must be between 2 and 50 characters";
        return "";

      case "year":
        if (!trimmedValue) return "Year is required";
        const yearNum = parseInt(trimmedValue);
        if (isNaN(yearNum)) return "Year must be a number";
        if (!validateYear(yearNum)) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
        return "";

      case "branch":
        if (!trimmedValue) return "Branch is required";
        if (!validateBranch(trimmedValue))
          return `Branch must be one of: ${ALLOWED_BRANCHES.join(", ")}`;
        return "";

      default:
        return "";
    }
  };

  const saveFieldEdit = () => {
    if (!editingField) return;

    const error = validateField(editingField, tempValue);
    if (error) {
      setErrors((prev) => ({ ...prev, [editingField]: error }));
      return;
    }

    const trimmedValue = tempValue.toString().trim();
    let finalValue = trimmedValue;

    if (editingField === "year") {
      finalValue = parseInt(trimmedValue);
    } else if (editingField === "branch") {
      finalValue = trimmedValue.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [editingField]: finalValue }));
    setEditingField(null);
    setTempValue("");
    setErrors((prev) => ({ ...prev, [editingField]: "" }));
  };

  const handleTempValueChange = (value) => {
    setTempValue(value);
    // Clear error when user starts typing
    if (errors[editingField]) {
      setErrors((prev) => ({ ...prev, [editingField]: "" }));
    }
  };

  const hasChanges = () => {
    return Object.keys(formData).some((key) => {
      // Compare values, handling different data types
      const originalVal = originalData[key];
      const newVal = formData[key];

      if (typeof originalVal === "number" || typeof newVal === "number") {
        return Number(originalVal) !== Number(newVal);
      }
      return originalVal !== newVal;
    });
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== "metaMaskAddress" && field !== "isVerified" && field !== "role") {
        const error = validateField(field, formData[field] || "");
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: "error", text: "Please fix the errors before submitting" });
      return;
    }

    if (!hasChanges()) {
      setMessage({ type: "info", text: "No changes detected" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for API call - only include fields that are editable
      const updateData = {};
      const editableFields = ["name", "email", "year", "branch"];

      editableFields.forEach((key) => {
        if (formData[key] !== originalData[key]) {
          updateData[key] = formData[key];
        }
      });

      // Check if there are actually any changes to submit
      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "info", text: "No changes to update" });
        setLoading(false);
        return;
      }

      const response = await updateProfile(updateData);

      if (response.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });

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
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format specific fields with special display logic
  const formatValue = (key, value) => {
    switch (key) {
      case "name":
        return value || "Not set";
      case "email":
        return value || "Not set";
      case "year":
        return value || "Not set";
      case "branch":
        return value || "Not set";
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

  // Render appropriate input field based on field type
  const renderInputField = () => {
    if (editingField === "branch") {
      return (
        <FormControl fullWidth>
          <Select
            value={tempValue === "Not set" ? "" : tempValue}
            onChange={(e) => handleTempValueChange(e.target.value)}
            error={!!errors[editingField]}
            sx={{ height: "2.5rem" }}
          >
            {ALLOWED_BRANCHES.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
          </Select>
          {errors[editingField] && (
            <MDTypography variant="caption" color="error">
              {errors[editingField]}
            </MDTypography>
          )}
        </FormControl>
      );
    } else if (editingField === "year") {
      return (
        <FormControl fullWidth>
          <Select
            value={tempValue === "Not set" ? "" : tempValue}
            onChange={(e) => handleTempValueChange(e.target.value)}
            error={!!errors[editingField]}
            sx={{ height: "2.5rem" }}
          >
            {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          {errors[editingField] && (
            <MDTypography variant="caption" color="error">
              {errors[editingField]}
            </MDTypography>
          )}
        </FormControl>
      );
    } else {
      return (
        <MDInput
          value={tempValue === "Not set" ? "" : tempValue}
          onChange={(e) => handleTempValueChange(e.target.value)}
          error={!!errors[editingField]}
          helperText={errors[editingField]}
          fullWidth
          sx={{
            background: "#fff",
            input: { color: "#222" },
            borderRadius: 1,
            boxShadow: "0 1px 4px rgba(33,203,243,0.08)",
            border: errors[editingField] ? "1px solid #f44336" : "1px solid #e0e0e0",
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              saveFieldEdit();
            }
          }}
          type={editingField === "email" ? "email" : "text"}
          placeholder={`Enter your ${editingField}`}
        />
      );
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

  // Render editable fields in the modal
  const renderEditableFields = () => {
    const editableFields = ["name", "email", "year", "branch"];

    return editableFields.map((key) => {
      const value = formData[key] || "";
      const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      const isEditing = editingField === key;

      return (
        <MDBox key={key} mb={1.5}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
            <MDTypography variant="body2" fontWeight="bold" color="text">
              {formattedKey}
            </MDTypography>
            {!isEditing ? (
              <Tooltip title="Edit field">
                <IconButton
                  size="small"
                  onClick={() => startEditing(key)}
                  sx={{ color: "primary.main" }}
                >
                  <Icon fontSize="small">edit</Icon>
                </IconButton>
              </Tooltip>
            ) : (
              <MDBox>
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    onClick={saveFieldEdit}
                    sx={{ color: "success.main", mr: 1 }}
                  >
                    <Icon fontSize="small">check</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton size="small" onClick={cancelEditing} sx={{ color: "error.main" }}>
                    <Icon fontSize="small">close</Icon>
                  </IconButton>
                </Tooltip>
              </MDBox>
            )}
          </MDBox>

          {isEditing ? (
            <MDBox>{renderInputField()}</MDBox>
          ) : (
            <MDBox
              sx={{
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#fafafa",
                minHeight: "42px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MDTypography variant="button" sx={{ color: "#222" }}>
                {formatValue(key, value)}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      );
    });
  };

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

      {/* Edit Profile Modal */}
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
              {message.text && (
                <Alert severity={message.type || "info"} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <form>
                {renderEditableFields()}

                <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1}>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseEditModal}
                    disabled={loading}
                  >
                    Cancel
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit}
                    disabled={loading || !hasChanges()}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                  >
                    {loading ? "Updating..." : "Update Details"}
                  </MDButton>
                </MDBox>
              </form>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
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
