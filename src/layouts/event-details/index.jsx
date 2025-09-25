// layouts/event-details/index.jsx
import React from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import EventDetails from "./components";

function EventDetailsPage() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <EventDetails />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EventDetailsPage;
