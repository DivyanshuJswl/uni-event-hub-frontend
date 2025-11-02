import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon, title, route, light = false }) {
  // Memoized routes calculation
  const routes = useMemo(() => {
    return Array.isArray(route) ? route.slice(0, -1) : [];
  }, [route]);

  // Memoized processed title
  const processedTitle = useMemo(() => {
    return title.replace(/-/g, " ");
  }, [title]);

  // Memoized breadcrumb styles
  const breadcrumbStyles = useMemo(
    () => ({
      "& .MuiBreadcrumbs-separator": {
        color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
      },
    }),
    [light]
  );

  // Memoized text colors
  const textColor = useMemo(() => (light ? "white" : "dark"), [light]);
  const textOpacity = useMemo(() => (light ? 0.8 : 0.5), [light]);

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs sx={breadcrumbStyles}>
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={textColor}
            opacity={textOpacity}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={textColor}
              opacity={textOpacity}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant="h6"
          fontWeight="bold"
          textTransform="capitalize"
          color={textColor}
          sx={{ lineHeight: 0 }}
        >
          {processedTitle}
        </MDTypography>
      </MuiBreadcrumbs>
    </MDBox>
  );
}

Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

Breadcrumbs.displayName = "Breadcrumbs";

export default memo(Breadcrumbs);
