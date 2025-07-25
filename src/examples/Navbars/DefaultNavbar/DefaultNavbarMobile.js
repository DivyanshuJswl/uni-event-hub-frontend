// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";

function DefaultNavbarMobile({ open, close }) {
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      getContentAnchorEl={null}
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
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      <MDBox px={0.5}>
        {/* <DefaultNavbarLink icon="donut_large" name="dashboard" route="/dashboard" />
        <DefaultNavbarLink icon="person" name="profile" route="/profile" /> */}
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
          color={open && open.light ? "white" : "dark"}
        >
          <Icon sx={{ mr: 1 }}>volunteer_activism</Icon>
          <MDTypography
            variant="button"
            fontWeight="regular"
            color={open && open.light ? "white" : "dark"}
          >
            Sponsor Us
          </MDTypography>
        </MDBox>
      </MDBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
