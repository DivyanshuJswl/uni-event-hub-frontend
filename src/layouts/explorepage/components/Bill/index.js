// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function Bill({ name, description, link, email, vat, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "grey-100"}
      borderRadius="lg"
      p={2}
      mb={noGutter ? 0 : 2}
      sx={{
        boxShadow: darkMode ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: darkMode ? "none" : "0 6px 10px -1px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <MDTypography
            variant="h5"
            fontWeight="medium"
            textTransform="capitalize"
            color={darkMode ? "white" : "dark"}
            sx={{ letterSpacing: "0.5px" }}
          >
            {name}
          </MDTypography>
          {email && (
            <MDTypography variant="button" color="text" fontWeight="medium" sx={{ opacity: 0.8 }}>
              {email}
            </MDTypography>
          )}
        </MDBox>

        <MDBox mb={1.5} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium" color="text">
            Details:
          </MDTypography>
          <MDTypography
            variant="body2"
            fontWeight="regular"
            color={darkMode ? "text" : "secondary"}
            sx={{ mt: 0.5, ml: 1 }}
          >
            {description}
          </MDTypography>
        </MDBox>

        {link && (
          <MDBox mb={1} lineHeight={1}>
            <MDTypography variant="h6" fontWeight="medium" color="text">
              Link:
            </MDTypography>
            <MDTypography
              variant="body2"
              fontWeight="regular"
              color="info"
              sx={{
                mt: 0.5,
                ml: 1,
                wordBreak: "break-word",
                textDecoration: "underline",
                "&:hover": { opacity: 0.8 },
              }}
            >
              {link}
            </MDTypography>
          </MDBox>
        )}

        {vat && (
          <MDTypography
            variant="caption"
            color={darkMode ? "text" : "secondary"}
            sx={{ alignSelf: "flex-end", mt: 1 }}
          >
            VAT: {vat}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
  link: null,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  email: PropTypes.string,
  vat: PropTypes.string,
  noGutter: PropTypes.bool,
};

export default Bill;
