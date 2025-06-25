import { Download, InsertDriveFile, Visibility } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";
import { saveAs } from "file-saver"; // You'll need to install file-saver

function CertificateActions({ certificateId }) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  // Extract Google Drive file ID from URL if it's a shareable link
  const extractFileId = (url) => {
    if (!url) return null;
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const fileId = extractFileId(certificateId);
  const directDownloadUrl = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : null;
  const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;

  const handleView = () => {
    if (!previewUrl) {
      console.error("Invalid certificate URL");
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async () => {
    if (!directDownloadUrl) {
      console.error("Invalid certificate URL");
      return;
    }

    try {
      // For better UX, you might want to show a loading state here
      const response = await fetch(directDownloadUrl);
      const blob = await response.blob();
      saveAs(blob, `certificate-${fileId}.pdf`); // Adjust filename as needed
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab if download fails
      window.open(directDownloadUrl, "_blank");
    }
  };

  return (
    <MDBox display="flex" gap={1}>
      <MDButton
        variant="outlined"
        size="small"
        startIcon={<Visibility />}
        onClick={handleView}
        disabled={!previewUrl}
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
      <MDButton
        variant="contained"
        size="small"
        color={sidenavColor}
        startIcon={<Download />}
        onClick={handleDownload}
        disabled={!directDownloadUrl}
      >
        Download
      </MDButton>
    </MDBox>
  );
}

CertificateActions.propTypes = {
  certificateId: PropTypes.string.isRequired,
};

export default CertificateActions;
