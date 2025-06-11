import { Download, InsertDriveFile } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";

function CertificateActions({ certificateId }) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  return (
    <MDBox display="flex" gap={1}>
      <MDButton
        variant="outlined"
        size="small"
        startIcon={<InsertDriveFile />}
        sx={
          !darkMode
            ? {
                color: "#1A73E8",
                borderColor: "#1A73E8",
                "&:hover": {
                  backgroundColor: "rgba(189, 189, 189, 0.71)",
                },
              }
            : {}
        }
      >
        View
      </MDButton>
      <MDButton variant="contained" size="small" color={sidenavColor} startIcon={<Download />}>
        Download
      </MDButton>
    </MDBox>
  );
}

CertificateActions.propTypes = {
  certificateId: PropTypes.string.isRequired,
};

export default CertificateActions;
