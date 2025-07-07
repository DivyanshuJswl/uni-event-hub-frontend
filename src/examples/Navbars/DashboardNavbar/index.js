import { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Fuse from "fuse.js";
import axios from "axios";
import { toast } from "react-toastify";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";

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
  setDeveloperMode,
} from "context";

// Environment configuration
const BASE_URL = process.env.REACT_APP_BASE_URL;

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, developerMode } =
    controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();

  // Search functionality states
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Initialize search data
  useEffect(() => {
    // Mock data - replace with your actual data sources
    const mockSearchData = [
      { id: 1, title: "Dashboard", url: "/user-dashboard", type: "page" },
      { id: 2, title: "Profile", url: "/profile", type: "page" },
      { id: 3, title: "Events", url: "/explore", type: "page" },
      { id: 4, title: "Settings", url: "/settings", type: "page" },
      { id: 5, title: "User Management", url: "/users", type: "page" },
      {
        id: 6,
        title: "Upcoming Conference",
        url: "/myevents",
        type: "event",
        description: "Annual tech conference",
      },
      {
        id: 7,
        title: "John Doe",
        url: "/users/456",
        type: "user",
        description: "john@example.com",
      },
      { id: 8, title: "System Configuration", url: "/settings/system", type: "page" },
    ];

    setSearchData(mockSearchData);

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Configure Fuse.js for fuzzy searching
  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 0.4,
    includeScore: true,
  };

  const fuse = useMemo(() => new Fuse(searchData, fuseOptions), [searchData]);

  // Handle search input changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(searchQuery);
    setSearchResults(results.map((result) => result.item));
  }, [searchQuery, fuse]);

  // Handle developer mode logging
  useEffect(() => {
    if (developerMode) {
      console.log("%cDeveloper Mode Enabled", "color: #FFA500; font-size: 16px; font-weight: bold");
    }
  }, [developerMode]);

  // Navbar type and transparency setup
  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // Handler functions
  const handleDeveloperModeToggle = () => {
    setDeveloperMode(dispatch, !developerMode);
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Search result click handler
  const handleResultClick = (result) => {
    // Add to recent searches
    const newRecentSearches = [
      result,
      ...recentSearches.filter((item) => item.id !== result.id).slice(0, 4),
    ];
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Close search and navigate
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(result.url);
  };

  // Logout function
  const handleLogout = async () => {
    handleProfileMenuClose();

    if (localStorage.getItem("role") !== "organizer") {
      try {
        await axios.get(`${BASE_URL}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

    toast.success("Logout successful!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      navigate("/authentication/sign-in");
    }, 1000);
  };

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

  // User data
  const student = localStorage.getItem("student");
  const avatarUrl = student ? JSON.parse(student).avatar : null;
  const isAuthenticated = !!localStorage.getItem("token");

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
            <MDBox pr={1} sx={{ position: "relative", width: 300 }}>
              <MDInput
                label="Search here"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => searchQuery && setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                autoComplete="off"
                fullWidth
              />
              {searchOpen && (
                <MDBox
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    bgcolor: "background.default",
                    boxShadow: 3,
                    zIndex: 1201,
                    maxHeight: 300,
                    overflowY: "auto",
                    borderRadius: 1,
                    mt: 1,
                  }}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <MenuItem
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        sx={{
                          whiteSpace: "normal",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="regular">
                          {result.title}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            backgroundColor:
                              result.type === "event" ? "primary.light" : "secondary.light",
                            px: 1,
                            borderRadius: 1,
                            mt: 0.5,
                          }}
                        >
                          {result.type}
                        </MDTypography>
                        {result.description && (
                          <MDTypography
                            variant="caption"
                            color={darkMode ? "secondary" : "primary"}
                            display="block"
                          >
                            {result.description}
                          </MDTypography>
                        )}
                      </MenuItem>
                    ))
                  ) : (
                    <>
                      <MDTypography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
                        {searchQuery.trim() ? "No results found" : "Type to search"}
                      </MDTypography>
                      {recentSearches.length > 0 && !searchQuery.trim() && (
                        <>
                          <MDTypography variant="overline" sx={{ px: 2, pt: 1, display: "block" }}>
                            Recent searches
                          </MDTypography>
                          {recentSearches.map((search) => (
                            <MenuItem key={search.id} onClick={() => handleResultClick(search)}>
                              <MDTypography variant="body2">{search.title}</MDTypography>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </MDBox>
              )}
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
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
