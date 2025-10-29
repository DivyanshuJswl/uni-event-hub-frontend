import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { withRole } from "context/AuthContext";
import OrganizedEventPage from "./component";

function OrganizedEvents() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <OrganizedEventPage />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default withRole(OrganizedEvents, "organizer");
