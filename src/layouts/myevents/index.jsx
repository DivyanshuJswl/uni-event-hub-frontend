// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MyParticipatedEvents from "./components";
import { withAuth } from "context/AuthContext";

function MyEvents() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <MyParticipatedEvents />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default withAuth(MyEvents, "participant");