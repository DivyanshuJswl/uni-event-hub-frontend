import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";
import {
  Verified,
  Error as ErrorIcon,
  CalendarToday,
  Place,
  Person,
  Link,
  EmojiEvents,
  Security,
  Refresh,
} from "@mui/icons-material";
import axios from "axios";

// Memoized Info Item Component
const InfoItem = memo(
  ({ label, value, icon, children, highlight = false, darkMode, sidenavColor }) => (
    <MDBox
      display="flex"
      alignItems="flex-start"
      gap={2}
      py={1.5}
      sx={{
        borderRadius: 1,
        px: 1,
        backgroundColor: highlight
          ? darkMode
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.02)"
          : "transparent",
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          mt: 0.25,
          minWidth: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <MDTypography
          variant="caption"
          fontWeight="bold"
          color={highlight ? sidenavColor : "text"}
          display="block"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.7rem", mb: 0.5 }}
        >
          {label}
        </MDTypography>
        {children || (
          <MDTypography
            variant="body2"
            color="text"
            sx={{ opacity: 0.9, lineHeight: 1.4, fontWeight: highlight ? 600 : 400 }}
          >
            {value || "Not specified"}
          </MDTypography>
        )}
      </Box>
    </MDBox>
  )
);

InfoItem.displayName = "InfoItem";

const CertificateVerification = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { certificateId } = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { showToast } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Consolidated state
  const [pageState, setPageState] = useState({
    verificationData: null,
    loading: true,
    error: null,
  });

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

  // Memoized verification function
  const verifyCertificate = useCallback(async () => {
    setPageState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/verify/${certificateId}`, {
        timeout: 10000,
      });

      setPageState({
        verificationData: response.data,
        loading: false,
        error: null,
      });

      const isValid = response.data?.data?.verification?.isValid;
      showToast(
        isValid ? "Certificate verified successfully" : "Certificate verification failed",
        isValid ? "success" : "warning",
        "Verification Complete"
      );
    } catch (err) {
      console.error("Verification error:", err);
      const errorMessage =
        err.response?.data?.message || err.code === "ECONNABORTED"
          ? "Request timeout"
          : "Failed to verify certificate";

      setPageState({
        verificationData: null,
        loading: false,
        error: errorMessage,
      });

      showToast(errorMessage, "error", "Verification Failed");
    }
  }, [BASE_URL, certificateId, showToast]);

  // Initial verification
  useEffect(() => {
    verifyCertificate();
  }, [verifyCertificate]);

  // Memoized verification details data
  const verificationDetails = useMemo(() => {
    if (!pageState.verificationData) return [];

    const { certificate, verification } = pageState.verificationData.data;

    return [
      {
        label: "Verification Status",
        value: verification.isValid ? "Valid" : "Invalid",
        icon: <Verified fontSize="small" color={verification.isValid ? "success" : "error"} />,
        highlight: true,
      },
      {
        label: "Blockchain Verified",
        value: verification.blockchainVerified ? "Yes" : "No",
        icon: (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: verification.blockchainVerified ? "success.main" : "grey.500",
              mt: 0.5,
            }}
          />
        ),
      },
      {
        label: "Certificate Status",
        value: certificate.status,
        icon: (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: certificate.status === "issued" ? "success.main" : "grey.500",
              mt: 0.5,
            }}
          />
        ),
      },
      {
        label: "Verification Date",
        value: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        icon: <CalendarToday fontSize="small" />,
      },
    ];
  }, [pageState.verificationData]);

  // Loading state
  if (pageState.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            maxWidth: 450,
            mx: "auto",
            textAlign: "center",
            p: 5,
            borderRadius: 3,
            boxShadow: darkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.24)"
              : "0 8px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          <CircularProgress size={70} color={sidenavColor} sx={{ mb: 3 }} />
          <MDTypography variant="h5" fontWeight="bold" gutterBottom>
            Verifying Certificate
          </MDTypography>
          <MDTypography variant="body2" color="text" sx={{ opacity: 0.7, mb: 3 }}>
            Please wait while we verify the certificate authenticity
          </MDTypography>
          <MDTypography variant="caption" color="text" sx={{ opacity: 0.5 }}>
            Certificate ID: {certificateId}
          </MDTypography>
        </Card>
      </Box>
    );
  }

  // Error state
  if (pageState.error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              textAlign: "center",
              p: 5,
              borderRadius: 3,
              boxShadow: darkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.24)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <ErrorIcon sx={{ fontSize: 72, color: "error.main", mb: 3 }} />
              <MDTypography variant="h3" fontWeight="bold" gutterBottom color="error">
                Verification Failed
              </MDTypography>
            </MDBox>
            <MDTypography variant="h6" color="text" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.5 }}>
              {pageState.error}
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ opacity: 0.6, mb: 4 }}>
              The certificate could not be verified. Please check the certificate ID and try again.
            </MDTypography>
            <MDBox display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <MDButton
                onClick={verifyCertificate}
                variant="gradient"
                color="error"
                startIcon={<Refresh />}
              >
                Try Again
              </MDButton>
              <MDButton
                variant="outlined"
                color="primary"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </MDButton>
            </MDBox>
          </Card>
        </Container>
      </Box>
    );
  }

  const { certificate, verification } = pageState.verificationData.data;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", py: isMobile ? 2 : 4 }}>
      <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          {/* Header */}
          <MDBox textAlign="center" mb={isMobile ? 4 : 5}>
            <Verified
              sx={{
                fontSize: isMobile ? 56 : 72,
                color: verification.isValid ? "success.main" : "error.main",
                mb: 3,
              }}
            />
            <MDTypography
              variant={isMobile ? "h3" : "h2"}
              fontWeight="bold"
              gutterBottom
              sx={{ color: verification.isValid ? "success.main" : "error.main" }}
            >
              {verification.isValid ? "Certificate Verified" : "Certificate Invalid"}
            </MDTypography>
            <Chip
              icon={verification.isValid ? <Verified /> : <ErrorIcon />}
              label={verification.isValid ? "VALID & SECURE" : "INVALID CERTIFICATE"}
              color={verification.isValid ? "success" : "error"}
              size="large"
              sx={{
                fontSize: isMobile ? "0.9rem" : "1.1rem",
                py: isMobile ? 1 : 1.5,
                px: isMobile ? 2 : 3,
                fontWeight: "bold",
              }}
            />
          </MDBox>

          {/* Certificate Details Card */}
          <Card
            sx={{
              borderRadius: isMobile ? 2 : 3,
              boxShadow: darkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.24)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {/* Certificate Header */}
              <MDBox textAlign="center" mb={4}>
                <Chip
                  label={getPositionLabel(certificate.winnerPosition)}
                  color={getPositionColor(certificate.winnerPosition)}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 2 : 3,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                />
                <MDTypography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="bold"
                  gutterBottom
                  color={sidenavColor}
                >
                  {certificate.eventName}
                </MDTypography>
                <MDTypography variant="h6" color="text" sx={{ opacity: 0.8, fontWeight: 500 }}>
                  Awarded to <strong>{certificate.student?.name}</strong>
                </MDTypography>
              </MDBox>

              <Divider sx={{ mb: 4 }} />

              {/* Certificate Information */}
              <Grid container spacing={isMobile ? 2 : 4}>
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Link color="primary" />
                    Certificate Information
                  </MDTypography>
                  <InfoItem
                    label="Certificate ID"
                    value={certificate.certificateId}
                    icon={<Link fontSize="small" />}
                    highlight
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                  <InfoItem
                    label="Issued Date"
                    value={new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    icon={<CalendarToday fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                  <InfoItem
                    label="Status"
                    value={certificate.status}
                    icon={<Security fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <EmojiEvents color="primary" />
                    Event Details
                  </MDTypography>
                  <InfoItem
                    label="Category"
                    value={certificate.event?.category}
                    icon={<EmojiEvents fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                  <InfoItem
                    label="Event Date"
                    value={
                      certificate.event?.date
                        ? new Date(certificate.event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not specified"
                    }
                    icon={<CalendarToday fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                  <InfoItem
                    label="Location"
                    value={certificate.event?.location}
                    icon={<Place fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                  <InfoItem
                    label="Issued By"
                    value={certificate.issuer?.name}
                    icon={<Person fontSize="small" />}
                    darkMode={darkMode}
                    sidenavColor={sidenavColor}
                  />
                </Grid>
              </Grid>

              {/* Verification Status */}
              <Divider sx={{ my: 4 }} />
              <MDBox
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: verification.isValid
                    ? darkMode
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(76, 175, 80, 0.05)"
                    : darkMode
                      ? "rgba(244, 67, 54, 0.1)"
                      : "rgba(244, 67, 54, 0.05)",
                }}
              >
                <MDTypography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Security color={verification.isValid ? "success" : "error"} />
                  Verification Details
                </MDTypography>
                <Grid container spacing={2}>
                  {verificationDetails.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <InfoItem {...item} darkMode={darkMode} sidenavColor={sidenavColor} />
                    </Grid>
                  ))}
                </Grid>
              </MDBox>

              {/* Security Note */}
              <MDBox
                textAlign="center"
                mt={4}
                p={3}
                sx={{
                  borderRadius: 2,
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                }}
              >
                <Security
                  sx={{
                    fontSize: 32,
                    color: verification.isValid ? "success.main" : "error.main",
                    mb: 2,
                  }}
                />
                <MDTypography
                  variant="body2"
                  color="text"
                  sx={{ opacity: 0.8, lineHeight: 1.6, fontWeight: 500 }}
                >
                  🔒 This certificate has been verified through our secure system.
                  {verification.blockchainVerified &&
                    " The certificate is also verified on the blockchain for enhanced security and immutability."}
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default CertificateVerification;
