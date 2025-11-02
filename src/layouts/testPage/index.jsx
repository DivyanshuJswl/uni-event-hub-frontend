/**
 * Component Testing Page
 * Comprehensive testing page for all MD components
 * @module layouts/component-testing
 */

import { useState } from "react";
import { Grid, Card, Divider, Icon } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDSnackbar from "components/MDSnackbar";
import MDPagination from "components/MDPagination";

const ComponentTestingPage = () => {
  // State for interactive components
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputSuccess, setInputSuccess] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(2);
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: "info",
    icon: "info",
    title: "",
    content: "",
  });

  const showNotification = (type, title, content) => {
    const icons = {
      success: "check_circle",
      error: "error",
      warning: "warning",
      info: "info",
    };

    setSnackbar({
      open: true,
      color: type,
      icon: icons[type],
      title,
      content,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateInput = (value) => {
    if (value.length === 0) {
      setInputError(false);
      setInputSuccess(false);
    } else if (value.length < 3) {
      setInputError(true);
      setInputSuccess(false);
    } else {
      setInputError(false);
      setInputSuccess(true);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Page Header */}
        <MDBox mb={3}>
          <MDTypography variant="h3" fontWeight="bold" gutterBottom>
            Component Testing Lab
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Comprehensive testing for all Material Dashboard components with dark mode support
          </MDTypography>
        </MDBox>

        {/* MDButton Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDButton Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <MDTypography variant="h6" mb={2}>
                    Variants
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDButton color="primary" variant="contained">
                      Contained
                    </MDButton>
                    <MDButton color="primary" variant="gradient">
                      Gradient
                    </MDButton>
                    <MDButton color="primary" variant="outlined">
                      Outlined
                    </MDButton>
                    <MDButton color="primary" variant="text">
                      Text
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={2}>
                    Colors
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDButton color="primary">Primary</MDButton>
                    <MDButton color="secondary">Secondary</MDButton>
                    <MDButton color="info">Info</MDButton>
                    <MDButton color="success">Success</MDButton>
                    <MDButton color="warning">Warning</MDButton>
                    <MDButton color="error">Error</MDButton>
                    <MDButton color="dark">Dark</MDButton>
                    <MDButton color="light">Light</MDButton>
                  </MDBox>
                </MDBox>

                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={2}>
                    Sizes
                  </MDTypography>
                  <MDBox display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <MDButton color="info" size="small">
                      Small
                    </MDButton>
                    <MDButton color="info" size="medium">
                      Medium
                    </MDButton>
                    <MDButton color="info" size="large">
                      Large
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={2}>
                    Icon Buttons
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDButton color="primary" iconOnly size="small">
                      <Icon>favorite</Icon>
                    </MDButton>
                    <MDButton color="info" iconOnly>
                      <Icon>edit</Icon>
                    </MDButton>
                    <MDButton color="success" iconOnly size="large">
                      <Icon>check</Icon>
                    </MDButton>
                    <MDButton color="error" iconOnly circular>
                      <Icon>delete</Icon>
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={2}>
                    States
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDButton color="primary">Normal</MDButton>
                    <MDButton color="primary" disabled>
                      Disabled
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDInput Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDInput Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDInput label="Normal Input" fullWidth placeholder="Enter text..." />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Interactive Input"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          validateInput(e.target.value);
                        }}
                        error={inputError}
                        success={inputSuccess}
                        helperText={
                          inputError
                            ? "Must be at least 3 characters"
                            : inputSuccess
                              ? "Looks good!"
                              : "Type at least 3 characters"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Error State"
                        fullWidth
                        error
                        helperText="This field has an error"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Success State"
                        fullWidth
                        success
                        helperText="This field is valid"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput label="Disabled Input" fullWidth disabled value="Cannot edit this" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Multiline Input"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Enter multiple lines..."
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDAlert Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDAlert Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <Grid container spacing={2}>
                    {alertVisible && (
                      <Grid item xs={12}>
                        <MDAlert color="info" dismissible>
                          <Icon>info</Icon>&nbsp; This is an info alert with dismissible option
                        </MDAlert>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <MDAlert color="success">
                        <Icon>check</Icon>&nbsp; Success! Your action was completed successfully
                      </MDAlert>
                    </Grid>
                    <Grid item xs={12}>
                      <MDAlert color="warning">
                        <Icon>warning</Icon>&nbsp; Warning! Please review your information
                      </MDAlert>
                    </Grid>
                    <Grid item xs={12}>
                      <MDAlert color="error">
                        <Icon>error</Icon>&nbsp; Error! Something went wrong
                      </MDAlert>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDBadge & MDAvatar Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDBadge Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <MDTypography variant="h6" mb={2}>
                    Colors & Variants
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDBadge badgeContent="4" color="primary">
                      <Icon>mail</Icon>
                    </MDBadge>
                    <MDBadge badgeContent="99+" color="error">
                      <Icon>notifications</Icon>
                    </MDBadge>
                    <MDBadge badgeContent="New" variant="contained" color="success">
                      <Icon>inbox</Icon>
                    </MDBadge>
                    <MDBadge badgeContent=" " circular indicator color="error">
                      <MDAvatar src="https://i.pravatar.cc/150?img=1" size="sm" />
                    </MDBadge>
                  </MDBox>

                  <MDBox mt={3}>
                    <MDTypography variant="h6" mb={2}>
                      Sizes
                    </MDTypography>
                    <MDBox display="flex" gap={2} alignItems="center" flexWrap="wrap">
                      <MDBadge badgeContent={5} size="xs" color="info">
                        <Icon fontSize="small">shopping_cart</Icon>
                      </MDBadge>
                      <MDBadge badgeContent={10} size="sm" color="info">
                        <Icon>shopping_cart</Icon>
                      </MDBadge>
                      <MDBadge badgeContent={15} size="md" color="info">
                        <Icon fontSize="large">shopping_cart</Icon>
                      </MDBadge>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDAvatar Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <MDTypography variant="h6" mb={2}>
                    Sizes
                  </MDTypography>
                  <MDBox display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <MDAvatar src="https://i.pravatar.cc/150?img=2" size="xs" />
                    <MDAvatar src="https://i.pravatar.cc/150?img=3" size="sm" />
                    <MDAvatar src="https://i.pravatar.cc/150?img=4" size="md" />
                    <MDAvatar src="https://i.pravatar.cc/150?img=5" size="lg" />
                    <MDAvatar src="https://i.pravatar.cc/150?img=6" size="xl" />
                  </MDBox>

                  <MDBox mt={3}>
                    <MDTypography variant="h6" mb={2}>
                      Colors & Initials
                    </MDTypography>
                    <MDBox display="flex" gap={2} flexWrap="wrap">
                      <MDAvatar bgColor="primary">AB</MDAvatar>
                      <MDAvatar bgColor="info">CD</MDAvatar>
                      <MDAvatar bgColor="success">EF</MDAvatar>
                      <MDAvatar bgColor="warning">GH</MDAvatar>
                      <MDAvatar bgColor="error">IJ</MDAvatar>
                    </MDBox>
                  </MDBox>

                  <MDBox mt={3}>
                    <MDTypography variant="h6" mb={2}>
                      With Shadow
                    </MDTypography>
                    <MDBox display="flex" gap={2} flexWrap="wrap">
                      <MDAvatar bgColor="primary" shadow="lg" size="lg">
                        <Icon>person</Icon>
                      </MDAvatar>
                      <MDAvatar src="https://i.pravatar.cc/150?img=7" shadow="xl" size="lg" />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDProgress Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDProgress Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="caption">Basic Progress (60%)</MDTypography>
                      <MDProgress value={60} color="info" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="caption">With Label</MDTypography>
                      <MDProgress value={75} color="success" label />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="caption">Gradient Variant</MDTypography>
                      <MDProgress value={85} color="primary" variant="gradient" label />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="caption">Different Colors</MDTypography>
                      <MDBox>
                        <MDProgress value={40} color="warning" label />
                        <MDBox mt={1}>
                          <MDProgress value={90} color="error" label />
                        </MDBox>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDPagination Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDPagination Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <MDTypography variant="h6" mb={2}>
                    Gradient Variant
                  </MDTypography>
                  <MDPagination>
                    <MDPagination item onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                      <Icon>keyboard_arrow_left</Icon>
                    </MDPagination>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <MDPagination
                        key={page}
                        item
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </MDPagination>
                    ))}
                    <MDPagination item onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}>
                      <Icon>keyboard_arrow_right</Icon>
                    </MDPagination>
                  </MDPagination>

                  <MDBox mt={3}>
                    <MDTypography variant="h6" mb={2}>
                      Contained Variant (Primary)
                    </MDTypography>
                    <MDPagination variant="contained" color="primary">
                      <MDPagination item>
                        <Icon>first_page</Icon>
                      </MDPagination>
                      <MDPagination item>
                        <Icon>chevron_left</Icon>
                      </MDPagination>
                      <MDPagination item active>
                        1
                      </MDPagination>
                      <MDPagination item>2</MDPagination>
                      <MDPagination item>3</MDPagination>
                      <MDPagination item>
                        <Icon>chevron_right</Icon>
                      </MDPagination>
                      <MDPagination item>
                        <Icon>last_page</Icon>
                      </MDPagination>
                    </MDPagination>
                  </MDBox>

                  <MDBox mt={3}>
                    <MDTypography variant="h6" mb={2}>
                      Different Sizes
                    </MDTypography>
                    <MDBox display="flex" flexDirection="column" gap={2}>
                      <MDPagination size="small">
                        <MDPagination item active>
                          1
                        </MDPagination>
                        <MDPagination item>2</MDPagination>
                        <MDPagination item>3</MDPagination>
                      </MDPagination>
                      <MDPagination size="large">
                        <MDPagination item active>
                          1
                        </MDPagination>
                        <MDPagination item>2</MDPagination>
                        <MDPagination item>3</MDPagination>
                      </MDPagination>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDSnackbar Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDSnackbar Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <MDTypography variant="body2" mb={2}>
                    Click buttons to test notifications
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <MDButton
                      color="success"
                      onClick={() =>
                        showNotification("success", "Success!", "Operation completed successfully")
                      }
                    >
                      Show Success
                    </MDButton>
                    <MDButton
                      color="error"
                      onClick={() => showNotification("error", "Error!", "Something went wrong")}
                    >
                      Show Error
                    </MDButton>
                    <MDButton
                      color="warning"
                      onClick={() =>
                        showNotification("warning", "Warning!", "Please review your action")
                      }
                    >
                      Show Warning
                    </MDButton>
                    <MDButton
                      color="info"
                      onClick={() =>
                        showNotification("info", "Information", "Here's some useful info")
                      }
                    >
                      Show Info
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDBox Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDBox Component
                </MDTypography>
                <Divider />

                <MDBox mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MDBox bgColor="primary" color="white" p={2} borderRadius="lg">
                        <MDTypography variant="body2">Primary Background</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox
                        variant="gradient"
                        bgColor="info"
                        color="white"
                        p={2}
                        borderRadius="lg"
                      >
                        <MDTypography variant="body2">Gradient Background</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox bgColor="success" color="white" p={2} borderRadius="xl" shadow="lg">
                        <MDTypography variant="body2">With Shadow</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox
                        bgColor="grey-200"
                        p={2}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="grey-300"
                      >
                        <MDTypography variant="body2">Grey Background</MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* MDTypography Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  MDTypography Component
                </MDTypography>
                <Divider />

                {/* Variants */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Typography Variants
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDTypography variant="h1">Heading 1 (h1)</MDTypography>
                    <MDTypography variant="h2">Heading 2 (h2)</MDTypography>
                    <MDTypography variant="h3">Heading 3 (h3)</MDTypography>
                    <MDTypography variant="h4">Heading 4 (h4)</MDTypography>
                    <MDTypography variant="h5">Heading 5 (h5)</MDTypography>
                    <MDTypography variant="h6">Heading 6 (h6)</MDTypography>
                    <MDTypography variant="body1">Body 1 - Regular paragraph text</MDTypography>
                    <MDTypography variant="body2">Body 2 - Secondary text</MDTypography>
                    <MDTypography variant="caption">Caption - Small text</MDTypography>
                    <MDTypography variant="button">BUTTON TEXT</MDTypography>
                  </MDBox>
                </MDBox>

                {/* Colors */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Text Colors
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDTypography color="primary">Primary Color Text</MDTypography>
                    <MDTypography color="secondary">Secondary Color Text</MDTypography>
                    <MDTypography color="info">Info Color Text</MDTypography>
                    <MDTypography color="success">Success Color Text</MDTypography>
                    <MDTypography color="warning">Warning Color Text</MDTypography>
                    <MDTypography color="error">Error Color Text</MDTypography>
                    <MDTypography color="dark">Dark Color Text</MDTypography>
                    <MDTypography color="text">Text Color</MDTypography>
                    <MDBox bgColor="dark" p={1} borderRadius="md">
                      <MDTypography color="white">White Color Text (on dark bg)</MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>

                {/* Font Weights */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Font Weights
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDTypography fontWeight="light">Light Weight (300)</MDTypography>
                    <MDTypography fontWeight="regular">Regular Weight (400)</MDTypography>
                    <MDTypography fontWeight="medium">Medium Weight (500)</MDTypography>
                    <MDTypography fontWeight="bold">Bold Weight (700)</MDTypography>
                  </MDBox>
                </MDBox>

                {/* Text Gradient */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Gradient Text
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={2}>
                    <MDTypography variant="h3" color="primary" textGradient fontWeight="bold">
                      Primary Gradient Heading
                    </MDTypography>
                    <MDTypography variant="h3" color="info" textGradient fontWeight="bold">
                      Info Gradient Heading
                    </MDTypography>
                    <MDTypography variant="h3" color="success" textGradient fontWeight="bold">
                      Success Gradient Heading
                    </MDTypography>
                    <MDTypography variant="h3" color="warning" textGradient fontWeight="bold">
                      Warning Gradient Heading
                    </MDTypography>
                    <MDTypography variant="h3" color="error" textGradient fontWeight="bold">
                      Error Gradient Heading
                    </MDTypography>
                    <MDTypography variant="h4" color="dark" textGradient>
                      Dark Gradient Text
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {/* Text Transform */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Text Transform
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDTypography textTransform="none">
                      None - Original Text Formatting
                    </MDTypography>
                    <MDTypography textTransform="uppercase">
                      uppercase - all letters in capitals
                    </MDTypography>
                    <MDTypography textTransform="lowercase">
                      LOWERCASE - ALL LETTERS IN SMALL
                    </MDTypography>
                    <MDTypography textTransform="capitalize">
                      capitalize - first letter of each word
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {/* Vertical Align */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Vertical Align
                  </MDTypography>
                  <MDBox>
                    <MDTypography>
                      Regular text{" "}
                      <MDTypography component="span" verticalAlign="super" variant="caption">
                        superscript
                      </MDTypography>{" "}
                      and{" "}
                      <MDTypography component="span" verticalAlign="sub" variant="caption">
                        subscript
                      </MDTypography>{" "}
                      text
                    </MDTypography>
                    <MDTypography mt={1}>
                      Baseline text{" "}
                      <MDTypography component="span" verticalAlign="middle" color="primary">
                        middle aligned
                      </MDTypography>{" "}
                      text
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {/* Opacity */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Opacity Levels
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDTypography opacity={1}>100% Opacity - Full visibility</MDTypography>
                    <MDTypography opacity={0.8}>80% Opacity - Slightly transparent</MDTypography>
                    <MDTypography opacity={0.6}>60% Opacity - Medium transparency</MDTypography>
                    <MDTypography opacity={0.4}>40% Opacity - More transparent</MDTypography>
                    <MDTypography opacity={0.2}>20% Opacity - Very transparent</MDTypography>
                  </MDBox>
                </MDBox>

                {/* Combined Styling */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Combined Styling
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={2}>
                    <MDTypography
                      variant="h2"
                      color="primary"
                      textGradient
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      Bold Gradient Uppercase
                    </MDTypography>

                    <MDTypography
                      variant="h4"
                      color="info"
                      fontWeight="medium"
                      textTransform="capitalize"
                      opacity={0.9}
                    >
                      Medium Weight Capitalized with Opacity
                    </MDTypography>

                    <MDBox bgColor="dark" p={2} borderRadius="lg" display="inline-block">
                      <MDTypography variant="h5" color="white" fontWeight="bold">
                        White Text on Dark Background
                      </MDTypography>
                      <MDTypography variant="body2" color="white" opacity={0.8} mt={1}>
                        Secondary text with reduced opacity for hierarchy
                      </MDTypography>
                    </MDBox>

                    <MDTypography
                      variant="body1"
                      color="text"
                      fontWeight="regular"
                      sx={{ lineHeight: 1.8 }}
                    >
                      This is a paragraph with custom line height for better readability. It
                      demonstrates how MDTypography can be combined with Material-UI's sx prop for
                      additional styling flexibility while maintaining consistency.
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {/* Real-world Examples */}
                <MDBox mt={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Real-world Usage Examples
                  </MDTypography>

                  {/* Page Title Example */}
                  <MDBox mb={3}>
                    <MDTypography variant="caption" color="text" textTransform="uppercase">
                      Page Title Pattern
                    </MDTypography>
                    <MDTypography variant="h3" fontWeight="bold" color="dark" gutterBottom>
                      Dashboard Overview
                    </MDTypography>
                    <MDTypography variant="body2" color="text" opacity={0.8}>
                      Welcome back! Here's what's happening with your projects today.
                    </MDTypography>
                  </MDBox>

                  {/* Card Header Example */}
                  <Card sx={{ mb: 2 }}>
                    <MDBox p={2}>
                      <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDTypography variant="h6" fontWeight="bold">
                          Statistics Card
                        </MDTypography>
                        <MDTypography variant="caption" color="success">
                          +23%
                        </MDTypography>
                      </MDBox>
                      <MDTypography variant="h4" fontWeight="bold" mt={1}>
                        $53,000
                      </MDTypography>
                      <MDTypography variant="caption" color="text" opacity={0.7}>
                        Last updated: 2 hours ago
                      </MDTypography>
                    </MDBox>
                  </Card>

                  {/* Status Message Example */}
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon color="success">check_circle</Icon>
                      <MDTypography variant="body2" color="success">
                        All systems operational
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon color="warning">warning</Icon>
                      <MDTypography variant="body2" color="warning">
                        Scheduled maintenance in 2 hours
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon color="error">error</Icon>
                      <MDTypography variant="body2" color="error">
                        Service temporarily unavailable
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Snackbar */}
      <MDSnackbar
        open={snackbar.open}
        color={snackbar.color}
        icon={snackbar.icon}
        title={snackbar.title}
        dateTime="Just now"
        content={snackbar.content}
        close={handleCloseSnackbar}
      />

      <Footer />
    </DashboardLayout>
  );
};

export default ComponentTestingPage;
