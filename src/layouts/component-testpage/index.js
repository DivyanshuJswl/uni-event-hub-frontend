import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Fab,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Avatar,
  CircularProgress,
  LinearProgress,
  Alert,
  AlertTitle,
  Rating,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Share,
  ExpandMore,
  Home,
  Info,
  Mail,
  Delete,
  Add,
  Remove,
  Notifications,
  Search,
  Menu,
  CloudUpload,
  Send,
  Navigation as NavigationIcon,
  Star,
  StarBorder,
  Dashboard,
} from "@mui/icons-material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ComponentTestPage = () => {
  // State for controlling component behaviors
  const [textValue, setTextValue] = useState("");
  const [sliderValue, setSliderValue] = useState(50);
  const [checkboxValues, setCheckboxValues] = useState({
    option1: true,
    option2: false,
  });
  const [radioValue, setRadioValue] = useState("option1");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [selectValue, setSelectValue] = useState("option1");
  const [tabValue, setTabValue] = useState(0);
  const [toggleValue, setToggleValue] = useState(["bold"]);
  const [ratingValue, setRatingValue] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState("panel1");

  const handleCheckboxChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
  };

  const handleToggleChange = (event, newFormats) => {
    setToggleValue(newFormats);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          MUI Component Test Page
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Use this page to test and visualize Material-UI components
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Inputs Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Basic Inputs
              </Typography>

              <TextField
                label="Text Field"
                variant="outlined"
                fullWidth
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select</InputLabel>
                <Select
                  value={selectValue}
                  label="Select"
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>

              <Slider
                value={sliderValue}
                onChange={(e, newValue) => setSliderValue(newValue)}
                aria-labelledby="continuous-slider"
                sx={{ mb: 2 }}
              />

              <FormGroup sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxValues.option1}
                      onChange={handleCheckboxChange}
                      name="option1"
                    />
                  }
                  label="Option 1"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxValues.option2}
                      onChange={handleCheckboxChange}
                      name="option2"
                    />
                  }
                  label="Option 2"
                />
              </FormGroup>

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup
                  aria-label="options"
                  name="options"
                  value={radioValue}
                  onChange={(e) => setRadioValue(e.target.value)}
                >
                  <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                  <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                  />
                }
                label="Switch"
                sx={{ mb: 2 }}
              />

              <ToggleButtonGroup
                value={toggleValue}
                onChange={handleToggleChange}
                aria-label="text formatting"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="bold" aria-label="bold">
                  <Typography fontWeight="bold">B</Typography>
                </ToggleButton>
                <ToggleButton value="italic" aria-label="italic">
                  <Typography fontStyle="italic">I</Typography>
                </ToggleButton>
                <ToggleButton value="underlined" aria-label="underlined">
                  <Typography textDecoration="underline">U</Typography>
                </ToggleButton>
              </ToggleButtonGroup>

              <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                }}
                sx={{ mb: 2 }}
              />
            </Paper>
          </Grid>

          {/* Buttons & Indicators Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Buttons & Indicators
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="contained" disabled>
                  Disabled
                </Button>
                <Button variant="contained" startIcon={<Send />}>
                  With Icon
                </Button>
                <IconButton color="primary" aria-label="upload">
                  <CloudUpload />
                </IconButton>
                <IconButton color="secondary" aria-label="delete">
                  <Delete />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Badge badgeContent={4} color="primary">
                  <Mail />
                </Badge>
                <Badge badgeContent={100} color="secondary" max={99}>
                  <Notifications />
                </Badge>
                <Badge variant="dot" color="error">
                  <Mail />
                </Badge>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
                <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
                <Avatar src="/broken-image.jpg" />
                <Avatar>
                  <Favorite />
                </Avatar>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Tooltip title="Tooltip text">
                  <Button>Hover for tooltip</Button>
                </Tooltip>
                <Chip label="Basic Chip" />
                <Chip label="Clickable Chip" clickable />
                <Chip label="Deletable Chip" onDelete={() => {}} />
                <Chip label="Colored Chip" color="primary" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button onClick={startLoading} sx={{ mb: 2 }}>
                  {loading ? "Loading..." : "Start Loading"}
                </Button>
                {loading && <CircularProgress />}
                <LinearProgress variant="determinate" value={sliderValue} sx={{ mt: 2 }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Skeleton variant="text" width={200} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rounded" width={210} height={60} />
              </Box>
            </Paper>
          </Grid>

          {/* Navigation & Feedback Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Navigation & Feedback
              </Typography>

              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" disabled />
              </Tabs>

              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="#">
                  Home
                </Link>
                <Link underline="hover" color="inherit" href="#">
                  Core
                </Link>
                <Typography color="text.primary">Breadcrumb</Typography>
              </Breadcrumbs>

              <Box sx={{ mb: 2 }}>
                <Accordion
                  expanded={expandedAccordion === "panel1"}
                  onChange={handleAccordionChange("panel1")}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Accordion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Content for Accordion 1</Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expandedAccordion === "panel2"}
                  onChange={handleAccordionChange("panel2")}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Accordion 2</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Content for Accordion 2</Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                  Open Dialog
                </Button>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogContent>
                    <Typography>
                      This is a dialog content. You can put any component here.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenDialog(false)} autoFocus>
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={() => setOpenSnackbar(true)}>
                  Open Snackbar
                </Button>
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                  message="This is a snackbar message"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Alert severity="error" sx={{ mb: 1 }}>
                  <AlertTitle>Error</AlertTitle>
                  This is an error alert — check it out!
                </Alert>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <AlertTitle>Warning</AlertTitle>
                  This is a warning alert — check it out!
                </Alert>
                <Alert severity="info" sx={{ mb: 1 }}>
                  <AlertTitle>Info</AlertTitle>
                  This is an info alert — check it out!
                </Alert>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  This is a success alert — check it out!
                </Alert>
              </Box>
            </Paper>
          </Grid>

          {/* Data Display Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Data Display
              </Typography>

              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                    ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>

              <List sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Mail />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText primary="Information" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>
              </List>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Tooltip title="Add">
                  <Fab color="primary" aria-label="add" size="small">
                    <Add />
                  </Fab>
                </Tooltip>
                <Tooltip title="Remove">
                  <Fab color="secondary" aria-label="remove" size="small">
                    <Remove />
                  </Fab>
                </Tooltip>
                <Fab variant="extended" color="primary">
                  <NavigationIcon sx={{ mr: 1 }} />
                  Navigate
                </Fab>
                <Fab disabled aria-label="disabled">
                  <Favorite />
                </Fab>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ComponentTestPage;
