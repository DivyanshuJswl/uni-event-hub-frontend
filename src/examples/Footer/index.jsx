import React from "react";
import { Grid, Link, IconButton, Box } from "@mui/material";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Facebook, Twitter, Instagram, LinkedIn, Email, LocationOn } from "@mui/icons-material";

const Footer = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <LinkedIn />, url: "https://linkedin.com", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: "Browse Events", url: "/events" },
    { label: "Create Event", url: "/create-event" },
    { label: "My Certificates", url: "/my-certificate" },
    { label: "Leaderboard", url: "/leaderboard" },
    { label: "About Us", url: "/about" },
    { label: "Contact Support", url: "/support" },
  ];

  return (
    <MDBox
      component="footer"
      sx={{
        width: "100%",
        py: 3,
        px: { xs: 2, sm: 3, md: 4 },
        borderTop: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={3}
        maxWidth="xl"
        sx={{
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Brand Section */}
        <Grid item xs={12} md={4}>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box>
              <MDTypography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  background: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Uni-Event Hub
              </MDTypography>
              <MDTypography
                variant="body2"
                color="text"
                fontWeight="regular"
                sx={{ lineHeight: 1.6, mb: 2 }}
              >
                Connecting students through amazing events and experiences. Your one-stop platform
                for university events, workshops, and competitions.
              </MDTypography>
            </Box>

            <Box>
              <MDBox
                display="flex"
                gap={1}
                mb={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: darkMode ? "#fff" : "primary.main",
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(25, 118, 210, 0.1)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: darkMode
                          ? "0 4px 12px rgba(79, 172, 254, 0.3)"
                          : "0 4px 12px rgba(25, 118, 210, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </MDBox>

              <MDBox>
                <MDTypography variant="body2" color="text" fontWeight="medium" sx={{ mb: 0.5 }}>
                  Made with ❤️ by:
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={{ lineHeight: 1.6 }}>
                  Suhail Sama • Divyanshu Jaiswal
                </MDTypography>
              </MDBox>
            </Box>
          </MDBox>
        </Grid>

        {/* Navigation Links Section */}
        <Grid item xs={12} sm={6} md={4}>
          <MDTypography
            variant="h6"
            fontWeight="bold"
            color={darkMode ? "white" : "dark"}
            sx={{ mb: 2, textAlign: { xs: "center", sm: "left" } }}
          >
            Navigation
          </MDTypography>
          <Grid container spacing={1}>
            {quickLinks.map((link, index) => (
              <Grid item xs={6} key={index}>
                <Link
                  href={link.url}
                  underline="none"
                  sx={{
                    color: "text",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    py: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  <span style={{ fontSize: "0.7rem" }}>›</span> {link.label}
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Contact Info Section */}
        <Grid item xs={12} sm={6} md={4}>
          <MDTypography
            variant="h6"
            fontWeight="bold"
            color={darkMode ? "white" : "dark"}
            sx={{ mb: 2, textAlign: { xs: "center", sm: "left" } }}
          >
            Contact Info
          </MDTypography>

          <MDBox sx={{ mb: 3 }}>
            <MDBox display="flex" alignItems="flex-start" gap={1} mb={2}>
              <LocationOn
                sx={{
                  color: "primary.main",
                  fontSize: "1.1rem",
                  mt: 0.1,
                  flexShrink: 0,
                }}
              />
              <MDTypography
                variant="body2"
                color="text"
                sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}
              >
                Chandigarh University, Mohali, Punjab - 140413
              </MDTypography>
            </MDBox>

            <MDBox display="flex" alignItems="center" gap={1} mb={3}>
              <Email
                sx={{
                  color: "primary.main",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              />
              <MDTypography variant="body2" color="text" sx={{ fontSize: "0.9rem" }}>
                suhailsama89@gmail.com
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Testimonial */}
          <MDBox
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: darkMode ? "rgba(79, 172, 254, 0.1)" : "rgba(25, 118, 210, 0.1)",
              borderLeft: `3px solid`,
              borderColor: "primary.main",
            }}
          >
            <MDTypography
              variant="body2"
              color="text"
              sx={{
                fontStyle: "italic",
                lineHeight: 1.5,
                fontSize: "0.9rem",
              }}
            >
              "The best event management platform we've used. Highly recommended for university
              students and organizers!"
            </MDTypography>
            <MDTypography
              variant="caption"
              color="text"
              sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
            >
              — Happy Student Organizer
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default Footer;
