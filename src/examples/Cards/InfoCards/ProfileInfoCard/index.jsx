import { useState, useEffect, useCallback, useMemo, memo } from "react";
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
import { useNotifications } from "context/NotifiContext";

// Constants
const ALLOWED_BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "OTHERS"];
const MIN_YEAR = 1;
const MAX_YEAR = 5;

// Memoized validation functions
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  year: (year) => year >= MIN_YEAR && year <= MAX_YEAR,
  branch: (branch) => ALLOWED_BRANCHES.includes(branch.toUpperCase()),
  name: (name) => name.trim().length >= 2 && name.trim().length <= 50,
};

const modalStyle = () => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.default",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
});

function ProfileInfoCard({
  title = "",
  description = "",
  social = [],
  action = null,
  shadow = true,
}) {
  const { socialMediaColors } = colors;
  const { size } = typography;
  const { updateProfile, user } = useAuth();
  const { showToast } = useNotifications();

  // Consolidated state
  const [modalState, setModalState] = useState({
    open: false,
    loading: false,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    year: "",
    branch: "",
  });

  const [editErrors, setEditErrors] = useState({});

  // Memoized user info formatting
  const userInfo = useMemo(() => {
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
  }, [user]);

  // Reset form when modal opens or user changes
  useEffect(() => {
    setEditForm({
      name: userInfo.name,
      email: userInfo.email,
      year: userInfo.year,
      branch: userInfo.branch,
    });
  }, [userInfo, modalState.open]);

  // Memoized handlers
  const handleOpenEditModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: true }));
    setEditErrors({});
    action?.onClick?.();
  }, [action]);

  const handleCloseEditModal = useCallback(() => {
    setModalState({ open: false, loading: false });
    setEditErrors({});
  }, []);

  const validateEditField = useCallback((field, value) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validators.email(value.trim())) return "Please enter a valid email address";
        return "";
      case "name":
        if (!value.trim()) return "Name is required";
        if (!validators.name(value.trim())) return "Name must be between 2 and 50 characters";
        return "";
      case "year":
        if (!value) return "Year is required";
        const yearNum = parseInt(value);
        if (isNaN(yearNum)) return "Year must be a number";
        if (!validators.year(yearNum)) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
        return "";
      case "branch":
        if (!value) return "Branch is required";
        if (!validators.branch(value))
          return `Branch must be one of: ${ALLOWED_BRANCHES.join(", ")}`;
        return "";
      default:
        return "";
    }
  }, []);

  const handleEditFieldChange = useCallback(
    (field, value) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
      if (editErrors[field]) {
        setEditErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [editErrors]
  );

  const hasChanges = useCallback(() => {
    return Object.keys(editForm).some((key) => {
      const currentVal = userInfo[key];
      const newVal = editForm[key];
      if (typeof currentVal === "number" || typeof newVal === "number") {
        return Number(currentVal) !== Number(newVal);
      }
      return currentVal !== newVal;
    });
  }, [editForm, userInfo]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();

      const newErrors = {};
      Object.keys(editForm).forEach((field) => {
        const error = validateEditField(field, editForm[field]);
        if (error) newErrors[field] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setEditErrors(newErrors);
        showToast("Please fix the errors before submitting", "error", "Validation Error");
        return;
      }

      if (!hasChanges()) {
        showToast("No changes detected", "info", "No Changes");
        return;
      }

      setModalState((prev) => ({ ...prev, loading: true }));

      try {
        const updateData = {};
        Object.keys(editForm).forEach((key) => {
          const currentVal = userInfo[key];
          const newVal = editForm[key];
          if (currentVal !== newVal) {
            updateData[key] = key === "year" ? parseInt(newVal) : newVal;
          }
        });

        const response = await updateProfile(updateData);

        if (response.success) {
          showToast("Profile updated successfully!", "success", "Update Complete");
          setTimeout(() => {
            handleCloseEditModal();
            action?.onRefresh?.();
          }, 1500);
        } else {
          throw new Error(response.message || "Update failed");
        }
      } catch (error) {
        console.error("Update error:", error);
        showToast(error.message || "Failed to update profile", "error", "Update Failed");
      } finally {
        setModalState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      editForm,
      validateEditField,
      hasChanges,
      userInfo,
      updateProfile,
      showToast,
      handleCloseEditModal,
      action,
    ]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Memoized format value function
  const formatValue = useCallback((key, value) => {
    switch (key) {
      case "metaMaskAddress":
        return value && value !== "Not linked" ? (
          <Tooltip title={value} placement="top">
            <Chip
              label={`${value.substring(0, 4)}...${value.substring(value.length - 4)}`}
              size="small"
              color="primary"
              variant="outlined"
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
            variant="outlined"
          />
        );
      case "isVerified":
        return (
          <Chip
            label={value}
            color={value === "Verified" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        );
      default:
        return value || "Not set";
    }
  }, []);

  // Memoized render items
  const renderItems = useMemo(() => {
    return Object.entries(userInfo).map(([key, value]) => {
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
  }, [userInfo, formatValue]);

  // Memoized social rendering
  const renderSocial = useMemo(() => {
    return social.map(({ link, icon, color }) => (
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
  }, [social, size.lg, socialMediaColors]);

  // Memoized year options
  const yearOptions = useMemo(
    () => Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i),
    []
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

      <Modal
        open={modalState.open}
        onClose={handleCloseEditModal}
        sx={{
          backdropFilter: "blur(8px) brightness(0.7)",
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 1300,
        }}
        closeAfterTransition
      >
        <Fade in={modalState.open}>
          <Box sx={modalStyle()}>
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

            <MDBox component="form" onSubmit={handleSubmit} px={4} py={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Full Name
                    </MDTypography>
                    <MDInput
                      value={editForm.name}
                      onChange={(e) => handleEditFieldChange("name", e.target.value)}
                      onKeyPress={handleKeyPress}
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
                      onKeyPress={handleKeyPress}
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
                        {yearOptions.map((year) => (
                          <MenuItem key={year} value={year}>
                            Year {year}
                          </MenuItem>
                        ))}
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
                  disabled={modalState.loading}
                >
                  Cancel
                </MDButton>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  disabled={modalState.loading || !hasChanges()}
                  startIcon={modalState.loading ? <CircularProgress size={16} /> : null}
                >
                  {modalState.loading ? "Updating..." : "Update Profile"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

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
};

ProfileInfoCard.displayName = "ProfileInfoCard";

export default memo(ProfileInfoCard);
