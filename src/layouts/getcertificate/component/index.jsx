import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Modal,
  Fade,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
  Skeleton,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import {
  Visibility,
  Download,
  Verified,
  Link,
  Close,
  CalendarToday,
  Place,
  Person,
} from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "context/AuthContext";
import { Container } from "@mui/system";

// Responsive modal style
const getModalStyle = (darkMode, isMobile) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isMobile ? "95vw" : "600px",
  maxWidth: "90vw",
  maxHeight: "85vh",
  overflowY: "auto",
  bgcolor: "background.default",
  borderRadius: isMobile ? 2 : 3,
  boxShadow: 24,
  p: 0,
  zIndex: 1301,
  outline: "none",
});

// Skeleton loading component for certificates
const CertificateSkeleton = ({ isMobile }) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: isMobile ? 2 : 3,
    }}
  >
    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header skeleton */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </Box>

      {/* Title skeleton */}
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

      {/* Content skeleton */}
      <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 3 }} />

      {/* Actions skeleton */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </CardContent>
  </Card>
);

const MyCertificates = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/certificates/my-certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCertificates(response.data.data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setError("Failed to load certificates");
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedCertificate(null);
  };

  const handleDownload = async (certificate) => {
    try {
      window.open(certificate.certificateURL, "_blank");
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  const copyVerificationLink = (certificateId) => {
    const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success("Verification link copied to clipboard!");
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case 1:
        return "🥇 1st Place";
      case 2:
        return "🥈 2nd Place";
      case 3:
        return "🥉 3rd Place";
      default:
        return `${position}th Place`;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return "success";
      case 2:
        return "warning";
      case 3:
        return "secondary";
      default:
        return "primary";
    }
  };

  // Info Item Component for consistent styling
  const InfoItem = ({ label, value, icon, children }) => (
    <MDBox display="flex" alignItems="flex-start" gap={1.5} py={1}>
      {icon && <Box sx={{ color: sidenavColor, mt: 0.25, minWidth: 24 }}>{icon}</Box>}
      <Box flex={1}>
        <MDTypography variant="caption" fontWeight="bold" color="text" display="block">
          {label}
        </MDTypography>
        {children || (
          <MDTypography variant="body2" color="text" sx={{ opacity: 0.8, lineHeight: 1.4 }}>
            {value || "Not specified"}
          </MDTypography>
        )}
      </Box>
    </MDBox>
  );

  // Certificate Preview Modal Component
  const CertificatePreviewModal = () => (
    <Modal
      open={previewOpen}
      onClose={handleClosePreview}
      aria-labelledby="certificate-preview-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
    >
      <Fade in={previewOpen}>
        <Box sx={getModalStyle(darkMode, isMobile)}>
          {/* Header */}
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={isMobile ? 2 : 3}
            py={isMobile ? 1.5 : 2}
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.focus} 100%)`,
              borderTopLeftRadius: isMobile ? 8 : 12,
              borderTopRightRadius: isMobile ? 8 : 12,
            }}
          >
            <MDBox display="flex" alignItems="center" gap={1}>
              <Verified sx={{ color: "white", fontSize: isMobile ? 20 : 24 }} />
              <MDTypography
                variant={isMobile ? "h6" : "h5"}
                color="white"
                fontWeight="bold"
                sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
              >
                Certificate Details
              </MDTypography>
            </MDBox>
            <IconButton onClick={handleClosePreview} size="small" sx={{ color: "white" }}>
              <Close fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </MDBox>

          {/* Content */}
          <MDBox px={isMobile ? 2 : 4} py={isMobile ? 2 : 3}>
            {selectedCertificate && (
              <>
                {/* Certificate Header */}
                <MDBox textAlign="center" mb={3}>
                  <Chip
                    label={
                      selectedCertificate.positionLabel ||
                      getPositionLabel(selectedCertificate.winnerPosition)
                    }
                    color={getPositionColor(selectedCertificate.winnerPosition)}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      fontSize: isMobile ? "0.9rem" : "1.1rem",
                      py: isMobile ? 0.75 : 1,
                      px: isMobile ? 1 : 2,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  />
                  <MDTypography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight="bold"
                    gutterBottom
                    color={sidenavColor}
                    sx={{ lineHeight: 1.3 }}
                  >
                    {selectedCertificate.eventName}
                  </MDTypography>
                </MDBox>

                <Divider sx={{ mb: 3 }} />

                {/* Certificate Information */}
                <Grid container spacing={isMobile ? 2 : 3}>
                  {/* Certificate Details */}
                  <Grid item xs={12} md={6}>
                    <MDTypography
                      variant="h6"
                      fontWeight="medium"
                      gutterBottom
                      color="text"
                      sx={{ fontSize: isMobile ? "1rem" : "1.125rem" }}
                    >
                      📜 Certificate Information
                    </MDTypography>

                    <MDBox sx={{ pl: isMobile ? 0 : 1 }}>
                      <InfoItem
                        label="Certificate ID"
                        value={selectedCertificate.certificateId}
                        icon={<Verified fontSize="small" color="primary" />}
                      />

                      <InfoItem
                        label="Issued Date"
                        value={new Date(selectedCertificate.issuedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        icon={<CalendarToday fontSize="small" color="primary" />}
                      />

                      <InfoItem
                        label="Status"
                        value={selectedCertificate.status}
                        icon={
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor:
                                selectedCertificate.status === "issued"
                                  ? "success.main"
                                  : "grey.500",
                              m: 1,
                            }}
                          />
                        }
                      />

                      {selectedCertificate.metaMaskAddress && (
                        <InfoItem
                          label="Linked Wallet"
                          icon={<Link fontSize="small" color="primary" />}
                        >
                          <Tooltip title={selectedCertificate.metaMaskAddress} placement="top">
                            <Chip
                              label={`${selectedCertificate.metaMaskAddress.substring(0, 6)}...${selectedCertificate.metaMaskAddress.substring(selectedCertificate.metaMaskAddress.length - 4)}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ maxWidth: "100%" }}
                            />
                          </Tooltip>
                        </InfoItem>
                      )}
                    </MDBox>
                  </Grid>

                  {/* Event Details */}
                  <Grid item xs={12} md={6}>
                    <MDTypography
                      variant="h6"
                      fontWeight="medium"
                      gutterBottom
                      color="text"
                      sx={{ fontSize: isMobile ? "1rem" : "1.125rem" }}
                    >
                      🎯 Event Details
                    </MDTypography>

                    <MDBox sx={{ pl: isMobile ? 0 : 1 }}>
                      <InfoItem
                        label="Category"
                        value={selectedCertificate.event?.category}
                        icon={<Verified fontSize="small" color="primary" />}
                      />

                      <InfoItem
                        label="Event Date"
                        value={
                          selectedCertificate.event?.date
                            ? new Date(selectedCertificate.event.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"
                        }
                        icon={<CalendarToday fontSize="small" color="primary" />}
                      />

                      <InfoItem
                        label="Location"
                        value={selectedCertificate.event?.location}
                        icon={<Place fontSize="small" color="primary" />}
                      />

                      <InfoItem
                        label="Issued By"
                        value={selectedCertificate.issuer?.name}
                        icon={<Person fontSize="small" color="primary" />}
                      />
                    </MDBox>
                  </Grid>
                </Grid>

                {/* Additional Metadata */}
                {selectedCertificate.metadata && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MDBox>
                      <MDTypography
                        variant="h6"
                        fontWeight="medium"
                        gutterBottom
                        color="text"
                        sx={{ fontSize: isMobile ? "1rem" : "1.125rem" }}
                      >
                        📋 Additional Information
                      </MDTypography>
                      <MDBox sx={{ pl: isMobile ? 0 : 1 }}>
                        <MDTypography
                          variant="body2"
                          color="text"
                          sx={{
                            opacity: 0.8,
                            lineHeight: 1.6,
                            mb: selectedCertificate.metadata.skills?.length ? 2 : 0,
                          }}
                        >
                          {selectedCertificate.metadata.description ||
                            `Awarded for outstanding performance in ${selectedCertificate.eventName}`}
                        </MDTypography>

                        {selectedCertificate.metadata.skills &&
                          selectedCertificate.metadata.skills.length > 0 && (
                            <MDBox>
                              <MDTypography
                                variant="caption"
                                fontWeight="bold"
                                color="text"
                                display="block"
                                mb={1}
                              >
                                Skills Recognized:
                              </MDTypography>
                              <MDBox display="flex" flexWrap="wrap" gap={1}>
                                {selectedCertificate.metadata.skills.map((skill, index) => (
                                  <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                      fontSize: "0.75rem",
                                      height: 24,
                                    }}
                                  />
                                ))}
                              </MDBox>
                            </MDBox>
                          )}
                      </MDBox>
                    </MDBox>
                  </>
                )}

                {/* Action Buttons */}
                <MDBox
                  display="flex"
                  justifyContent="center"
                  gap={2}
                  mt={4}
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    onClick={() => handleDownload(selectedCertificate)}
                    startIcon={<Download />}
                    fullWidth={isMobile}
                    sx={{
                      minWidth: isMobile ? "auto" : 180,
                      borderRadius: 2,
                    }}
                  >
                    Download Certificate
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    color="primary"
                    onClick={() => copyVerificationLink(selectedCertificate.certificateId)}
                    startIcon={<Link />}
                    fullWidth={isMobile}
                    sx={{
                      minWidth: isMobile ? "auto" : 180,
                      borderRadius: 2,
                    }}
                  >
                    Copy Verification Link
                  </MDButton>
                </MDBox>

                {/* Verification Note */}
                <MDBox textAlign="center" mt={3}>
                  <MDTypography
                    variant="caption"
                    color="text"
                    sx={{
                      opacity: 0.7,
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    🔒 This certificate is securely stored and can be verified using the
                    verification link
                  </MDTypography>
                </MDBox>
              </>
            )}
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );

  // Responsive grid configuration
  const getGridConfig = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, md: 6 };
    return { xs: 12, md: 6, lg: 4 };
  };

  // Render loading state with skeletons
  const renderLoadingState = () => (
    <Grid container spacing={isMobile ? 2 : 3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item {...getGridConfig()} key={index}>
          <CertificateSkeleton isMobile={isMobile} />
        </Grid>
      ))}
    </Grid>
  );

  // Render error state
  const renderErrorState = () => (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        px: 2,
        borderRadius: 3,
        backgroundColor: darkMode ? "rgba(211, 47, 47, 0.1)" : "rgba(211, 47, 47, 0.05)",
        border: `1px solid ${darkMode ? "rgba(211, 47, 47, 0.3)" : "rgba(211, 47, 47, 0.2)"}`,
      }}
    >
      <Alert
        severity="error"
        sx={{
          mb: 3,
          maxWidth: 400,
          mx: "auto",
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
        action={
          <MDButton
            onClick={fetchCertificates}
            variant="gradient"
            color={sidenavColor}
            size="small"
          >
            Try Again
          </MDButton>
        }
      >
        <MDTypography variant="h6" gutterBottom>
          Failed to Load Certificates
        </MDTypography>
        <MDTypography variant="body2">
          {error || "There was an error loading your certificates. Please try again."}
        </MDTypography>
      </Alert>
    </Box>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Card
      sx={{
        borderRadius: isMobile ? 2 : 3,
        textAlign: "center",
        background: darkMode
          ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
      }}
    >
      <CardContent sx={{ py: isMobile ? 6 : 8, px: isMobile ? 2 : 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <Verified
            sx={{
              fontSize: 40,
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
            }}
          />
        </Box>
        <MDTypography variant={isMobile ? "h5" : "h4"} gutterBottom color="text" fontWeight="bold">
          No Certificates Yet
        </MDTypography>
        <MDTypography
          variant="body1"
          color="text"
          sx={{
            opacity: 0.7,
            maxWidth: 400,
            mx: "auto",
            mb: 3,
          }}
        >
          Certificates you earn from events will appear here. Participate in events and win to get
          certified!
        </MDTypography>
      </CardContent>
    </Card>
  );

  // Render certificates grid
  const renderCertificatesGrid = () => (
    <Grid container spacing={isMobile ? 2 : 3}>
      {certificates.map((certificate) => (
        <Grid item {...getGridConfig()} key={certificate.id || certificate._id}>
          <Card
            sx={{
              height: "100%",
              transition: "all 0.3s ease",
              borderRadius: isMobile ? 2 : 3,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: darkMode ? "0 8px 25px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              {/* Certificate Header */}
              <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Chip
                  icon={<Verified fontSize="small" />}
                  label={certificate.positionLabel || getPositionLabel(certificate.winnerPosition)}
                  color={getPositionColor(certificate.winnerPosition)}
                  size="small"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                />
                <Chip
                  label={certificate.status || "issued"}
                  color={certificate.status === "issued" ? "primary" : "default"}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                />
              </MDBox>

              {/* Event Details */}
              <MDTypography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
              >
                {certificate.eventName}
              </MDTypography>

              <MDTypography variant="caption" sx={{ opacity: 0.7 }} display="block" gutterBottom>
                📅 {new Date(certificate.issuedAt).toLocaleDateString()}
              </MDTypography>

              <MDTypography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  mb: 2,
                  fontSize: isMobile ? "0.8rem" : "0.875rem",
                }}
              >
                {certificate.event?.category && `Category: ${certificate.event.category}`}
              </MDTypography>

              {/* Certificate ID */}
              <MDTypography variant="caption" sx={{ opacity: 0.7 }} display="block" gutterBottom>
                ID: {certificate.certificateId}
              </MDTypography>

              {/* Actions */}
              <MDBox display="flex" justifyContent="space-between" mt={3}>
                <Tooltip title="View certificate details" placement="top">
                  <IconButton onClick={() => handlePreview(certificate)} color="info" size="small">
                    <Visibility fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy verification link" placement="top">
                  <IconButton
                    onClick={() => copyVerificationLink(certificate.certificateId)}
                    color="primary"
                    size="small"
                  >
                    <Link fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download certificate" placement="top">
                  <IconButton
                    onClick={() => handleDownload(certificate)}
                    color="success"
                    size="small"
                  >
                    <Download fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 0,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} theme={darkMode ? "dark" : "light"} />
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 2 }}>
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          {/* Header with integrated loading/error states */}
          <MDBox mb={isMobile ? 2 : 4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: darkMode ? "white" : "primary",
                  }}
                >
                  My Certificates
                  {loading && <CircularProgress size={20} sx={{ ml: 2, color: sidenavColor }} />}
                </Typography>
                <MDTypography
                  variant="subtitle1"
                  sx={{
                    color: darkMode ? "white" : "primary",
                  }}
                >
                  View and manage your earned certificates
                  {certificates.length > 0 && (
                    <span style={{ color: "#2ca630ff", fontWeight: "bold", marginLeft: "8px" }}>
                      • You have {certificates.length} certificate(s)
                    </span>
                  )}
                </MDTypography>
              </Box>

              {error && (
                <MDButton
                  onClick={fetchCertificates}
                  variant="gradient"
                  color={sidenavColor}
                  size={isMobile ? "small" : "medium"}
                  startIcon={<Verified />}
                >
                  Retry
                </MDButton>
              )}
            </Box>

            {/* Error state alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
                }}
              >
                <MDTypography variant="body2">{error}</MDTypography>
              </Alert>
            )}
          </MDBox>

          {/* Main Content */}
          {loading
            ? renderLoadingState()
            : error
              ? renderErrorState()
              : certificates.length === 0
                ? renderEmptyState()
                : renderCertificatesGrid()}

          {/* Certificate Preview Modal */}
          <CertificatePreviewModal />
        </Box>
      </Container>
    </Box>
  );
};

export default MyCertificates;
