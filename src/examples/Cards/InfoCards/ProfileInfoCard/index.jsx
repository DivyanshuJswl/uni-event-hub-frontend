import { useMemo, memo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import CodeIcon from "@mui/icons-material/Code";
import { height } from "@mui/system";

// Social platform configurations for color fallback
const SOCIAL_PLATFORMS = {
  linkedin: { label: "LinkedIn", icon: <LinkedInIcon />, color: "#0077B5" },
  github: { label: "GitHub", icon: <GitHubIcon />, color: "#24292E" },
  twitter: { label: "Twitter", icon: <TwitterIcon />, color: "#1DA1F2" },
  facebook: { label: "Facebook", icon: <FacebookIcon />, color: "#3B5998" },
  instagram: { label: "Instagram", icon: <InstagramIcon />, color: "#E1306C" },
  pinterest: { label: "Pinterest", icon: <PinterestIcon />, color: "#E60023" },
  youtube: { label: "YouTube", icon: <YouTubeIcon />, color: "#FF0000" },
  leetcode: { label: "LeetCode", icon: <CodeIcon />, color: "#FFA116" },
  website: { label: "Website", icon: <LanguageIcon />, color: "#666666" },
};

function ProfileInfoCard({ title = "", description = "", social = [], shadow = true, info = {} }) {
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Memoized user info formatting
  const userInfo = useMemo(() => {
    if (!info) return {};
    return {
      username: info.username || "",
      name: info.name || "",
      year: info.year || "",
      email: info.email || "",
      branch: info.branch || "",
      metaMaskAddress: info.metaMaskAddress || "Not linked",
      role: info.role || "Not set",
      isVerified: info.isVerified ? "Verified" : "Not Verified",
    };
  }, [info]);

  // Memoized format value function
  const formatValue = useMemo(() => {
    return (key, value) => {
      switch (key) {
        case "metaMaskAddress":
          return value && value !== "Not linked" ? (
            <Tooltip title={value} placement="top">
              <Chip
                label={`${value.substring(0, 4)}...${value.substring(value.length - 4)}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Tooltip>
          ) : (
            "Not linked"
          );
        case "role":
          return (
            <Chip
              label={value}
              color={value === "admin" ? "error" : value === "organizer" ? "warning" : "success"}
              size="small"
              variant="outlined"
            />
          );
        case "isVerified":
          return (
            <Chip
              label={value}
              color={value === "Verified" ? "success" : "error"}
              size="small"
              variant="outlined"
            />
          );
        default:
          return value || "Not set";
      }
    };
  }, []);

  // Memoized render items
  const renderItems = useMemo(() => {
    return Object.entries(userInfo).map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      const formattedValue = formatValue(key, value);

      if (formattedValue === undefined || formattedValue === "" || formattedKey === "Name")
        return null;

      return (
        <MDBox key={key} display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            {formattedKey}: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            {formattedValue}
          </MDTypography>
        </MDBox>
      );
    });
  }, [userInfo, formatValue]);

  // Memoized social rendering
  const renderSocial = useMemo(() => {
    return social.map(({ link, icon, color }) => (
      <MDBox
        key={color}
        component="a"
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        fontSize={size.lg}
        color={socialMediaColors[color]?.main || SOCIAL_PLATFORMS[color]?.color || "#666"}
        pr={1}
        pl={0.5}
        lineHeight={1}
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)",
            opacity: 0.8,
          },
        }}
      >
        {icon}
      </MDBox>
    ));
  }, [social, size.lg, socialMediaColors]);

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          {renderItems}
          {social.length > 0 && (
            <>
              <MDBox opacity={0.3}>
                <Divider />
              </MDBox>
              <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  Social: &nbsp;
                </MDTypography>
                {renderSocial}
              </MDBox>
            </>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

ProfileInfoCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      icon: PropTypes.node,
      color: PropTypes.oneOf([
        "facebook",
        "twitter",
        "instagram",
        "linkedin",
        "pinterest",
        "youtube",
        "github",
        "leetcode",
      ]),
    })
  ),
  shadow: PropTypes.bool,
  info: PropTypes.object,
};

ProfileInfoCard.displayName = "ProfileInfoCard";

export default memo(ProfileInfoCard);
