import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CertificateVerification from "./component";

const VerifyCertificate = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <CertificateVerification />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default VerifyCertificate;
