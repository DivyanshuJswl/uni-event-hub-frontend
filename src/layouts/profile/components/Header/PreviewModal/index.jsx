import { memo, useMemo } from "react";
import { Modal, Fade, Box, IconButton, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import PropTypes from "prop-types";

const PreviewDialog = memo(({ open, onClose, avatar }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized modal style
  const modalStyle = useMemo(
    () => ({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minWidth: 350,
      maxWidth: "90vw",
      bgcolor: "background.default",
      borderRadius: 3,
      boxShadow: 24,
      p: 0,
      zIndex: 1301,
      outline: "none",
    }),
    []
  );

  // Memoized image style
  const imageStyle = useMemo(
    () => ({
      width: "280px",
      height: "280px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `4px solid ${darkMode ? "#222" : "#fff"}`,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    }),
    [darkMode]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
      }}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
            py={2}
            sx={{
              background: "linear-gradient(90deg, #1976d2, #21cbf3)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "white" }}>visibility</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Profile Picture Preview
              </MDTypography>
            </MDBox>
            <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>

          <MDBox px={4} py={3} textAlign="center">
            <img src={avatar} alt="Profile Preview" style={imageStyle} />
            <MDBox mt={3}>
              <MDButton variant="gradient" color="info" onClick={onClose}>
                Close Preview
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );
});

PreviewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  avatar: PropTypes.string,
};

PreviewDialog.displayName = "PreviewDialog";

export default PreviewDialog;
