// react-router components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, description, info, social, action, shadow }) {
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Format specific fields with special display logic
  const formatValue = (key, value) => {
    switch (key) {
      case "year":
        return `Year ${value}`;
      case "branch":
        return value.toUpperCase();
      case "metaMaskAddress":
        return value ? (
          <Tooltip title={value} placement="top">
            <Chip
              label={`${value.substring(0, 6)}...${value.substring(value.length - 4)}`}
              size="small"
            />
          </Tooltip>
        ) : (
          "Not connected"
        );
      case "role":
        return (
          <Chip
            label={value}
            color={value === "admin" ? "error" : value === "organizer" ? "warning" : "success"}
            size="small"
          />
        );
      case "tokens":
        return value.length > 0 ? `${value.length} active tokens` : "No active tokens";
      default:
        return value;
    }
  };

  // Prepare the info items for rendering
  const renderItems = Object.entries(info).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    const formattedValue = formatValue(key, value);

    return (
      <MDBox key={key} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {formattedKey}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{formattedValue}
        </MDTypography>
      </MDBox>
    );
  });

  // Render the card social media icons
  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {action && (
          <MDTypography component={Link} to={action.route} variant="body2" color="secondary">
            <Tooltip title={action.tooltip} placement="top">
              <Icon>edit</Icon>
            </Tooltip>
          </MDTypography>
        )}
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

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  action: null,
  social: [],
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.shape({
    name: PropTypes.string,
    year: PropTypes.number,
    email: PropTypes.string,
    branch: PropTypes.oneOf(["CSE", "ECE", "EEE", "ME", "CE", "IT"]),
    metaMaskAddress: PropTypes.string,
    role: PropTypes.oneOf(["participant", "organizer", "admin"]),
    tokens: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
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
      ]),
    })
  ),
  action: PropTypes.shape({
    route: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
