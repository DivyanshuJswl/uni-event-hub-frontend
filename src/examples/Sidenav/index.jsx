import { useEffect } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import brandImage from "../../assets/images/Untitled design_prev_ui.png";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const { developerMode } = controller; // Added developerMode from context
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    // Make API call to backend logout first
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    localStorage.clear();

    if (!localStorage.getItem("token")) {
      // Update toast to success
      toast.success("Logout successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect after toast closes
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 1000);
    }
  };

  // Get user authentication status and role
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const filteredRoutes = routes.filter((route) => {
    // 1. Developer mode routes - show all devOnly routes when developerMode is true
    if (developerMode && route.devOnly) {
      return true;
    }

    // Check if route has custom show function (highest priority)
    if (route.show) {
      return route.show(userRole ? { role: userRole } : null);
    }

    // 2. Handle Sign In/Sign Up routes specifically
    if (route.key === "sign-in" || route.key === "sign-up") {
      return !isAuthenticated; // Only show when not authenticated
    }

    // 3. Public routes (visible to everyone, including non-authenticated users)
    if (route.public) {
      // Hide public routes that should be hidden when authenticated
      if (route.hideWhenAuthenticated && isAuthenticated) return false;
      // Hide devOnly routes for non-developers
      if (route.devOnly) return false;
      return true;
    }

    // 4. Authenticated routes (no specific role required)
    if (route.authenticated) {
      return isAuthenticated;
    }

    // 5. Role-specific routes
    if (route.roles) {
      return isAuthenticated && route.roles.includes(userRole);
    }

    return false;
  });

  // Render the filtered routes
  const renderRoutes = filteredRoutes.map(
    ({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;

      if (type === "collapse") {
        returnValue = href ? (
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
        returnValue = (
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
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

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
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
      <MDBox p={2} mt="auto" display="flex" flexDirection="column">
        {/* Logout Button - Only shown when authenticated */}
        {isAuthenticated && (
          <MDButton
            variant="gradient"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{ mb: 1 }} // Add margin bottom to separate from Contact Us button
          >
            <Icon sx={{ mr: 1 }}>logout</Icon>
            LOG OUT
          </MDButton>
        )}
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

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
