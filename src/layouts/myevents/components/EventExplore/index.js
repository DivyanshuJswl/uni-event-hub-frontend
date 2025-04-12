// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useState } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "examples/Tables/DataTable";

// Images for sample data
import event1 from "assets/images/apple-icon.png"; // Replace with your actual event images
import event2 from "assets/images/apple-icon.png";
import event3 from "assets/images/apple-icon.png";
import event4 from "assets/images/apple-icon.png";
import event5 from "assets/images/apple-icon.png";
import event6 from "assets/images/apple-icon.png";

function MyParticipatedEvents() {
  const [tableData, setTableData] = useState(getData());

  // Function to handle unenrolling from an event
  const handleUnenroll = (eventId) => {
    setTableData((prevData) => {
      const newRows = prevData.rows.filter((row) => row.id !== eventId);
      return { ...prevData, rows: newRows };
    });
  };

  // Function to get table data
  function getData() {
    // Event component to display event name, description and image
    const Event = ({ image, name, description }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm" variant="rounded" />
        <MDBox ml={2} lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Event.propTypes = {
      image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    };

    // Organizer component to display organizer details
    const Organizer = ({ name, email }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Organizer.propTypes = {
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    };

    // Action buttons component
    const ActionButtons = ({ eventId }) => (
      <MDBox display="flex" justifyContent="space-around">
        <Tooltip title="View Details" placement="top">
          <MDButton variant="text" color="info" size="small">
            <Icon>visibility</Icon>
          </MDButton>
        </Tooltip>
        <Tooltip title="Unenroll" placement="top">
          <MDButton
            variant="text"
            color="error"
            size="small"
            onClick={() => handleUnenroll(eventId)}
          >
            <Icon>delete</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
    );

    ActionButtons.propTypes = {
      eventId: PropTypes.number.isRequired,
    };

    return {
      columns: [
        { Header: "event", accessor: "event", width: "35%", align: "left" },
        { Header: "organizer", accessor: "organizer", width: "25%", align: "left" },
        { Header: "date", accessor: "date", align: "center" },
        { Header: "status", accessor: "status", align: "center" },
        { Header: "actions", accessor: "actions", align: "center" },
      ],

      rows: [
        {
          id: 1,
          event: (
            <Event
              image={event1}
              name="Tech Innovation Summit"
              description="Explore cutting-edge technologies and networking opportunities"
            />
          ),
          organizer: <Organizer name="John Michael" email="john@techsummit.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              June 15, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={1} />,
        },
        {
          id: 2,
          event: (
            <Event
              image={event2}
              name="Design Workshop"
              description="UI/UX design principles and practical applications"
            />
          ),
          organizer: <Organizer name="Alexa Liras" email="alexa@designhub.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              July 22, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={2} />,
        },
        {
          id: 3,
          event: (
            <Event
              image={event3}
              name="AI Conference"
              description="Latest developments in artificial intelligence"
            />
          ),
          organizer: <Organizer name="Laurent Perrier" email="laurent@aiconf.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              May 5, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="completed" color="success" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={3} />,
        },
        {
          id: 4,
          event: (
            <Event
              image={event4}
              name="Blockchain Masterclass"
              description="Deep dive into blockchain technology and applications"
            />
          ),
          organizer: <Organizer name="Michael Levi" email="michael@blockmaster.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              August 10, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={4} />,
        },
        {
          id: 5,
          event: (
            <Event
              image={event5}
              name="Data Science Bootcamp"
              description="Intensive training in data analytics and visualization"
            />
          ),
          organizer: <Organizer name="Richard Gran" email="richard@datascience.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              April 20, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="cancelled" color="error" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={5} />,
        },
        {
          id: 6,
          event: (
            <Event
              image={event6}
              name="Marketing & Growth Strategies"
              description="Advanced techniques for business growth and customer acquisition"
            />
          ),
          organizer: <Organizer name="Miriam Eric" email="miriam@marketgrowth.com" />,
          date: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              September 14, 2025
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />
            </MDBox>
          ),
          actions: <ActionButtons eventId={6} />,
        },
      ],
    };
  }

  return (
    <MDBox pt={6} pb={3}>
      <MDBox mb={3}>
        <MDTypography variant="h3" textTransform="capitalize">
          My Participated Events
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Events you&apos;ve registered for
        </MDTypography>
      </MDBox>
      <MDBox>
        <DataTable
          table={tableData}
          isSorted={false}
          entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
          showTotalEntries={true}
          noEndBorder
          canSearch
        />
      </MDBox>
    </MDBox>
  );
}

export default MyParticipatedEvents;
