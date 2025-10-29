import { useMemo, memo } from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";

function DefaultNavbarMobile({ open, close }) {
  // Memoized width calculation
  const menuWidth = useMemo(() => {
    if (open && open.getBoundingClientRect) {
      const { width } = open.getBoundingClientRect();
      return `calc(${width}px - 4rem)`;
    }
    return "auto";
  }, [open]);

  // Memoized text color
  const textColor = useMemo(() => {
    return open && open.light ? "white" : "dark";
  }, [open]);

  return (
    <Menu
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: menuWidth } }}
    >
      <MDBox px={0.5}>
        <DefaultNavbarLink icon="account_circle" name="sign up" route="/authentication/sign-up" />
        <DefaultNavbarLink icon="key" name="sign in" route="/authentication/sign-in" />
        <MDBox
          component="a"
          href="https://sponsors-gilt.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          mx={1}
          p={1}
          display="flex"
          alignItems="center"
          color={textColor}
        >
          <Icon sx={{ mr: 1 }}>volunteer_activism</Icon>
          <MDTypography variant="button" fontWeight="regular" color={textColor}>
            Sponsor Us
          </MDTypography>
        </MDBox>
      </MDBox>
    </Menu>
  );
}

DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

DefaultNavbarMobile.displayName = "DefaultNavbarMobile";

export default memo(DefaultNavbarMobile);
