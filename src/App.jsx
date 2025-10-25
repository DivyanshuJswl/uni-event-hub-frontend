// App.jsx - Updated imports and main content
import { useState, useEffect, useMemo } from "react";
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
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import routes from "./routes";
import { useAuth } from "context/AuthContext";
import ResetPasswordPage from "layouts/authentication/resetPassword";
import { ChatProvider } from "context/ChatContext";
import FloatingChatButton from "components/FloatingChatButton";
import ChatWindow from "components/ChatWindow";

export default function App() {
  const { role, isLoading, user, token } = useAuth();
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
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Initialize RTL cache
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Sidenav mouse handlers
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Route generator
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  // Configurator toggle
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Set document direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Reset scroll on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Configurator button - Only show if user is logged in
  const configsButton = user ? (
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
  ) : null;

  // Main content
  const mainContent = (
    <ChatProvider>
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
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
              <Navigate to={role == "organizer" ? "/organizer-dashboard" : "/user-dashboard"} />
            )
          }
        />
      </Routes>
    </ChatProvider>
  );

  return (
    <>
      {isLoading ? (
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <LoadingScreen />
        </ThemeProvider>
      ) : direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {mainContent}
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {mainContent}
        </ThemeProvider>
      )}
    </>
  );
}
