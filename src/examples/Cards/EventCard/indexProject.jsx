import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Divider,
  Modal,
  Box,
  IconButton,
  useMediaQuery,
  Grid,
  Fade,
  Backdrop,
  LinearProgress,
  Chip,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";
import { useAuth } from "context/AuthContext";

function EventCard({
  image,
  title,
  description,
  category,
  date,
  location,
  maxParticipants,
  currentParticipants,
  organizerName,
  organizerEmail,
  status,
  isFull,
  _id,
}) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [registerBtn, setRegisterBtn] = useState("Register Now");
  const [err, setError] = useState();
  const { token } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRegister = async () => {
    if (isFull || new Date() > new Date(date)) return;
    setRegisterBtn((prev) => (prev === "Register Now" ? "Unenroll" : "Register Now"));
    try {
      const res = await axios.post(
        `${BASE_URL}/api/events/enroll/${_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  const participationPercentage = Math.round((currentParticipants / maxParticipants) * 100);
  const formattedDate = new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      {/* Clickable Card */}
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: darkMode ? "background.default" : "background.paper",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MDBox padding="1rem">
          <MDBox position="relative">
            <MDBox
              component="img"
              src={image}
              alt={title}
              width="100%"
              height="12.5rem"
              sx={{
                objectFit: "cover",
                borderRadius: "lg",
                boxShadow: darkMode ? 2 : 3,
                borderTopLeftRadius: "0.6rem",
                borderTopRightRadius: "0.6rem",
                borderBottomLeftRadius: "0.6rem",
                borderBottomRightRadius: "0.6rem",
                mt: -5,
                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
            <Chip
              label={status}
              color={
                status === "upcoming"
                  ? "secondary"
                  : status === "ongoing"
                    ? "success"
                    : status === "completed"
                      ? "default"
                      : "default"
              }
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.9)",
                color: darkMode ? "text.primary" : "text.primary",
              }}
            />
          </MDBox>

          <MDBox pt={3} pb={1} px={1}>
            <MDTypography
              variant="h6"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </MDTypography>

            <Box display="flex" alignItems="center" mt={0.5}>
              <CategoryIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {category}
              </MDTypography>
            </Box>

            <Divider
              sx={{
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                my: 1,
              }}
            />

            <Box display="flex" alignItems="center" mb={0.5}>
              <EventAvailableIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {formattedDate}
              </MDTypography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {location}
              </MDTypography>
            </Box>

            <Box mb={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Box display="flex" alignItems="center">
                  <GroupIcon fontSize="small" color="secondary" />
                  <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                    {currentParticipants}/{maxParticipants} spots filled
                  </MDTypography>
                </Box>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {participationPercentage}%
                </MDTypography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={participationPercentage}
                color={isFull ? "error" : participationPercentage > 80 ? "warning" : "secondary"}
                sx={{
                  height: 6,
                  borderRadius: 3,
                }}
              />
            </Box>

            <MDBox display="flex" justifyContent="center" alignItems="center" padding="8px" mt={2}>
              <MDButton
                variant="gradient"
                color={isFull ? "error" : sidenavColor}
                size="medium"
                disabled={isFull}
              >
                {isFull ? "FULLY BOOKED" : "SHOW DETAILS"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Event Details Modal */}
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
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              color={sidenavColor}
              sx={{
                scale: 1.5,
                position: "absolute",
                right: 30,
                top: 25,
                zIndex: 1000,
                backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Modal Content */}
            <Card sx={{ backgroundColor: darkMode ? "background.default" : "background.paper" }}>
              <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={image}
                    alt={title}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "60vh",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                        Participation Status
                      </MDTypography>
                      <Chip
                        label={status}
                        color={
                          status === "upcoming"
                            ? "secondary"
                            : status === "ongoing"
                              ? "success"
                              : "default"
                        }
                        size="medium"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(255, 255, 255, 0.9)",
                          color: darkMode ? "text.primary" : "text.primary",
                        }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDTypography variant="body2" color="text">
                        {currentParticipants}/{maxParticipants} participants
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {participationPercentage}% filled
                      </MDTypography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={participationPercentage}
                      color={
                        isFull ? "error" : participationPercentage > 80 ? "warning" : "secondary"
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                      }}
                    />
                    {isFull && (
                      <MDTypography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, textAlign: "right" }}
                      >
                        This event is fully booked
                      </MDTypography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h3"
                    textTransform="capitalize"
                    color={darkMode ? "white" : "dark"}
                    sx={{ mb: 1 }}
                  >
                    {title}
                  </MDTypography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <CategoryIcon color="secondary" />
                    <MDTypography variant="h6" ml={1} color="text" fontWeight="light">
                      {category}
                    </MDTypography>
                  </Box>

                  <Divider
                    sx={{
                      my: 2,
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                    }}
                  />

                  <Box display="flex" alignItems="center" mb={2}>
                    <EventAvailableIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text" fontWeight="light">
                      {formattedDate}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text" fontWeight="light">
                      {location}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text" fontWeight="light">
                      Organized by: {organizerName}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <EmailIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text" fontWeight="light">
                      {organizerEmail}
                    </MDTypography>
                  </Box>

                  <MDTypography
                    variant="h6"
                    color={darkMode ? "white" : "dark"}
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Event Description
                  </MDTypography>
                  <MDTypography
                    variant="body1"
                    paragraph
                    color="text"
                    fontWeight="light"
                    sx={{ mb: 3 }}
                  >
                    {description}
                  </MDTypography>

                  <MDButton
                    onClick={handleRegister}
                    variant="gradient"
                    color={isFull || new Date() > new Date(date) ? "error" : sidenavColor}
                    size="large"
                    fullWidth
                    disabled={isFull}
                    sx={{ mt: 2 }}
                  >
                    {isFull
                      ? "Event Full"
                      : new Date() > new Date(date)
                        ? "Event is Over Now"
                        : registerBtn}
                  </MDButton>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

EventCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  maxParticipants: PropTypes.number,
  currentParticipants: PropTypes.number.isRequired,
  organizerName: PropTypes.string.isRequired,
  organizerEmail: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isFull: PropTypes.bool.isRequired,
  _id: PropTypes.string.isRequired,
};

export default EventCard;
