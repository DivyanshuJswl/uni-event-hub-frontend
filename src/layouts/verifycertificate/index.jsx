import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CertificateVerification from "./component";

const VerifyCertificate = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CertificateVerification />
      <Footer />
    </DashboardLayout>
  );
};

export default VerifyCertificate;
