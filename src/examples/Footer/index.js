import React from "react";
import { Grid, Link, IconButton } from "@mui/material";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Favorite,
} from "@mui/icons-material";

const Footer = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com" },
    { icon: <Twitter />, url: "https://twitter.com" },
    { icon: <Instagram />, url: "https://instagram.com" },
    { icon: <LinkedIn />, url: "https://linkedin.com" },
  ];

  const quickLinks = [
    { label: "Browse Events", url: "/events" },
    { label: "Create Event", url: "/create" },
    { label: "Certificates", url: "/certificates" },
  ];

  return (
    <MDBox
      component="footer"
      sx={{
        py: 2,
        px: { xs: 2, md: 6 },
        borderTop: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
        transition: "all 0.3s ease",
      }}
    >
      <Grid container spacing={2} maxWidth="xl" margin="0 0">
        <Grid item xs={12} md={4}>
          <MDBox mb={2}>
            <MDTypography
              variant="h4"
              fontWeight="bold"
              color={darkMode ? "white" : "dark"}
              sx={{
                mb: 1,
                background: darkMode
                  ? "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)"
                  : "linear-gradient(45deg, #3f51b5 0%, #2196f3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Uni-Event Hub
            </MDTypography>
            <MDTypography
              variant="body2"
              color={darkMode ? "white" : "text.primary"}
              fontWeight="regular"
              sx={{ lineHeight: 1.8 }}
            >
              Made By -
            </MDTypography>
            <MDTypography
              variant="body2"
              color={darkMode ? "white" : "text.primary"}
              sx={{ lineHeight: 1.8 }}
            >
              Divyanshu Jaiswal
              <br /> Suhail Sama
              <br /> Rupak Boral
              <br /> Satyam Singh
            </MDTypography>
          </MDBox>

          <MDBox display="flex" gap={2} mt={3}>
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener"
                sx={{
                  color: darkMode ? "#fff" : "#3f51b5",
                  backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(63, 81, 181, 0.1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    backgroundColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(63, 81, 181, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </MDBox>
        </Grid>

        <Grid item xs={12} md={3}>
          <MDTypography
            variant="h6"
            fontWeight="bold"
            color={darkMode ? "white" : "dark"}
            sx={{ mb: 2 }}
          >
            Quick Links
          </MDTypography>
          <MDBox component="ul" sx={{ listStyle: "none", p: 0 }}>
            {quickLinks.map((link, index) => (
              <MDBox
                key={index}
                component="li"
                sx={{
                  py: 1,
                  "&:hover": {
                    transform: "translateX(5px)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <Link
                  href={link.url}
                  underline="none"
                  sx={{
                    color: darkMode ? "white" : "text.primary",
                    "&:hover": {
                      color: darkMode ? "#4facfe" : "#3f51b5",
                      fontWeight: 500,
                    },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: "0.8rem" }}>›</span> {link.label}
                </Link>
              </MDBox>
            ))}
          </MDBox>
        </Grid>

        <Grid item xs={12} md={5}>
          <MDTypography
            variant="h6"
            fontWeight="bold"
            color={darkMode ? "white" : "dark"}
            sx={{ mb: 2 }}
          >
            Contact Info
          </MDTypography>

          <MDBox sx={{ mb: 2 }}>
            <MDBox display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOn
                sx={{
                  color: darkMode ? "#4facfe" : "#3f51b5",
                  fontSize: "1.2rem",
                }}
              />
              <MDTypography variant="body2" color={darkMode ? "white" : "text.primary"}>
                Chandigarh University, Mohali, Punjab - 140413
              </MDTypography>
            </MDBox>

            <MDBox display="flex" alignItems="center" gap={1} mb={1}>
              <Email
                sx={{
                  color: darkMode ? "#4facfe" : "#3f51b5",
                  fontSize: "1.2rem",
                }}
              />
              <MDTypography variant="body2" color={darkMode ? "white" : "text.primary"}>
                support@uniEventHub.com
              </MDTypography>
            </MDBox>

            {/* <MDBox display="flex" alignItems="center" gap={1}>
              <Phone
                sx={{
                  color: darkMode ? "#4facfe" : "#3f51b5",
                  fontSize: "1.2rem",
                }}
              />
              <MDTypography variant="body2" color={darkMode ? "white" : "text.primary"}>
                +1 (555) 123-4567
              </MDTypography>
            </MDBox> */}
          </MDBox>

          <MDBox
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: darkMode ? "rgba(79, 172, 254, 0.1)" : "rgba(63, 81, 181, 0.1)",
              borderLeft: `4px solid ${darkMode ? "#4facfe" : "#3f51b5"}`,
            }}
          >
            <MDTypography
              variant="body2"
              color={darkMode ? "white" : "text.primary"}
              sx={{ fontStyle: "italic" }}
            >
              The best event management platform we ve used. Highly recommended!
            </MDTypography>
            <MDTypography
              variant="caption"
              color={darkMode ? "white" : "text.primary"}
              sx={{ display: "block", mt: 1 }}
            >
              — Happy Customer
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default Footer;
