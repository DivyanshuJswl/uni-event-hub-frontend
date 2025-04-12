import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CertificatePublisher from "./component";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
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

export default Publish;
