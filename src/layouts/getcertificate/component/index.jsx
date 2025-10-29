import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Tooltip,
  Modal,
  Fade,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
  Skeleton,
  Container,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";
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
import { useAuth } from "context/AuthContext";

// Memoized Skeleton Component
const CertificateSkeleton = memo(({ isMobile }) => (
  <Card sx={{ height: "100%", borderRadius: isMobile ? 2 : 3 }}>
    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </Box>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 3 }} />
      <Box display="flex" justifyContent="space-between" mt={3}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="circular" width={40} height={40} />
        ))}
      </Box>
    </CardContent>
  </Card>
));

CertificateSkeleton.displayName = "CertificateSkeleton";

// Memoized Info Item Component
const InfoItem = memo(({ label, value, icon, children }) => (
  <MDBox display="flex" alignItems="flex-start" gap={1.5} py={1}>
    {icon && <Box sx={{ color: "info.main", mt: 0.25, minWidth: 24 }}>{icon}</Box>}
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
));

InfoItem.displayName = "InfoItem";

const MyCertificates = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { showToast } = useNotifications();
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // Consolidated state
  const [pageState, setPageState] = useState({
    certificates: [],
    loading: true,
    error: null,
    selectedCertificate: null,
    previewOpen: false,
  });

  // Memoized modal style
  const modalStyle = useMemo(
    () => ({
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
      outline: "none",
    }),
    [isMobile]
  );

  // Memoized fetch function
  const fetchCertificates = useCallback(async () => {
    setPageState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/my-certificates`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      setPageState((prev) => ({
        ...prev,
        certificates: response.data.data.certificates || [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error fetching certificates:", error);
      const errorMessage =
        error.response?.data?.message || error.code === "ECONNABORTED"
          ? "Request timeout"
          : "Failed to load certificates";

      setPageState((prev) => ({
        ...prev,
        certificates: [],
        loading: false,
        error: errorMessage,
      }));

      showToast(errorMessage, "error", "Failed to Load Certificates");
    }
  }, [BASE_URL, token, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Memoized handlers
  const handlePreview = useCallback((certificate) => {
    setPageState((prev) => ({
      ...prev,
      selectedCertificate: certificate,
      previewOpen: true,
    }));
  }, []);

  const handleClosePreview = useCallback(() => {
    setPageState((prev) => ({
      ...prev,
      previewOpen: false,
      selectedCertificate: null,
    }));
  }, []);

  const handleDownload = useCallback(
    (certificate) => {
      try {
        window.open(certificate.certificateURL, "_blank");
        showToast("Opening certificate in new tab", "success", "Download Started");
      } catch (error) {
        showToast("Failed to download certificate", "error", "Download Failed");
      }
    },
    [showToast]
  );

  const copyVerificationLink = useCallback(
    (certificateId) => {
      const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
      navigator.clipboard.writeText(verificationUrl);
      showToast("Verification link copied to clipboard!", "success", "Link Copied");
    },
    [showToast]
  );

  // Memoized helper functions
  const getPositionLabel = useCallback((position) => {
    const labels = {
      1: "🥇 1st Place",
      2: "🥈 2nd Place",
      3: "🥉 3rd Place",
    };
    return labels[position] || `${position}th Place`;
  }, []);

  const getPositionColor = useCallback((position) => {
    const colors = {
      1: "success",
      2: "warning",
      3: "secondary",
    };
    return colors[position] || "primary";
  }, []);

  // Memoized grid configuration
  const gridConfig = useMemo(() => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, md: 6 };
    return { xs: 12, md: 6, lg: 4 };
  }, [isMobile, isTablet]);

  // Memoized rendering functions
  const renderLoadingState = useCallback(
    () => (
      <Grid container spacing={isMobile ? 2 : 3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item {...gridConfig} key={index}>
            <CertificateSkeleton isMobile={isMobile} />
          </Grid>
        ))}
      </Grid>
    ),
    [isMobile, gridConfig]
  );

  const renderEmptyState = useCallback(
    () => (
      <Card sx={{ borderRadius: isMobile ? 2 : 3, textAlign: "center" }}>
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
            <Verified sx={{ fontSize: 40, opacity: 0.5 }} />
          </Box>
          <MDTypography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
            No Certificates Yet
          </MDTypography>
          <MDTypography variant="body1" sx={{ opacity: 0.7, maxWidth: 400, mx: "auto", mb: 3 }}>
            Certificates you earn from events will appear here. Participate in events and win to get
            certified!
          </MDTypography>
        </CardContent>
      </Card>
    ),
    [isMobile, darkMode]
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
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 2 }}>
        {/* Header */}
        <MDBox mb={isMobile ? 2 : 4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "text.main" }}>
                My Certificates
              </Typography>
              <MDTypography variant="subtitle1" color="text">
                View and manage your earned certificates
                {pageState.certificates.length > 0 && (
                  <span style={{ color: "#2ca630ff", fontWeight: "bold", marginLeft: "8px" }}>
                    • You have {pageState.certificates.length} certificate(s)
                  </span>
                )}
              </MDTypography>
            </Box>

            {pageState.error && (
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

          {pageState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <MDTypography variant="body2">{pageState.error}</MDTypography>
            </Alert>
          )}
        </MDBox>

        {/* Main Content */}
        {pageState.loading ? (
          renderLoadingState()
        ) : pageState.certificates.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={isMobile ? 2 : 3}>
            {pageState.certificates.map((certificate) => (
              <Grid item {...gridConfig} key={certificate.id || certificate._id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    borderRadius: isMobile ? 2 : 3,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: darkMode
                        ? "0 8px 25px rgba(0,0,0,0.3)"
                        : "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Chip
                        icon={<Verified fontSize="small" />}
                        label={getPositionLabel(certificate.winnerPosition)}
                        color={getPositionColor(certificate.winnerPosition)}
                        size="small"
                      />
                      <Chip
                        label={certificate.status || "issued"}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </MDBox>

                    <MDTypography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                      {certificate.eventName}
                    </MDTypography>

                    <MDTypography
                      variant="caption"
                      sx={{ opacity: 0.7 }}
                      display="block"
                      gutterBottom
                    >
                      📅 {new Date(certificate.issuedAt).toLocaleDateString()}
                    </MDTypography>

                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                      {certificate.event?.category && `Category: ${certificate.event.category}`}
                    </MDTypography>

                    <MDTypography
                      variant="caption"
                      sx={{ opacity: 0.7 }}
                      display="block"
                      gutterBottom
                    >
                      ID: {certificate.certificateId}
                    </MDTypography>

                    <MDBox display="flex" justifyContent="space-between" mt={3}>
                      <Tooltip title="View details">
                        <IconButton
                          onClick={() => handlePreview(certificate)}
                          color="info"
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy link">
                        <IconButton
                          onClick={() => copyVerificationLink(certificate.certificateId)}
                          color="primary"
                          size="small"
                        >
                          <Link />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          onClick={() => handleDownload(certificate)}
                          color="success"
                          size="small"
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </MDBox>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Preview Modal */}
        <Modal
          open={pageState.previewOpen}
          onClose={handleClosePreview}
          sx={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.35)" }}
          closeAfterTransition
        >
          <Fade in={pageState.previewOpen}>
            <Box sx={modalStyle}>
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={isMobile ? 2 : 3}
                py={isMobile ? 1.5 : 2}
                sx={{
                  background: "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
                  borderTopLeftRadius: isMobile ? 8 : 12,
                  borderTopRightRadius: isMobile ? 8 : 12,
                }}
              >
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Verified sx={{ color: "white" }} />
                  <MDTypography variant={isMobile ? "h6" : "h5"} color="white" fontWeight="bold">
                    Certificate Details
                  </MDTypography>
                </MDBox>
                <IconButton onClick={handleClosePreview} size="small" sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </MDBox>

              <MDBox px={isMobile ? 2 : 4} py={isMobile ? 2 : 3}>
                {pageState.selectedCertificate && (
                  <>
                    <MDBox textAlign="center" mb={3}>
                      <Chip
                        label={getPositionLabel(pageState.selectedCertificate.winnerPosition)}
                        color={getPositionColor(pageState.selectedCertificate.winnerPosition)}
                        size="large"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      />
                      <MDTypography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        color={sidenavColor}
                      >
                        {pageState.selectedCertificate.eventName}
                      </MDTypography>
                    </MDBox>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          📜 Certificate Information
                        </MDTypography>
                        <InfoItem
                          label="Certificate ID"
                          value={pageState.selectedCertificate.certificateId}
                          icon={<Verified fontSize="small" />}
                        />
                        <InfoItem
                          label="Issued Date"
                          value={new Date(
                            pageState.selectedCertificate.issuedAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          icon={<CalendarToday fontSize="small" />}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          🎯 Event Details
                        </MDTypography>
                        <InfoItem
                          label="Category"
                          value={pageState.selectedCertificate.event?.category}
                          icon={<Verified fontSize="small" />}
                        />
                        <InfoItem
                          label="Location"
                          value={pageState.selectedCertificate.event?.location}
                          icon={<Place fontSize="small" />}
                        />
                        <InfoItem
                          label="Issued By"
                          value={pageState.selectedCertificate.issuer?.name}
                          icon={<Person fontSize="small" />}
                        />
                      </Grid>
                    </Grid>

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
                        onClick={() => handleDownload(pageState.selectedCertificate)}
                        startIcon={<Download />}
                        fullWidth={isMobile}
                      >
                        Download Certificate
                      </MDButton>
                      <MDButton
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          copyVerificationLink(pageState.selectedCertificate.certificateId)
                        }
                        startIcon={<Link />}
                        fullWidth={isMobile}
                      >
                        Copy Verification Link
                      </MDButton>
                    </MDBox>

                    <MDBox textAlign="center" mt={3}>
                      <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
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
      </Container>
    </Box>
  );
};

export default MyCertificates;
