import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setSidenavColor,
  setDarkMode,
} from "context";

function Configurator() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    openConfigurator,
    fixedNavbar,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [disabled, setDisabled] = useState(false);

  // Memoized sidenav colors
  const sidenavColors = useMemo(
    () => ["primary", "dark", "info", "success", "warning", "error"],
    []
  );

  // Handle window resize for button disabled state
  useEffect(() => {
    const handleDisabled = () => {
      setDisabled(window.innerWidth <= 1200);
    };

    window.addEventListener("resize", handleDisabled);
    handleDisabled();

    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  // Memoized handlers
  const handleCloseConfigurator = useCallback(() => {
    setOpenConfigurator(dispatch, false);
  }, [dispatch]);

  const handleTransparentSidenav = useCallback(() => {
    setTransparentSidenav(dispatch, true);
    setWhiteSidenav(dispatch, false);
  }, [dispatch]);

  const handleWhiteSidenav = useCallback(() => {
    setWhiteSidenav(dispatch, true);
    setTransparentSidenav(dispatch, false);
  }, [dispatch]);

  const handleDarkSidenav = useCallback(() => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, false);
  }, [dispatch]);

  const handleFixedNavbar = useCallback(() => {
    setFixedNavbar(dispatch, !fixedNavbar);
  }, [dispatch, fixedNavbar]);

  const handleDarkMode = useCallback(() => {
    setDarkMode(dispatch, !darkMode);
  }, [dispatch, darkMode]);

  const handleColorChange = useCallback(
    (color) => {
      setSidenavColor(dispatch, color);
    },
    [dispatch]
  );

  const handleShare = useCallback(() => {
    const shareData = {
      title: "Uni Event-Hub App",
      text: "Check out the awesome Uni Event-Hub. Your go-to platform for university events, activities, and community engagement.",
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Successfully shared"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  }, []);

  // Memoized button styles
  const sidenavTypeButtonsStyles = useMemo(
    () =>
      ({
        functions: { pxToRem },
        palette: { white, dark, background },
        borders: { borderWidth },
      }) => ({
        height: pxToRem(39),
        background: darkMode ? background.sidenav : white.main,
        color: darkMode ? white.main : dark.main,
        border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
        "&:hover, &:focus, &:focus:not(:hover)": {
          background: darkMode ? background.sidenav : white.main,
          color: darkMode ? white.main : dark.main,
          border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
        },
      }),
    [darkMode]
  );

  const sidenavTypeActiveButtonStyles = useMemo(
    () =>
      ({ functions: { pxToRem, linearGradient }, palette: { white, gradients, background } }) => ({
        height: pxToRem(39),
        background: darkMode
          ? white.main
          : linearGradient(gradients.dark.main, gradients.dark.state),
        color: darkMode ? background.sidenav : white.main,
        "&:hover, &:focus, &:focus:not(:hover)": {
          background: darkMode
            ? white.main
            : linearGradient(gradients.dark.main, gradients.dark.state),
          color: darkMode ? background.sidenav : white.main,
        },
      }),
    [darkMode]
  );

  // Memoized color button styles
  const getColorButtonStyles = useCallback(
    (color) =>
      ({ borders: { borderWidth }, palette: { white, dark, background }, transitions }) => ({
        width: "24px",
        height: "24px",
        padding: 0,
        border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
        borderColor: sidenavColor === color ? (darkMode ? white.main : dark.main) : "transparent",
        transition: transitions.create("border-color", {
          easing: transitions.easing.sharp,
          duration: transitions.duration.shorter,
        }),
        backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
          linearGradient(gradients[color].main, gradients[color].state),
        "&:not(:last-child)": { mr: 1 },
        "&:hover, &:focus, &:active": {
          borderColor: darkMode ? white.main : dark.main,
        },
      }),
    [darkMode, sidenavColor]
  );

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Event-Hub UI Configurator</MDTypography>
          <MDTypography variant="body2" color="text">
            See our dashboard options.
          </MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      <Divider />

      <MDBox pt={0.5} pb={3} px={3}>
        <MDBox>
          <MDTypography variant="h6">Sidenav Colors</MDTypography>
          <MDBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={getColorButtonStyles(color)}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </MDBox>
        </MDBox>

        <MDBox mt={3} lineHeight={1}>
          <MDTypography variant="h6">Sidenav Type</MDTypography>
          <MDTypography variant="button" color="text">
            Choose between different sidenav types.
          </MDTypography>

          <MDBox sx={{ display: "flex", mt: 2, mr: 1 }}>
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleDarkSidenav}
              disabled={disabled}
              fullWidth
              sx={
                !transparentSidenav && !whiteSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              Dark
            </MDButton>
            <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleTransparentSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                Transparent
              </MDButton>
            </MDBox>
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleWhiteSidenav}
              disabled={disabled}
              fullWidth
              sx={
                whiteSidenav && !transparentSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              White
            </MDButton>
          </MDBox>
        </MDBox>

        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
          <MDTypography variant="h6">Navbar Fixed</MDTypography>
          <Switch checked={fixedNavbar} onChange={handleFixedNavbar} />
        </MDBox>

        <Divider />

        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">Light / Dark</MDTypography>
          <Switch checked={darkMode} onChange={handleDarkMode} />
        </MDBox>

        <Divider />

        <MDBox mt={2} mb={2}>
          <MDButton
            component={Link}
            href="https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/"
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            color="secondary"
            fullWidth
          >
            view documentation for MUI
          </MDButton>
        </MDBox>

        <MDBox mt={2} mb={2} textAlign="center">
          <MDButton variant="outlined" color="primary" onClick={handleShare} fullWidth>
            Share the awesome Event-Hub UI!
          </MDButton>
        </MDBox>

        <MDBox mt={2} textAlign="center">
          <MDBox mb={0.5}>
            <MDTypography variant="h6">Thank you for sharing!</MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </ConfiguratorRoot>
  );
}

Configurator.displayName = "Configurator";

export default memo(Configurator);
