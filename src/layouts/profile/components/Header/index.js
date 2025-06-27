import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton"; // Import MDButton

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-marspic.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header({ name, avatar, children }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [isOrganizer, setIsOrganizer] = useState(false); // State to track organizer status
  const navigate = useNavigate();
  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();
    const org = localStorage.getItem("role");
    if (org === "organizer") {
      setIsOrganizer(true); // Set organizer status based on localStorage
    } else {
      setIsOrganizer(false); // Reset organizer status if not found
    }

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Handle becoming an organizer
  const handleBecomeOrganizer = async () => {
    const token = localStorage.getItem("token");
    setIsOrganizer(true);
    // Additional logic for becoming an organizer would go here
    try {
      const res = await axios.patch(
        BASE_URL + "/api/roles/upgrade-to-organizer",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
        { withCredentials: true }
      );

      console.log(res?.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token is invalid/expired - force logout
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/authentication/sign-in");
      }
      console.log(err);
    }
    localStorage.setItem("role", "organizer");
    console.log("User requested to become an organizer");
    //navigate("/authentication/sign-in");
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={avatar || burceMars} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5" fontWeight="medium">
                  {name}
                </MDTypography>
                {/* Become Organizer Button */}
                {!isOrganizer ? (
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="small"
                    onClick={handleBecomeOrganizer}
                    startIcon={<Icon>event_available</Icon>}
                    sx={{ ml: 2 }}
                  >
                    Become Organizer
                  </MDButton>
                ) : (
                  <MDBox
                    display="flex"
                    alignItems="center"
                    bgcolor="success.main"
                    borderRadius="lg"
                    px={1.5}
                    py={0.5}
                    ml={2}
                  >
                    <Icon color="success" sx={{ fontSize: "1rem", mr: 0.5 }}>
                      verified
                    </Icon>
                    <MDTypography
                      varient="gradient"
                      color="white"
                      fontWeight="regular"
                      fontSize="0.875rem"
                    >
                      Organizer
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>

              <MDTypography variant="button" color="text" fontWeight="regular">
                {}
                {/* Student details */}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
  name: "Student Name",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string, // Added avatar prop
};

export default Header;
