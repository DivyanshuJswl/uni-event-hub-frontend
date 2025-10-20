import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
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

const CertificateVerification = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { certificateId } = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    verifyCertificate();
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/certificates/verify/${certificateId}`);
      setVerificationData(response.data);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "Failed to verify certificate");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Info Item Component with better MDTypography usage
  const InfoItem = ({ label, value, icon, children, highlight = false }) => (
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
          sx={{
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.7rem",
            mb: 0.5,
          }}
        >
          {label}
        </MDTypography>
        {children || (
          <MDTypography
            variant="body2"
            color="text"
            sx={{
              opacity: 0.9,
              lineHeight: 1.4,
              fontWeight: highlight ? 600 : 400,
            }}
          >
            {value || "Not specified"}
          </MDTypography>
        )}
      </Box>
    </MDBox>
  );

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

  // Enhanced loading state with better MDTypography
  if (loading) {
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
          <MDTypography variant="h5" fontWeight="bold" color="text" gutterBottom>
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

  // Enhanced error state with better MDTypography
  if (error) {
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
              background: darkMode
                ? "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)"
                : "linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(211, 47, 47, 0.02) 100%)",
              border: `1px solid ${darkMode ? "rgba(211, 47, 47, 0.3)" : "rgba(211, 47, 47, 0.2)"}`,
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
              <ErrorIcon
                sx={{
                  fontSize: 72,
                  color: "error.main",
                  mb: 3,
                }}
              />
              <MDTypography variant="h3" fontWeight="bold" gutterBottom color="error">
                Verification Failed
              </MDTypography>
            </MDBox>
            <MDTypography variant="h6" color="text" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.5 }}>
              {error}
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
                sx={{ borderRadius: 2 }}
              >
                Try Again
              </MDButton>
              <MDButton
                variant="outlined"
                color="primary"
                onClick={() => (window.location.href = "/")}
                sx={{ borderRadius: 2 }}
              >
                Go Home
              </MDButton>
            </MDBox>
          </Card>
        </Container>
      </Box>
    );
  }

  const { certificate, verification } = verificationData.data;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: isMobile ? 2 : 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          {/* Enhanced Header with better MDTypography */}
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
              sx={{ lineHeight: 1.2, color: verification.isValid ? "success.main" : "error.main" }}
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
                backgroundColor: verification.isValid ? "success.main" : "error.main",
                color: "white",
              }}
            />
          </MDBox>

          {/* Enhanced Certificate Details Card */}
          <Card
            sx={{
              borderRadius: isMobile ? 2 : 3,
              boxShadow: darkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.24)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {/* Enhanced Certificate Header */}
              <MDBox textAlign="center" mb={4}>
                <Chip
                  label={certificate.positionLabel || getPositionLabel(certificate.winnerPosition)}
                  color={getPositionColor(certificate.winnerPosition)}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 2 : 3,
                    fontWeight: "bold",
                    mb: 3,
                    backgroundColor:
                      theme.palette[getPositionColor(certificate.winnerPosition)].main,
                    color: "white",
                  }}
                />
                <MDTypography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="bold"
                  gutterBottom
                  color={sidenavColor}
                  sx={{ lineHeight: 1.3, mb: 2 }}
                >
                  {certificate.eventName}
                </MDTypography>
                <MDTypography variant="h6" color="text" sx={{ opacity: 0.8, fontWeight: 500 }}>
                  Awarded to <strong>{certificate.student?.name}</strong>
                </MDTypography>
              </MDBox>

              <Divider sx={{ mb: 4 }} />

              {/* Enhanced Certificate Information */}
              <Grid container spacing={isMobile ? 2 : 4}>
                {/* Certificate Details */}
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    color="text"
                    sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Link color="primary" />
                    Certificate Information
                  </MDTypography>

                  <MDBox>
                    <InfoItem
                      label="Certificate ID"
                      value={certificate.certificateId}
                      icon={<Link fontSize="small" />}
                      highlight
                    />

                    <InfoItem
                      label="Issued Date"
                      value={new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      icon={<CalendarToday fontSize="small" />}
                    />

                    <InfoItem
                      label="Status"
                      value={certificate.status}
                      icon={<Security fontSize="small" />}
                    />

                    {certificate.metaMaskAddress && (
                      <InfoItem label="Linked Wallet" icon={<Verified fontSize="small" />}>
                        <Chip
                          label={`${certificate.metaMaskAddress.substring(0, 6)}...${certificate.metaMaskAddress.substring(certificate.metaMaskAddress.length - 4)}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ maxWidth: "100%" }}
                        />
                      </InfoItem>
                    )}
                  </MDBox>
                </Grid>

                {/* Event Details */}
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    color="text"
                    sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <EmojiEvents color="primary" />
                    Event Details
                  </MDTypography>

                  <MDBox>
                    <InfoItem
                      label="Category"
                      value={certificate.event?.category}
                      icon={<EmojiEvents fontSize="small" />}
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
                    />

                    <InfoItem
                      label="Location"
                      value={certificate.event?.location}
                      icon={<Place fontSize="small" />}
                    />

                    <InfoItem
                      label="Issued By"
                      value={certificate.issuer?.name}
                      icon={<Person fontSize="small" />}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              {/* Enhanced Verification Status */}
              <Divider sx={{ my: 4 }} />
              <MDBox
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: darkMode
                    ? verification.isValid
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(244, 67, 54, 0.1)"
                    : verification.isValid
                      ? "rgba(76, 175, 80, 0.05)"
                      : "rgba(244, 67, 54, 0.05)",
                  border: `2px solid ${
                    darkMode
                      ? verification.isValid
                        ? "rgba(76, 175, 80, 0.3)"
                        : "rgba(244, 67, 54, 0.3)"
                      : verification.isValid
                        ? "rgba(76, 175, 80, 0.2)"
                        : "rgba(244, 67, 54, 0.2)"
                  }`,
                }}
              >
                <MDTypography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  color="text"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Security color={verification.isValid ? "success" : "error"} />
                  Verification Details
                </MDTypography>
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Verification Status",
                      value: verification.isValid ? "Valid" : "Invalid",
                      icon: (
                        <Verified
                          fontSize="small"
                          color={verification.isValid ? "success" : "error"}
                        />
                      ),
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
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <InfoItem
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                        highlight={item.highlight}
                      />
                    </Grid>
                  ))}
                </Grid>
              </MDBox>

              {/* Enhanced Additional Metadata */}
              {certificate.metadata && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <MDBox>
                    <MDTypography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      color="text"
                      sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <EmojiEvents color="primary" />
                      Additional Information
                    </MDTypography>
                    <MDBox sx={{ pl: 1 }}>
                      <MDTypography
                        variant="body1"
                        color="text"
                        sx={{
                          opacity: 0.9,
                          lineHeight: 1.7,
                          mb: certificate.metadata.skills?.length ? 3 : 0,
                          fontStyle: "italic",
                        }}
                      >
                        {certificate.metadata.description ||
                          `Awarded for outstanding performance in ${certificate.eventName}`}
                      </MDTypography>

                      {certificate.metadata.skills && certificate.metadata.skills.length > 0 && (
                        <MDBox>
                          <MDTypography
                            variant="caption"
                            fontWeight="bold"
                            color="text"
                            display="block"
                            mb={2}
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                          >
                            Skills Recognized:
                          </MDTypography>
                          <MDBox display="flex" flexWrap="wrap" gap={1}>
                            {certificate.metadata.skills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="medium"
                                variant="outlined"
                                color="primary"
                                sx={{
                                  fontSize: "0.8rem",
                                  height: 32,
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

              {/* Enhanced Security Note */}
              <MDBox
                textAlign="center"
                mt={4}
                p={3}
                sx={{
                  borderRadius: 2,
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
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
                  sx={{
                    opacity: 0.8,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
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
