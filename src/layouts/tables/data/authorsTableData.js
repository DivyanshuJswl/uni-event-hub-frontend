// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

const data = () => {
  // Event component to display event name and description
  const Event = ({ name, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  Event.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  // Organizer component to display organizer details
  const Organizer = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  Organizer.propTypes = {
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "event", accessor: "event", width: "40%", align: "left" },
      { Header: "organizer", accessor: "organizer", width: "30%", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        event: (
          <Event name="Annual Tech Conference" description="Technology showcase and networking" />
        ),
        organizer: <Organizer image={team2} name="John Michael" email="john@creative-tim.com" />,
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            15 May 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
      {
        event: <Event name="Marketing Summit" description="Digital marketing strategies" />,
        organizer: <Organizer image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            22 June 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
      {
        event: <Event name="Product Launch: XYZ Pro" description="New product unveiling" />,
        organizer: (
          <Organizer image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />
        ),
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            10 July 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
      {
        event: <Event name="Leadership Workshop" description="Management skills development" />,
        organizer: <Organizer image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            5 May 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="completed" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
      {
        event: <Event name="Annual Charity Gala" description="Fundraiser for local charities" />,
        organizer: <Organizer image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            20 August 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
      {
        event: <Event name="Web Development Bootcamp" description="Intensive coding workshop" />,
        organizer: <Organizer image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            1 June 2025
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="cancelled" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Details
          </MDTypography>
        ),
      },
    ],
  };
};

export default data;
