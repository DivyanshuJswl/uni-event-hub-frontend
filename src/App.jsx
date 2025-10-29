import { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import LoadingScreen from "components/LoadingScreen";
import NotificationToast from "components/NotifiToast";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { NotificationProvider } from "context/NotifiContext";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import routes from "./routes";
import { useAuth } from "context/AuthContext";
import ResetPasswordPage from "layouts/authentication/resetPassword";
import { ChatProvider } from "context/ChatContext";
import FloatingChatButton from "components/FloatingChatButton";
import ChatWindow from "components/ChatWindow";

// Main App Content Component (for better organization)
const AppContent = () => {
  const { role, user } = useAuth();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Memoized brand image
  const brandImage = useMemo(() => {
    return (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite;
  }, [transparentSidenav, darkMode, whiteSidenav]);

  // Sidenav mouse handlers
  const handleOnMouseEnter = useCallback(() => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  }, [miniSidenav, onMouseEnter, dispatch]);

  const handleOnMouseLeave = useCallback(() => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  }, [onMouseEnter, dispatch]);

  // Memoized route generator
  const getRoutes = useCallback((allRoutes) => {
    return allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });
  }, []);

  // Configurator toggle
  const handleConfiguratorOpen = useCallback(() => {
    setOpenConfigurator(dispatch, !openConfigurator);
  }, [dispatch, openConfigurator]);

  // Set document direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Reset scroll on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Memoized configurator button
  const configsButton = useMemo(() => {
    if (!user) return null;

    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={handleConfiguratorOpen}
      >
        <Icon fontSize="small" color="inherit">
          settings
        </Icon>
      </MDBox>
    );
  }, [user, handleConfiguratorOpen]);

  // Memoized default redirect
  const defaultRedirect = useMemo(() => {
    return role === "organizer" ? "/organizer-dashboard" : "/user-dashboard";
  }, [role]);

  return (
    <ChatProvider>
      {/* Unified Notification Toast - Available Throughout App */}
      <NotificationToast />

      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brandImage}
            brandName="Uni-Event HUB"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}

      {/* AI Chat Components - Only show if user is authenticated */}
      {user && (
        <>
          <FloatingChatButton />
          <ChatWindow />
        </>
      )}

      <Routes>
        {getRoutes(routes)}
        <Route
          path="*"
          element={
            window.location.pathname.startsWith("/reset-password/") ? (
              <ResetPasswordPage />
            ) : (
              <Navigate to={defaultRedirect} />
            )
          }
        />
      </Routes>
    </ChatProvider>
  );
};

// Main App Component with Providers
export default function App() {
  const { isLoading } = useAuth();
  const [controller] = useMaterialUIController();
  const { direction, darkMode } = controller;

  // Memoized RTL cache
  const rtlCache = useMemo(() => {
    return createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
  }, []);

  // Memoized theme selection
  const selectedTheme = useMemo(() => {
    if (direction === "rtl") {
      return darkMode ? themeDarkRTL : themeRTL;
    }
    return darkMode ? themeDark : theme;
  }, [direction, darkMode]);

  // Loading screen
  if (isLoading) {
    return (
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  // Main render with RTL support
  const mainContent = (
    <NotificationProvider>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </NotificationProvider>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>{mainContent}</CacheProvider>
  ) : (
    mainContent
  );
}
