import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { withAuth } from "context/AuthContext";
import MyCertificates from "./component";

const HackathonWinners = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <MyCertificates />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default withAuth(HackathonWinners, "participant");
