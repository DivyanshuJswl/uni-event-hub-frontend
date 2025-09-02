import React, { useState } from "react";
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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: "90vw",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
};

function ProfileInfoCard({ title, description, info, social, action, shadow }) {
  const { socialMediaColors } = colors;
  const { size } = typography;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...info });

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
    if (action && action.onClick) {
      action.onClick();
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically call an API to update the profile
    console.log("Updated data:", formData);
    handleCloseEditModal();
  };

  // Format specific fields with special display logic
  const formatValue = (key, value) => {
    switch (key) {
      case "year":
        return `${value}`;
      case "branch":
        return value.toUpperCase();
      case "metaMaskAddress":
        return value && value !== "Not connected" ? (
          <Tooltip title={value} placement="top">
            <Chip
              label={`${value.substring(0, 6)}...${value.substring(value.length - 4)}`}
              size="small"
            />
          </Tooltip>
        ) : (
          "Not connected"
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
        return value;
    }
  };

  // Prepare the info items for rendering
  const renderItems = Object.entries(info).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    const formattedValue = formatValue(key, value);
    // If the value is not defined or empty, skip rendering this item
    if (formattedValue === undefined || formattedValue === "") return null;

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

  // Render the card social media icons
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

  // Render editable fields in the modal
  const renderEditableFields = () => {
    return Object.entries(info).map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

      // Skip fields that shouldn't be editable
      if (key === "metaMaskAddress" || key === "isVerified" || key === "role") {
        return null;
      }

      return (
        <MDBox key={key} mb={2}>
          <MDInput
            label={formattedKey}
            fullWidth
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            sx={{
              background: "#fff",
              input: { color: "#222" },
              borderRadius: 1,
              boxShadow: "0 1px 4px rgba(33,203,243,0.08)",
              border: "1px solid #e0e0e0",
            }}
          />
        </MDBox>
      );
    });
  };

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
          <Box sx={modalStyle}>
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
              <form>
                {renderEditableFields()}
                <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1}>
                  <MDButton variant="outlined" color="secondary" onClick={handleCloseEditModal}>
                    Cancel
                  </MDButton>
                  <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                    Save Changes
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
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  info: PropTypes.shape({
    year: PropTypes.number,
    email: PropTypes.string,
    branch: PropTypes.string,
    metaMaskAddress: PropTypes.string,
    role: PropTypes.string,
    isVerified: PropTypes.string,
  }).isRequired,
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
  }),
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
