/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Divider,
  Icon,
  Modal,
  Box,
  IconButton,
  useMediaQuery,
  Grid,
  Fade,
  Backdrop,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { BASE_URL } from "utils/constants";

function EventCard({
  image,
  title,
  description,
  category,
  date,
  location,
  maxParticipants,
  status,
  _id,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [registerBtn, setRegisterBn] = useState("Register Now");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [err, setError] = useState();

  const handleRegister = async () => {
    registerBtn === "Register Now" ? setRegisterBn("Unenroll") : setRegisterBn("Register Now");
    try {
      const token = localStorage.getItem("token");
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

  return (
    <div>
      {/* Clickable Card */}
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MDBox padding="1rem">
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

          <MDBox pt={3} pb={1} px={1}>
            <MDTypography
              variant="h6"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
            >
              {title}..
            </MDTypography>
            <MDTypography
              component="div"
              variant="button"
              color={darkMode ? "white" : "text"}
              fontWeight="light"
            >
              {category}
            </MDTypography>
            <Divider
              sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" }}
            />
            <MDBox display="flex" alignItems="center" mt={1}>
              <MDTypography
                variant="button"
                color={darkMode ? "white" : "text"}
                sx={{ mt: 0.15, mr: 0.5 }}
              ></MDTypography>
              <MDTypography variant="button" color={darkMode ? "white" : "text"} fontWeight="light">
                📅 {date}
              </MDTypography>
            </MDBox>

            <MDBox display="flex" justifyContent="center" alignItems="center" padding="8px" mt={2}>
              <MDButton variant="gradient" color={sidenavColor} size="medium">
                SHOW DETAILS
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
                // color: "white",
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
            <Card>
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h3"
                    textTransform="capitalize"
                    color={darkMode ? "white" : "dark"}
                  >
                    {title}
                  </MDTypography>
                  <MDTypography
                    component="div"
                    variant="button"
                    color={darkMode ? "white" : "text"}
                    fontWeight="light"
                  >
                    {category}
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
                      {date}
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
                      {location}
                    </MDTypography>
                  </Box>

                  <MDTypography
                    variant="body1"
                    ml={1}
                    color={darkMode ? "white" : "text"}
                    fontWeight="medium"
                  >
                    Event Details
                  </MDTypography>
                  <MDTypography
                    variant="body2"
                    paragraph
                    ml={1}
                    color={darkMode ? "white" : "text"}
                    fontWeight="light"
                  >
                    {description}
                  </MDTypography>

                  <MDButton
                    onClick={handleRegister}
                    variant="gradient"
                    color={sidenavColor}
                    size="large"
                    fullWidth
                    sx={{ mt: 4 }}
                  >
                    {registerBtn}
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
  category: PropTypes.string,
};

export default EventCard;
