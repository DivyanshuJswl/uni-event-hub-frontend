// @mui material components
import Icon from "@mui/material/Icon";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Sample event images
import event1 from "assets/images/small-logos/logo-asana.svg";
import event2 from "assets/images/small-logos/github.svg";
import event3 from "assets/images/small-logos/logo-atlassian.svg";
import event4 from "assets/images/small-logos/logo-slack.svg";
import event5 from "assets/images/small-logos/logo-spotify.svg";
import event6 from "assets/images/small-logos/logo-invision.svg";
import { useMaterialUIController } from "context";

// Separate component for the Info button with modal functionality
function InfoButton({ event }) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onhandleEditform = () => setOpen(false);
  // Detect mobile screens
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <MDButton variant="text" color="info" onClick={handleOpen}>
        <Icon>info</Icon>&nbsp;Details
      </MDButton>

      <Modal
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          },
        }}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <Fade in={open} timeout={300}>
          <Box
            sx={{
              position: "relative",
              width: isMobile ? "90vw" : "70vw",
              maxHeight: "90vh",
              bgcolor: darkMode ? "background.paper" : "background.default",
              boxShadow: 24,
              borderRadius: "16px",
              overflow: "auto",
              outline: "none",
              transform: open ? "scale(1)" : "scale(0.9)",
              opacity: open ? 1 : 0,
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {/* Modal Content */}
            <Card>
              <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={event.image}
                    alt={event.title}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "60vh",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h3"
                    textTransform="capitalize"
                    color={darkMode ? "white" : "dark"}
                  >
                    {event.title}
                  </MDTypography>
                  <MDTypography
                    component="div"
                    variant="button"
                    color={darkMode ? "white" : "text"}
                    fontWeight="light"
                  >
                    {event.description}
                  </MDTypography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" alignItems="center" mb={2}>
                    <Icon color="primary">schedule</Icon>
                    <MDTypography
                      variant="body1"
                      ml={1}
                      color={darkMode ? "white" : "text"}
                      fontWeight="light"
                    >
                      {event.date}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Icon color="primary">location_on</Icon>
                    <MDTypography
                      variant="body1"
                      ml={1}
                      color={darkMode ? "white" : "text"}
                      fontWeight="light"
                    >
                      {event.venue}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Icon color="primary">group</Icon>
                    <MDTypography
                      variant="body1"
                      ml={1}
                      color={darkMode ? "white" : "text"}
                      fontWeight="light"
                    >
                      {event.participants} participants
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Icon color="primary">person</Icon>
                    <MDTypography
                      variant="body1"
                      ml={1}
                      color={darkMode ? "white" : "text"}
                      fontWeight="light"
                    >
                      Organized by: {event.organizer}
                    </MDTypography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                    <MDButton variant="gradient" color={sidenavColor} onClick={handleClose}>
                      Edit Event Details
                    </MDButton>
                    <MDButton variant="gradient" color={sidenavColor} onClick={onhandleEditform}>
                      Close
                    </MDButton>

                    {event.status === "completed" && (
                      <MDButton
                        component={Link}
                        to="/publish-certificate"
                        variant="gradient"
                        color="success"
                      >
                        <Icon>verified</Icon>&nbsp;Mint Certificate
                      </MDButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

InfoButton.propTypes = {
  event: PropTypes.object.isRequired,
};

export default function data() {
  // Event component to display event name and image
  const Event = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  Event.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  // Participants component to display total participants
  const Participants = ({ count }) => (
    <MDTypography variant="caption" color="text" fontWeight="medium">
      {count} participants
    </MDTypography>
  );

  Participants.propTypes = {
    count: PropTypes.number.isRequired,
  };

  // Sample events data
  const eventsData = [
    {
      title: "Tech Conference 2025",
      image: event1,
      date: "May 15, 2025",
      participants: 230,
      status: "upcoming",
      description:
        "Annual tech conference showcasing the latest innovations in AI, blockchain, and cloud computing.",
      venue: "Convention Center, New York",
      organizer: "Tech Innovations Inc.",
    },
    {
      title: "Developer Hackathon",
      image: event2,
      date: "March 20, 2025",
      participants: 120,
      status: "completed",
      description:
        "48-hour coding challenge for developers to build innovative solutions. Prizes for the top three teams.",
      venue: "TechHub, San Francisco",
      organizer: "DevNetwork",
    },
    {
      title: "Product Management Workshop",
      image: event3,
      date: "April 10, 2025",
      participants: 45,
      status: "completed",
      description:
        "Intensive workshop on product strategy, roadmapping, and agile development methodologies.",
      venue: "Innovation Center, Chicago",
      organizer: "PM Academy",
    },
    {
      title: "Digital Marketing Summit",
      image: event4,
      date: "June 5, 2025",
      participants: 180,
      status: "upcoming",
      description:
        "Conference focused on the latest trends in digital marketing, SEO, and social media strategies.",
      venue: "Marketing Hub, Austin",
      organizer: "Digital Marketers Association",
    },
    {
      title: "AI Ethics Symposium",
      image: event5,
      date: "February 15, 2025",
      participants: 75,
      status: "cancelled",
      description:
        "Discussion on ethical considerations in artificial intelligence development and deployment.",
      venue: "University Auditorium, Boston",
      organizer: "AI Ethics Coalition",
    },
    {
      title: "Blockchain Developer Conference",
      image: event6,
      date: "July 28, 2025",
      participants: 210,
      status: "upcoming",
      description:
        "Deep dive into blockchain technologies, smart contracts, and decentralized applications.",
      venue: "Crypto Center, Miami",
      organizer: "Blockchain Foundation",
    },
  ];

  return {
    columns: [
      { Header: "event name", accessor: "event", width: "20%", align: "left" },
      { Header: "date", accessor: "date", width: "15%", align: "left" },
      { Header: "participants", accessor: "participants", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "more info", accessor: "info", align: "center" },
      { Header: "certificate", accessor: "certificate", align: "center" },
    ],

    rows: eventsData.map((event) => ({
      event: <Event image={event.image} name={event.title} />,
      date: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {event.date}
        </MDTypography>
      ),
      participants: <Participants count={event.participants} />,
      status: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color={
            event.status === "completed"
              ? "success"
              : event.status === "upcoming"
              ? "info"
              : event.status === "cancelled"
              ? "error"
              : "dark"
          }
          fontWeight="medium"
        >
          {event.status}
        </MDTypography>
      ),
      info: <InfoButton event={event} />,
      certificate: (
        <MDButton
          component={Link}
          to="/publish-certificate"
          variant="text"
          color="success"
          disabled={event.status !== "completed"}
        >
          <Icon>verified</Icon>&nbsp;Mint
        </MDButton>
      ),
    })),
  };
}
