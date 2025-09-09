// DataTableBodyCell.jsx - Updated with theme colors
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

function DataTableBodyCell({ noBorder, align, children, darkMode }) {
  const [controller] = useMaterialUIController();
  const { darkMode: contextDarkMode } = controller;
  const isDark = darkMode !== undefined ? darkMode : contextDarkMode;

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        color: isDark ? "white" : "text.primary",
      })}
    >
      <MDBox display="inline-block" width="max-content" sx={{ verticalAlign: "middle" }}>
        {children}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
  darkMode: undefined,
};

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
  darkMode: PropTypes.bool,
};

export default DataTableBodyCell;
