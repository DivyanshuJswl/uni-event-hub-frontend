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
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import {
  Verified,
  Error as ErrorIcon,
  CalendarToday,
  Place,
  Person,
  Link,
  EmojiEvents,
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

  // Info Item Component for consistent styling
  const InfoItem = ({ label, value, icon, children }) => (
    <MDBox display="flex" alignItems="flex-start" gap={1.5} py={1.5}>
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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: darkMode ? "background.default" : "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            mx: "auto",
            textAlign: "center",
            p: 4,
          }}
        >
          <CircularProgress size={60} color={sidenavColor} sx={{ mb: 3 }} />
          <MDTypography variant="h6" color="text" fontWeight="medium">
            Verifying Certificate...
          </MDTypography>
          <MDTypography variant="body2" color="text" sx={{ opacity: 0.7, mt: 1 }}>
            Please wait while we verify the certificate authenticity
          </MDTypography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: darkMode ? "background.default" : "grey.100",
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
              p: 4,
              background: darkMode
                ? "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)"
                : "linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(211, 47, 47, 0.02) 100%)",
              border: `1px solid ${darkMode ? "rgba(211, 47, 47, 0.3)" : "rgba(211, 47, 47, 0.2)"}`,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 64,
                color: "error.main",
                mb: 3,
              }}
            />
            <MDTypography variant="h4" fontWeight="bold" gutterBottom color="error">
              Verification Failed
            </MDTypography>
            <MDTypography variant="body1" color="text" sx={{ opacity: 0.8, mb: 3 }}>
              {error}
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ opacity: 0.6 }}>
              The certificate could not be verified. Please check the certificate ID and try again.
            </MDTypography>
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
        backgroundColor: darkMode ? "background.default" : "grey.100",
        py: isMobile ? 2 : 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          {/* Header */}
          <MDBox textAlign="center" mb={isMobile ? 3 : 4}>
            <Verified
              sx={{
                fontSize: 64,
                color: verification.isValid ? "success.main" : "error.main",
                mb: 2,
              }}
            />
            <Typography
              variant={isMobile ? "h3" : "h2"}
              sx={{
                fontWeight: 700,
                color: verification.isValid
                  ? darkMode
                    ? "success.light"
                    : "success.main"
                  : darkMode
                    ? "error.light"
                    : "error.main",
                mb: 1,
              }}
            >
              {verification.isValid ? "Certificate Verified" : "Certificate Invalid"}
            </Typography>
            <Chip
              label={verification.isValid ? "VALID" : "INVALID"}
              color={verification.isValid ? "success" : "error"}
              size="large"
              sx={{
                fontSize: "1.1rem",
                py: 1.5,
                px: 3,
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
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 4 }}>
              {/* Certificate Header */}
              <MDBox textAlign="center" mb={4}>
                <Chip
                  label={certificate.positionLabel || getPositionLabel(certificate.winnerPosition)}
                  color={getPositionColor(certificate.winnerPosition)}
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
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="bold"
                  gutterBottom
                  color={sidenavColor}
                  sx={{ lineHeight: 1.3 }}
                >
                  {certificate.eventName}
                </MDTypography>
                <MDTypography variant="body1" color="text" sx={{ opacity: 0.8 }}>
                  Awarded to {certificate.student?.name}
                </MDTypography>
              </MDBox>

              <Divider sx={{ mb: 4 }} />

              {/* Certificate Information */}
              <Grid container spacing={isMobile ? 2 : 4}>
                {/* Certificate Details */}
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h6"
                    fontWeight="medium"
                    gutterBottom
                    color="text"
                    sx={{ fontSize: isMobile ? "1rem" : "1.125rem", mb: 3 }}
                  >
                    📜 Certificate Information
                  </MDTypography>

                  <MDBox sx={{ pl: isMobile ? 0 : 1 }}>
                    <InfoItem
                      label="Certificate ID"
                      value={certificate.certificateId}
                      icon={<Link fontSize="small" />}
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
                      icon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: certificate.status === "issued" ? "success.main" : "grey.500",
                            mt: 0.5,
                          }}
                        />
                      }
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
                    variant="h6"
                    fontWeight="medium"
                    gutterBottom
                    color="text"
                    sx={{ fontSize: isMobile ? "1rem" : "1.125rem", mb: 3 }}
                  >
                    🎯 Event Details
                  </MDTypography>

                  <MDBox sx={{ pl: isMobile ? 0 : 1 }}>
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

              {/* Verification Status */}
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
                  border: `1px solid ${
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
                <MDTypography variant="h6" fontWeight="medium" gutterBottom color="text">
                  🔍 Verification Details
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      label="Verification Status"
                      value={verification.isValid ? "Valid" : "Invalid"}
                      icon={
                        <Verified
                          fontSize="small"
                          color={verification.isValid ? "success" : "error"}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      label="Blockchain Verified"
                      value={verification.blockchainVerified ? "Yes" : "No"}
                      icon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: verification.blockchainVerified ? "success.main" : "grey.500",
                            mt: 0.5,
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      label="Certificate Status"
                      value={certificate.status}
                      icon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: certificate.status === "issued" ? "success.main" : "grey.500",
                            mt: 0.5,
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      label="Verification Date"
                      value={new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      icon={<CalendarToday fontSize="small" />}
                    />
                  </Grid>
                </Grid>
              </MDBox>

              {/* Additional Metadata */}
              {certificate.metadata && (
                <>
                  <Divider sx={{ my: 4 }} />
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
                          mb: certificate.metadata.skills?.length ? 2 : 0,
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
                            mb={1}
                          >
                            Skills Recognized:
                          </MDTypography>
                          <MDBox display="flex" flexWrap="wrap" gap={1}>
                            {certificate.metadata.skills.map((skill, index) => (
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

              {/* Security Note */}
              <MDBox textAlign="center" mt={4}>
                <MDTypography
                  variant="caption"
                  color="text"
                  sx={{
                    opacity: 0.7,
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  🔒 This certificate has been verified through our secure system.
                  {verification.blockchainVerified &&
                    " The certificate is also verified on the blockchain for enhanced security."}
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
