import { useState, useEffect, useMemo, useCallback } from "react";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Fuse from "fuse.js";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Badge } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setDarkMode,
} from "context";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";

const DashboardNavbar = memo(({ absolute, light, isMini }) => {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuth();
  const { unreadCount, showToast } = useNotifications();

  // Consolidated state
  const [navbarState, setNavbarState] = useState({
    navbarType: "static",
    openMenu: false,
    profileMenuAnchor: null,
    searchData: [],
    searchQuery: "",
    searchResults: [],
    searchOpen: false,
    recentSearches: [],
  });

  // Memoized route calculation
  const route = useMemo(() => location.pathname.split("/").slice(1), [location.pathname]);

  // Memoized search data
  const mockSearchData = useMemo(() => [
    { id: 1, title: "Dashboard", url: "/user-dashboard", type: "page" },
    { id: 2, title: "Profile", url: "/profile", type: "page" },
    { id: 3, title: "Events", url: "/explore", type: "page" },
    { id: 4, title: "My Events", url: "/myevents", type: "page" },
    { id: 5, title: "Certificates", url: "/my-certificate", type: "page" },
    { id: 6, title: "Organized Events", url: "/organized-events", type: "page" },
    { id: 7, title: "Create Event", url: "/create-event", type: "page" },
    { id: 8, title: "Settings", url: "/settings", type: "page" },
  ], []);

  // Initialize search data and recent searches
  useEffect(() => {
    setNavbarState(prev => ({ ...prev, searchData: mockSearchData }));
    
    const savedSearches = sessionStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        setNavbarState(prev => ({ 
          ...prev, 
          recentSearches: JSON.parse(savedSearches) 
        }));
      } catch (error) {
        console.error("Failed to parse recent searches:", error);
      }
    }
  }, [mockSearchData]);

  // Memoized Fuse.js instance
  const fuse = useMemo(() => {
    const fuseOptions = {
      keys: ["title", "description"],
      threshold: 0.4,
      includeScore: true,
    };
    return new Fuse(navbarState.searchData, fuseOptions);
  }, [navbarState.searchData]);

  // Handle search with memoization
  useEffect(() => {
    if (!navbarState.searchQuery.trim()) {
      setNavbarState(prev => ({ ...prev, searchResults: [] }));
      return;
    }

    const results = fuse.search(navbarState.searchQuery);
    setNavbarState(prev => ({ 
      ...prev, 
      searchResults: results.map(result => result.item) 
    }));
  }, [navbarState.searchQuery, fuse]);

  // Navbar type and transparency setup
  useEffect(() => {
    setNavbarState(prev => ({ 
      ...prev, 
      navbarType: fixedNavbar ? "sticky" : "static" 
    }));

    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // Memoized handlers
  const handleMiniSidenav = useCallback(() => {
    setMiniSidenav(dispatch, !miniSidenav);
  }, [dispatch, miniSidenav]);

  const handleConfiguratorOpen = useCallback(() => {
    setOpenConfigurator(dispatch, !openConfigurator);
  }, [dispatch, openConfigurator]);

  const handleDarkMode = useCallback(() => {
    setDarkMode(dispatch, !darkMode);
  }, [dispatch, darkMode]);

  const handleProfileMenuOpen = useCallback((event) => {
    setNavbarState(prev => ({ ...prev, profileMenuAnchor: event.currentTarget }));
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setNavbarState(prev => ({ ...prev, profileMenuAnchor: null }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setNavbarState(prev => ({ 
      ...prev, 
      searchQuery: value,
      searchOpen: true 
    }));
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (navbarState.searchQuery) {
      setNavbarState(prev => ({ ...prev, searchOpen: true }));
    }
  }, [navbarState.searchQuery]);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      setNavbarState(prev => ({ ...prev, searchOpen: false }));
    }, 200);
  }, []);

  const handleResultClick = useCallback((result) => {
    const newRecentSearches = [
      result,
      ...navbarState.recentSearches.filter(item => item.id !== result.id).slice(0, 4),
    ];
    
    setNavbarState(prev => ({
      ...prev,
      recentSearches: newRecentSearches,
      searchOpen: false,
      searchQuery: "",
      searchResults: [],
    }));
    
    sessionStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    navigate(result.url);
  }, [navbarState.recentSearches, navigate]);

  const handleLogout = useCallback(async () => {
    handleProfileMenuClose();

    const result = await logout();

    if (result.success) {
      showToast("Logged out successfully", "success", "Goodbye!");
      setTimeout(() => navigate("/authentication/sign-in"), 1000);
    } else {
      showToast("Logout failed. Please try again.", "error", "Logout Failed");
    }
  }, [logout, showToast, navigate, handleProfileMenuClose]);

  const handleNavigateToProfile = useCallback(() => {
    handleProfileMenuClose();
    navigate("/profile");
  }, [navigate, handleProfileMenuClose]);

  const handleNavigateToSignIn = useCallback(() => {
    handleProfileMenuClose();
    navigate("/authentication/sign-in");
  }, [navigate, handleProfileMenuClose]);

  const handleNavigateToSignUp = useCallback(() => {
    handleProfileMenuClose();
    navigate("/authentication/sign-up");
  }, [navigate, handleProfileMenuClose]);

  const handleNavigateToNotifications = useCallback(() => {
    navigate("/notifications");
  }, [navigate]);

  // Memoized styles
  const iconsStyle = useMemo(() => 
    ({ palette: { dark, white, text }, functions: { rgba } }) => ({
      color: () => {
        let colorValue = light || darkMode ? white.main : dark.main;
        if (transparentNavbar && !light) {
          colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
        }
        return colorValue;
      },
    }),
    [light, darkMode, transparentNavbar]
  );

  // Memoized user data
  const avatarUrl = useMemo(() => user?.avatar || null, [user]);
  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarState.navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {!isMini && (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1} sx={{ position: "relative", width: 300 }}>
              <MDInput
                label="Search here"
                value={navbarState.searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                autoComplete="off"
                fullWidth
              />
              {navbarState.searchOpen && (
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
                  {navbarState.searchResults.length > 0 ? (
                    navbarState.searchResults.map((result) => (
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
                          sx={{
                            backgroundColor: result.type === "event" ? "primary.main" : "secondary.main",
                            px: 1,
                            borderRadius: 1,
                            mt: 0.5,
                            color: "white",
                          }}
                        >
                          {result.type}
                        </MDTypography>
                      </MenuItem>
                    ))
                  ) : (
                    <>
                      <MDTypography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
                        {navbarState.searchQuery.trim() ? "No results found" : "Type to search"}
                      </MDTypography>
                      {navbarState.recentSearches.length > 0 && !navbarState.searchQuery.trim() && (
                        <>
                          <MDTypography variant="overline" sx={{ px: 2, pt: 1, display: "block" }}>
                            Recent searches
                          </MDTypography>
                          {navbarState.recentSearches.map((search) => (
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
              <IconButton sx={navbarIconButton} size="small" disableRipple onClick={handleProfileMenuOpen}>
                {avatarUrl ? (
                  <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 32, height: 32 }} />
                ) : (
                  <Icon sx={iconsStyle} title="Profile">account_circle</Icon>
                )}
              </IconButton>
              
              <Menu
                anchorEl={navbarState.profileMenuAnchor}
                open={Boolean(navbarState.profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                sx={{ mt: 1 }}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleNavigateToProfile}>
                      <Icon sx={{ mr: 1 }}>person</Icon> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Icon sx={{ mr: 1 }}>logout</Icon> Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleNavigateToSignIn}>
                      <Icon sx={{ mr: 1 }}>login</Icon> Sign In
                    </MenuItem>
                    <MenuItem onClick={handleNavigateToSignUp}>
                      <Icon sx={{ mr: 1 }}>person_add</Icon> Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>

              <IconButton size="small" disableRipple color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
                <Icon sx={iconsStyle} fontSize="medium">{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>

              <IconButton size="small" disableRipple color="inherit" sx={navbarIconButton} onClick={handleDarkMode}>
                <Icon sx={iconsStyle} fontSize="medium">{darkMode ? "light_mode" : "dark_mode"}</Icon>
              </IconButton>

              <IconButton size="small" disableRipple color="inherit" sx={navbarIconButton} onClick={handleConfiguratorOpen}>
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>

              {isAuthenticated && (
                <IconButton size="small" disableRipple color="inherit" sx={navbarIconButton} onClick={handleNavigateToNotifications}>
                  <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    <Icon sx={iconsStyle}>notifications</Icon>
                  </Badge>
                </IconButton>
              )}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
});

DashboardNavbar.displayName = "DashboardNavbar";

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
