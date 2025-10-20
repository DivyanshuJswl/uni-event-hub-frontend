import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Box, Fade, Backdrop, IconButton, Icon } from "@mui/material";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { styled } from "@mui/material/styles";

const CropContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& .ReactCrop": {
    maxWidth: "100%",
    boxShadow: theme.shadows[10],
    borderRadius: theme.spacing(1),
    overflow: "hidden",
  },
  "& img": {
    maxHeight: "400px",
  },
}));

const modalStyle = () => ({
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
});

const ImageCropper = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspect = 1,
  darkMode = false,
  isUploading = false,
}) => {
  const [crop, setCrop] = useState({ unit: "%", width: 90, aspect });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imgRef.current,
          completedCrop,
          "profile-picture.jpg"
        );
        onCropComplete(croppedImageBlob);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="crop-profile-picture-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={open}>
        <Box sx={modalStyle()}>
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
              <Icon sx={{ color: "white" }}>crop</Icon>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                Crop Your Profile Picture
              </MDTypography>
            </MDBox>
            <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>
          {/* Content */}
          <MDBox px={4} py={3}>
            <CropContainer>
              {imageSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    style={{ maxWidth: "100%" }}
                    onLoad={(e) => {
                      const { width, height } = e.currentTarget;
                      // Set initial crop to center
                      const size = Math.min(width, height) * 0.8;
                      setCrop({
                        unit: "px",
                        width: size,
                        height: size,
                        x: (width - size) / 2,
                        y: (height - size) / 2,
                        aspect: 1,
                      });
                    }}
                  />
                </ReactCrop>
              )}
            </CropContainer>
            <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1}>
              <MDButton variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleCropComplete}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Apply Crop"}
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImageCropper;
