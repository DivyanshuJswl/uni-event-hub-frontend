import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setDarkMode,
} from "context";
import { setDeveloperMode } from "context";
import MDTypography from "components/MDTypography";
import { Avatar } from "@mui/material";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, developerMode } =
    controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (developerMode) {
      console.log("%cDeveloper Mode Enabled", "color: #FFA500; font-size: 16px; font-weight: bold");
    }
  }, [developerMode]);
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleDeveloperModeToggle = () => {
    setDeveloperMode(dispatch, !developerMode);
  };
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);
  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const student = localStorage.getItem("student");
  const avatarUrl = student ? JSON.parse(student).avatar : null;
  const isAuthenticated = !!localStorage.getItem("token");

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Logout function
  const handleLogout = async () => {
    // Close the profile menu
    handleProfileMenuClose();
    // Remove user data from localStorage
    // Make API call to logout
    if (localStorage.getItem("role") !== "organizer") {
      try {
        const r = await axios.get(`${BASE_URL}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(r);
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
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("student");

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

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleProfileMenuOpen}
              >
                {avatarUrl ? (
                  <Avatar
                    title="Profile"
                    src={avatarUrl}
                    alt="User Avatar"
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Icon sx={iconsStyle} title="Profile">
                    account_circle
                  </Icon>
                )}
              </IconButton>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                sx={{ mt: 1 }}
              >
                {isAuthenticated
                  ? [
                      <MenuItem
                        key="profile"
                        onClick={() => {
                          setProfileMenuAnchor(null);
                          navigate("/profile");
                        }}
                      >
                        <Icon sx={{ mr: 1 }}>person</Icon> Profile
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        <Icon sx={{ mr: 1 }}>logout</Icon> Logout
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem
                        key="sign-in"
                        onClick={() => {
                          setProfileMenuAnchor(null);
                          navigate("/authentication/sign-in");
                        }}
                      >
                        <Icon sx={{ mr: 1 }}>login</Icon> Sign In
                      </MenuItem>,
                      <MenuItem
                        key="sign-up"
                        onClick={() => {
                          setProfileMenuAnchor(null);
                          navigate("/authentication/sign-up");
                        }}
                      >
                        <Icon sx={{ mr: 1 }}>person_add</Icon> Sign Up
                      </MenuItem>,
                    ]}
              </Menu>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleDarkMode}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {darkMode ? "light_mode" : "dark_mode"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              <IconButton
                size="small"
                color={developerMode ? "warning" : "inherit"}
                onClick={handleDeveloperModeToggle}
                title="Toggle Developer Mode"
              >
                <Icon sx={iconsStyle}>code</Icon>
              </IconButton>
              {developerMode && (
                <MDTypography variant="caption" color="warning" fontWeight="bold" sx={{ ml: 0.5 }}>
                  DEV
                </MDTypography>
              )}
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
