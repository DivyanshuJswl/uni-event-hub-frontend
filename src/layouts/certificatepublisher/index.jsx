import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CertificatePublisher from "./component";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { withRole } from "context/AuthContext";

const Publish = () => {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <CertificatePublisher />
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default withRole(Publish, "organizer");
