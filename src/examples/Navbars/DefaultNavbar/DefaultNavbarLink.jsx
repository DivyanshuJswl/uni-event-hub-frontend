import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DefaultNavbarLink({ icon, name, route, light = false }) {
  // Memoized icon color
  const iconColor = useMemo(
    () =>
      ({ palette: { white, secondary } }) =>
        light ? white.main : secondary.main,
    [light]
  );

  return (
    <MDBox
      component={Link}
      to={route}
      mx={1}
      p={1}
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer", userSelect: "none" }}
    >
      <Icon sx={{ color: iconColor, verticalAlign: "middle" }}>{icon}</Icon>
      <MDTypography
        variant="button"
        fontWeight="regular"
        color={light ? "white" : "dark"}
        textTransform="capitalize"
        sx={{ width: "100%", lineHeight: 0 }}
      >
        &nbsp;{name}
      </MDTypography>
    </MDBox>
  );
}

DefaultNavbarLink.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool,
};

DefaultNavbarLink.displayName = "DefaultNavbarLink";

export default memo(DefaultNavbarLink);
