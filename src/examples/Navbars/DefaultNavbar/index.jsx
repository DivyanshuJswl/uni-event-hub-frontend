import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";
import breakpoints from "assets/theme/base/breakpoints";
import { useMaterialUIController } from "context";

function DefaultNavbar({ transparent = false, light = false }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Consolidated state
  const [navbarState, setNavbarState] = useState({
    mobileNavbar: false,
    mobileView: false,
  });

  // Memoized handlers
  const openMobileNavbar = useCallback(({ currentTarget }) => {
    setNavbarState((prev) => ({
      ...prev,
      mobileNavbar: currentTarget.parentNode,
    }));
  }, []);

  const closeMobileNavbar = useCallback(() => {
    setNavbarState((prev) => ({ ...prev, mobileNavbar: false }));
  }, []);

  // Handle responsive navbar
  useEffect(() => {
    const displayMobileNavbar = () => {
      const isMobile = window.innerWidth < breakpoints.values.lg;
      setNavbarState({
        mobileView: isMobile,
        mobileNavbar: false,
      });
    };

    window.addEventListener("resize", displayMobileNavbar);
    displayMobileNavbar();

    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  // Memoized navbar background style
  const navbarBackground = useMemo(
    () =>
      ({ palette: { transparent: transparentColor, white, background }, functions: { rgba } }) => ({
        backgroundColor: transparent
          ? transparentColor.main
          : rgba(darkMode ? background.sidenav : white.main, 0.8),
        backdropFilter: transparent ? "none" : "saturate(200%) blur(30px)",
      }),
    [transparent, darkMode]
  );

  return (
    <Container>
      <MDBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={3}
        mx={3}
        width="calc(100% - 48px)"
        borderRadius="lg"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        left={0}
        zIndex={3}
        sx={navbarBackground}
      >
        <MDBox
          component={Link}
          to="/"
          py={transparent ? 1.5 : 0.75}
          lineHeight={1}
          pl={{ xs: 0, lg: 1 }}
        >
          <MDTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
            Uni-Event Home
          </MDTypography>
        </MDBox>

        {/* Desktop Navigation */}
        <MDBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
          <DefaultNavbarLink
            icon="account_circle"
            name="sign up"
            route="/authentication/sign-up"
            light={light}
          />
          <DefaultNavbarLink
            icon="key"
            name="sign in"
            route="/authentication/sign-in"
            light={light}
          />
        </MDBox>

        {/* Sponsor Us Link */}
        <MDBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
          <MDBox
            component="a"
            href="https://sponsors-gilt.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            mx={1}
            p={1}
            display="flex"
            alignItems="center"
            color={light ? "white" : "dark"}
          >
            <Icon sx={{ mr: 1 }}>volunteer_activism</Icon>
            <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>
              Sponsor Us
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Mobile Menu Toggle */}
        <MDBox
          display={{ xs: "inline-block", lg: "none" }}
          lineHeight={0}
          py={1.5}
          pl={1.5}
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={openMobileNavbar}
        >
          <Icon fontSize="default">{navbarState.mobileNavbar ? "close" : "menu"}</Icon>
        </MDBox>
      </MDBox>

      {/* Mobile Navigation */}
      {navbarState.mobileView && (
        <DefaultNavbarMobile open={navbarState.mobileNavbar} close={closeMobileNavbar} />
      )}
    </Container>
  );
}

DefaultNavbar.propTypes = {
  transparent: PropTypes.bool,
  light: PropTypes.bool,
};

DefaultNavbar.displayName = "DefaultNavbar";

export default memo(DefaultNavbar);
