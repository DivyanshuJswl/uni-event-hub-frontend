import { useEffect, useCallback, useMemo, memo } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import brandImage from "../../assets/images/Untitled design_prev_ui.png";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";

function Sidenav({ color = "info", brand = "", brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, role, logout } = useAuth();
  const { showToast } = useNotifications();

  // Memoized values
  const collapseName = useMemo(() => location.pathname.replace("/", ""), [location.pathname]);
  const isAuthenticated = useMemo(() => !!token, [token]);
  const userRole = useMemo(() => role, [role]);

  // Memoized text color
  const textColor = useMemo(() => {
    if (transparentSidenav || (whiteSidenav && !darkMode)) {
      return "dark";
    } else if (whiteSidenav && darkMode) {
      return "inherit";
    }
    return "white";
  }, [transparentSidenav, whiteSidenav, darkMode]);

  // Memoized close sidenav handler
  const closeSidenav = useCallback(() => {
    setMiniSidenav(dispatch, true);
  }, [dispatch]);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();

      if (result.success) {
        showToast("Logged out successfully", "success", "Goodbye!");
        setTimeout(() => navigate("/authentication/sign-in"), 1000);
      } else {
        showToast(result.message || "Logout failed. Please try again.", "error", "Logout Failed");
      }
    } catch (error) {
      showToast("An error occurred during logout", "error", "Logout Error");
      console.error("Logout error:", error);
    }
  }, [logout, showToast, navigate]);

  // Handle responsive sidenav
  useEffect(() => {
    const handleMiniSidenav = () => {
      const isMobile = window.innerWidth < 1200;
      setMiniSidenav(dispatch, isMobile);
      setTransparentSidenav(dispatch, isMobile ? false : transparentSidenav);
      setWhiteSidenav(dispatch, isMobile ? false : whiteSidenav);
    };

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav, location]);

  // Memoized filtered routes
  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      // Skip hidden routes in sidebar
      if (route.hidden) return false;

      // Custom show function has highest priority
      if (route.show) {
        return route.show(userRole ? { role: userRole } : null);
      }

      // Admin sees everything
      if (userRole === "admin") return true;

      // Sign In/Sign Up routes
      if (route.key === "sign-in" || route.key === "sign-up") {
        return !isAuthenticated;
      }

      // Public routes
      if (route.public) {
        if (route.hideWhenAuthenticated && isAuthenticated) return false;
        if (route.devOnly) return false;
        return true;
      }

      // Authenticated routes
      if (route.authenticated) {
        return isAuthenticated;
      }

      // Role-specific routes
      if (route.roles) {
        return isAuthenticated && route.roles.includes(userRole);
      }

      return false;
    });
  }, [routes, userRole, isAuthenticated]);

  // Memoized rendered routes
  const renderRoutes = useMemo(() => {
    return filteredRoutes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
      if (type === "collapse") {
        return href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
          </NavLink>
        );
      } else if (type === "title") {
        return (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        return (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }
      return null;
    });
  }, [filteredRoutes, collapseName, textColor, darkMode, whiteSidenav, transparentSidenav]);

  // Memoized divider light prop
  const dividerLight = useMemo(() => {
    return (
      (!darkMode && !whiteSidenav && !transparentSidenav) ||
      (darkMode && !transparentSidenav && whiteSidenav)
    );
  }, [darkMode, whiteSidenav, transparentSidenav]);

  // Check if current page is profile page
  const isProfileActive = useMemo(() => {
    return location.pathname.includes("/profile/");
  }, [location.pathname]);

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h2" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brandImage} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            p={1.5}
          >
            <MDTypography component="h2" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider light={dividerLight} />
      <List>{renderRoutes}</List>
      {user && user.username && (
        <NavLink to={`/profile/${user.username}`}>
          <SidenavCollapse
            name="Profile"
            icon={<Icon fontSize="small">person</Icon>}
            active={isProfileActive}
          />
        </NavLink>
      )}
      <MDBox p={2} mt="auto" display="flex" flexDirection="column">
        {isAuthenticated && (
          <MDButton
            variant="gradient"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{ mb: 1 }}
          >
            <Icon sx={{ mr: 1 }}>logout</Icon>
            LOG OUT
          </MDButton>
        )}

        <MDButton
          component="a"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxvfz-KIGL_5K6vOdyK5RgW0vHUJA8HE6xkGU0gE94HesnAA/viewform?usp=sharing&ouid=110758534365460544145"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
        >
          Feedback Form
        </MDButton>
        <MDButton
          component="a"
          href="https://www.linkedin.com/in/divyanshujswl/"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color={sidenavColor}
          fullWidth
        >
          CONTACT US
        </MDButton>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "Sidenav";

export default memo(Sidenav);
