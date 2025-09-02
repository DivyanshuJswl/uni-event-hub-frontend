// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDCalendar from "components/MDCalendar";

function Projects() {
  return (
    <Card>
      {/* Calendar Section */}
      <MDBox p={3} mb={2} width="100%">
        <MDTypography variant="h4" gutterBottom paddingBottom={3}>
          Calendar
        </MDTypography>
        <MDBox
          sx={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Pass the color as "dark", "primary", or any valid MUI color */}
          {/* Need to set it*/}
          <MDCalendar color="success" />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Projects;
