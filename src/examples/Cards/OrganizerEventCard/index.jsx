import { useMemo, useState, useCallback, useEffect, memo } from "react";
import PropTypes from "prop-types";
import {
  Backdrop,
  Box,
  Card,
  Chip,
  Divider,
  Fade,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  FormControl,
  Select as MuiSelect,
  List,
  ListItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Group as GroupIcon,
  MoreVert as MoreVertIcon,
  EventAvailable as EventAvailableIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDProgress from "components/MDProgress";
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Constants
const ALLOWED_CATEGORIES = [
  "workshop",
  "seminar",
  "social",
  "hackathon",
  "technology",
  "cultural",
  "others",
];
const MIN_PARTICIPANTS = 1;
const MAX_PARTICIPANTS = 1000;

// Memoized validation functions
const validators = {
  title: (title) => title.trim().length >= 5 && title.trim().length <= 150,
  description: (description) =>
    description.trim().length >= 10 && description.trim().length <= 1000,
  location: (location) => location.trim().length >= 2 && location.trim().length <= 200,
  maxParticipants: (maxParticipants) => {
    const num = parseInt(maxParticipants);
    return !isNaN(num) && num >= MIN_PARTICIPANTS && num <= MAX_PARTICIPANTS;
  },
  category: (category) => ALLOWED_CATEGORIES.includes(category.toLowerCase()),
  date: (date) => new Date(date) > new Date(),
  participantId: (id) => id.trim().length >= 3,
};

const modalStyle = () => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.default",
  borderRadius: 3,
  boxShadow: 20,
  p: 0,
  zIndex: 1301,
  outline: "none",
});

function OrganizerEventCard({ event, onUpdated }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { token } = useAuth();
  const { showToast } = useNotifications();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Memoized picker theme
  const pickerTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: sidenavColor === "info" ? "#2196f3" : sidenavColor || "#1976d2",
          },
          background: {
            paper: darkMode ? "#030303ff" : "#e1e1e1ff",
            default: darkMode ? "#100e0eff" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
            secondary: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? "#030303ff" : "#e1e1e1ff",
                color: darkMode ? "#ffffff" : "#000000",
                borderRadius: 20,
                boxShadow: darkMode
                  ? "0px 0px 5px rgba(255, 255, 255, 0.15)"
                  : "0px 0px 5px rgba(0, 0, 0, 0.1)",
              },
            },
          },
          MuiPickersDay: {
            styleOverrides: {
              root: {
                color: darkMode ? "#ffffff" : "#000000",
                "&.Mui-selected": {
                  backgroundColor: sidenavColor === "info" ? "#2196f3" : sidenavColor,
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
                },
              },
            },
          },
          MuiPickersCalendarHeader: {
            styleOverrides: {
              root: { color: darkMode ? "#ffffff" : "#000000" },
            },
          },
          MuiClock: {
            styleOverrides: {
              root: { color: darkMode ? "#ffffff" : "#000000" },
              pin: {
                backgroundColor: sidenavColor === "info" ? "#2196f3" : sidenavColor,
              },
              clockPointer: {
                backgroundColor: sidenavColor === "info" ? "#2196f3" : sidenavColor,
              },
              clockNumber: { color: darkMode ? "#ffffff" : "#000000" },
            },
          },
        },
      }),
    [darkMode, sidenavColor]
  );

  // Consolidated state
  const [cardState, setCardState] = useState({
    open: false,
    menuAnchor: null,
    busy: false,
    confirmDelete: false,
    confirmTimerId: null,
    details: event,
  });

  const [editState, setEditState] = useState({
    modalOpen: false,
    loading: false,
    form: {
      title: "",
      description: "",
      location: "",
      date: "",
      maxParticipants: 0,
      category: "",
    },
    errors: {},
  });

  const [participantState, setParticipantState] = useState({
    modalOpen: false,
    actionBusy: false,
    newParticipantId: "",
    errors: {},
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (cardState.confirmTimerId) {
        clearTimeout(cardState.confirmTimerId);
      }
    };
  }, [cardState.confirmTimerId]);

  // Memoized calculations
  const eventMetrics = useMemo(() => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventEnd = event.endDate
      ? new Date(event.endDate)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    let status = "completed";
    if (now < eventDate) status = "upcoming";
    else if (now >= eventDate && now <= eventEnd) status = "ongoing";

    const statusColors = {
      upcoming: "primary",
      ongoing: "secondary",
      completed: "error",
    };

    const participationPercentage = Math.round(
      ((event.participants?.length || 0) / Math.max(event.maxParticipants || 1, 1)) * 100
    );

    const canManage = status === "upcoming" || status === "ongoing";

    return {
      status,
      statusColor: statusColors[status] || "default",
      participationPercentage,
      canManage,
    };
  }, [event.date, event.endDate, event.participants, event.maxParticipants]);

  const displayData = useMemo(
    () => ({
      formattedDate: new Date(event.date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      imageUrl:
        event.featuredImage?.url ||
        event.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60",
    }),
    [event]
  );

  // Memoized handlers
  const handleOpen = useCallback(async () => {
    setCardState((prev) => ({ ...prev, open: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/events/${event._id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000,
      });
      setCardState((prev) => ({ ...prev, details: res?.data?.data?.event || event }));
    } catch (e) {
      console.error("Error fetching event details:", e);
      showToast("Failed to load event details", "error", "Load Error");
    }
  }, [BASE_URL, event, token, showToast]);

  const handleClose = useCallback(() => {
    setCardState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleMenuOpen = useCallback((e) => {
    e.stopPropagation();
    setCardState((prev) => ({ ...prev, menuAnchor: e.currentTarget }));
  }, []);

  const handleMenuClose = useCallback(() => {
    setCardState((prev) => ({ ...prev, menuAnchor: null }));
  }, []);

  const handleDelete = useCallback(async () => {
    if (!token) return;

    try {
      setCardState((prev) => ({ ...prev, busy: true }));
      await axios.delete(`${BASE_URL}/api/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        timeout: 10000,
      });
      showToast("Event deleted successfully", "success", "Deleted");
      onUpdated?.();
    } catch (err) {
      console.error("Error deleting event:", err);
      showToast(err.response?.data?.message || "Failed to delete event", "error", "Delete Failed");
    } finally {
      setCardState((prev) => ({ ...prev, busy: false, menuAnchor: null }));
    }
  }, [token, BASE_URL, event._id, showToast, onUpdated]);

  const handleDeleteClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (cardState.busy) return;

      if (!cardState.confirmDelete) {
        if (cardState.confirmTimerId) clearTimeout(cardState.confirmTimerId);
        const id = setTimeout(
          () => setCardState((prev) => ({ ...prev, confirmDelete: false })),
          3500
        );
        setCardState((prev) => ({ ...prev, confirmDelete: true, confirmTimerId: id }));
        return;
      }

      if (cardState.confirmTimerId) clearTimeout(cardState.confirmTimerId);
      setCardState((prev) => ({ ...prev, confirmDelete: false }));
      handleDelete();
    },
    [cardState.busy, cardState.confirmDelete, cardState.confirmTimerId, handleDelete]
  );

  // Edit modal handlers
  const openEditModal = useCallback(() => {
    const src = cardState.details || event;
    setEditState({
      modalOpen: true,
      loading: false,
      form: {
        title: src.title || "",
        description: src.description || "",
        location: src.location || "",
        date: src.date ? new Date(src.date).toISOString().slice(0, 16) : "",
        maxParticipants: src.maxParticipants || 0,
        category: src.category || "",
      },
      errors: {},
    });
    handleMenuClose();
  }, [cardState.details, event, handleMenuClose]);

  const closeEditModal = useCallback(() => {
    setEditState((prev) => ({ ...prev, modalOpen: false, errors: {} }));
  }, []);

  const validateEditField = useCallback((field, value) => {
    const errorMessages = {
      title: "Title must be between 5 and 150 characters",
      description: "Description must be between 10 and 1000 characters",
      location: "Location must be between 2 and 200 characters",
      date: "Event date must be in the future",
      maxParticipants: `Participants must be between ${MIN_PARTICIPANTS} and ${MAX_PARTICIPANTS}`,
      category: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
    };

    if (!value && field !== "maxParticipants")
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (!validators[field](value)) return errorMessages[field];
    return "";
  }, []);

  const handleEditFieldChange = useCallback((field, value) => {
    setEditState((prev) => ({
      ...prev,
      form: { ...prev.form, [field]: value },
      errors: { ...prev.errors, [field]: "" },
    }));
  }, []);

  const saveEventEdit = useCallback(async () => {
    const newErrors = {};
    Object.keys(editState.form).forEach((field) => {
      const error = validateEditField(field, editState.form[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setEditState((prev) => ({ ...prev, errors: newErrors }));
      showToast("Please fix the errors before saving", "error", "Validation Error");
      return;
    }

    setEditState((prev) => ({ ...prev, loading: true }));

    try {
      const body = {
        title: editState.form.title.trim(),
        description: editState.form.description.trim(),
        location: editState.form.location.trim(),
        date: new Date(editState.form.date).toISOString(),
        maxParticipants: parseInt(editState.form.maxParticipants),
        category: editState.form.category.toLowerCase(),
      };

      await axios.patch(`${BASE_URL}/api/events/${event._id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        timeout: 10000,
      });

      showToast("Event updated successfully!", "success", "Updated");
      setTimeout(() => {
        closeEditModal();
        onUpdated?.();
      }, 1500);
    } catch (error) {
      console.error("Error updating event:", error);
      showToast(
        error.response?.data?.message || "Failed to update event",
        "error",
        "Update Failed"
      );
    } finally {
      setEditState((prev) => ({ ...prev, loading: false }));
    }
  }, [
    editState.form,
    validateEditField,
    BASE_URL,
    event._id,
    token,
    showToast,
    closeEditModal,
    onUpdated,
  ]);

  // Participant management handlers
  const openManageModal = useCallback(() => {
    setParticipantState({ modalOpen: true, actionBusy: false, newParticipantId: "", errors: {} });
    handleMenuClose();
  }, [handleMenuClose]);

  const closeManageModal = useCallback(() => {
    setParticipantState({ modalOpen: false, actionBusy: false, newParticipantId: "", errors: {} });
  }, []);

  const modifyParticipant = useCallback(
    async (action, studentId) => {
      if (!token) return;

      const error = !(studentId || "").trim()
        ? "Student ID is required"
        : !validators.participantId(studentId)
          ? "Student ID must be at least 3 characters"
          : "";
      if (error) {
        setParticipantState((prev) => ({ ...prev, errors: { studentId: error } }));
        return;
      }

      setParticipantState((prev) => ({ ...prev, actionBusy: true, errors: {} }));

      try {
        await axios.put(
          `${BASE_URL}/api/events/modify-participants/${event._id}`,
          { action, studentId: studentId.trim() },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
            timeout: 10000,
          }
        );

        const res = await axios.get(`${BASE_URL}/api/events/${event._id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
        setCardState((prev) => ({ ...prev, details: res?.data?.data?.event || prev.details }));

        showToast(
          action === "add"
            ? "Participant added successfully!"
            : "Participant removed successfully!",
          "success",
          action === "add" ? "Added" : "Removed"
        );

        setParticipantState((prev) => ({ ...prev, newParticipantId: "" }));
        onUpdated?.();
      } catch (error) {
        console.error("Error modifying participant:", error);
        showToast(
          error.response?.data?.message || `Failed to ${action} participant`,
          "error",
          `${action === "add" ? "Add" : "Remove"} Failed`
        );
      } finally {
        setParticipantState((prev) => ({ ...prev, actionBusy: false }));
      }
    },
    [token, BASE_URL, event._id, showToast, onUpdated]
  );

  // Render edit modal
  const renderEditModal = useMemo(
    () => (
      <Modal
        open={editState.modalOpen}
        onClose={closeEditModal}
        sx={{
          backdropFilter: "blur(8px) brightness(0.7)",
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 1300,
        }}
        closeAfterTransition
      >
        <Fade in={editState.modalOpen}>
          <Box sx={modalStyle()}>
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={3}
              py={2}
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <MDBox display="flex" alignItems="center" gap={1}>
                <EditIcon sx={{ color: "white" }} />
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Edit Event Details
                </MDTypography>
              </MDBox>
              <IconButton onClick={closeEditModal} size="small" sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </MDBox>

            <MDBox px={4} py={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Event Title
                    </MDTypography>
                    <MDInput
                      value={editState.form.title}
                      onChange={(e) => handleEditFieldChange("title", e.target.value)}
                      error={!!editState.errors.title}
                      helperText={editState.errors.title}
                      fullWidth
                      placeholder="Enter event title"
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Description
                    </MDTypography>
                    <MDInput
                      value={editState.form.description}
                      onChange={(e) => handleEditFieldChange("description", e.target.value)}
                      error={!!editState.errors.description}
                      helperText={editState.errors.description}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Enter event description"
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Category
                    </MDTypography>
                    <FormControl fullWidth error={!!editState.errors.category}>
                      <MuiSelect
                        value={editState.form.category}
                        onChange={(e) => handleEditFieldChange("category", e.target.value)}
                        displayEmpty
                        sx={{ height: "2.75rem" }}
                      >
                        <MenuItem value="" disabled>
                          Select category
                        </MenuItem>
                        {ALLOWED_CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Max Participants
                    </MDTypography>
                    <MDInput
                      type="number"
                      value={editState.form.maxParticipants}
                      onChange={(e) => handleEditFieldChange("maxParticipants", e.target.value)}
                      error={!!editState.errors.maxParticipants}
                      helperText={editState.errors.maxParticipants}
                      fullWidth
                      inputProps={{ min: MIN_PARTICIPANTS, max: MAX_PARTICIPANTS }}
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Date & Time
                    </MDTypography>
                    <ThemeProvider theme={pickerTheme}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          disablePast
                          value={editState.form.date ? dayjs(editState.form.date) : null}
                          onChange={(newValue) => {
                            // Convert to ISO string format for your state
                            const isoString = newValue ? newValue.toISOString() : "";
                            handleEditFieldChange("date", isoString);
                          }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              height: "2.75rem",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </ThemeProvider>
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                      Location
                    </MDTypography>
                    <MDInput
                      value={editState.form.location}
                      onChange={(e) => handleEditFieldChange("location", e.target.value)}
                      error={!!editState.errors.location}
                      helperText={editState.errors.location}
                      fullWidth
                      placeholder="Enter event location"
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={closeEditModal}
                  disabled={editState.loading}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={saveEventEdit}
                  disabled={editState.loading}
                  startIcon={editState.loading ? <CircularProgress size={16} /> : <SaveIcon />}
                >
                  {editState.loading ? "Saving..." : "Save Changes"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
    ),
    [editState, closeEditModal, handleEditFieldChange, saveEventEdit]
  );

  // Render manage participants modal
  const renderManageModal = useMemo(
    () => (
      <Modal
        open={participantState.modalOpen}
        onClose={closeManageModal}
        sx={{
          backdropFilter: "blur(8px) brightness(0.7)",
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 1300,
        }}
        closeAfterTransition
      >
        <Fade in={participantState.modalOpen}>
          <Box sx={modalStyle()}>
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={3}
              py={2}
              sx={{
                background: "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <MDBox display="flex" alignItems="center" gap={1}>
                <GroupIcon sx={{ color: "white" }} />
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Manage Participants
                </MDTypography>
              </MDBox>
              <IconButton onClick={closeManageModal} size="small" sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </MDBox>

            <MDBox px={4} py={3}>
              <MDBox mb={3}>
                <MDTypography variant="h6" color="text" fontWeight="bold" mb={2}>
                  Add New Participant
                </MDTypography>
                <MDBox display="flex" gap={1}>
                  <MDBox flex={1}>
                    <MDInput
                      value={participantState.newParticipantId}
                      onChange={(e) =>
                        setParticipantState((prev) => ({
                          ...prev,
                          newParticipantId: e.target.value,
                          errors: {},
                        }))
                      }
                      error={!!participantState.errors.studentId}
                      helperText={participantState.errors.studentId}
                      placeholder="Enter Student ID"
                      fullWidth
                    />
                  </MDBox>
                  <MDButton
                    variant="gradient"
                    color="success"
                    onClick={() => modifyParticipant("add", participantState.newParticipantId)}
                    disabled={
                      participantState.actionBusy || !participantState.newParticipantId.trim()
                    }
                    startIcon={
                      participantState.actionBusy ? (
                        <CircularProgress size={16} />
                      ) : (
                        <PersonAddIcon />
                      )
                    }
                  >
                    Add
                  </MDButton>
                </MDBox>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox>
                <MDTypography variant="h6" color="text" fontWeight="bold" mb={2}>
                  Current Participants ({cardState.details?.participants?.length || 0})
                </MDTypography>

                {!cardState.details?.participants || cardState.details.participants.length === 0 ? (
                  <MDBox textAlign="center" py={4}>
                    <MDTypography variant="body2" color="text">
                      No participants enrolled yet.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {cardState.details.participants.map((participant, index) => (
                      <ListItem key={participant._id || index} divider sx={{ py: 1 }}>
                        <MDBox sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                          <MDTypography variant="button" fontWeight="medium" color="text">
                            {participant.name || "Unknown User"}
                          </MDTypography>
                          <MDTypography variant="caption" color="secondary" display="block">
                            {participant.email || participant._id}
                          </MDTypography>
                        </MDBox>
                        <Tooltip title="Remove participant">
                          <MDButton
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={participantState.actionBusy}
                            onClick={() => modifyParticipant("remove", participant._id)}
                            sx={{ minWidth: "auto", px: { xs: 1, sm: 2 } }}
                          >
                            <PersonRemoveIcon />
                            <Box
                              component="span"
                              sx={{ display: { xs: "none", sm: "inline" }, ml: 1 }}
                            >
                              Remove
                            </Box>
                          </MDButton>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                )}
              </MDBox>

              <MDBox display="flex" justifyContent="flex-end" mt={3}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={closeManageModal}
                  disabled={participantState.actionBusy}
                >
                  Close
                </MDButton>
              </MDBox>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
    ),
    [participantState, cardState.details, closeManageModal, modifyParticipant]
  );

  return (
    <>
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
          <Chip icon={<CheckCircleIcon />} label="Organizer" color="primary" size="small" />
        </Box>

        <MDBox padding="1rem">
          <MDBox position="relative">
            <MDBox
              component="img"
              src={displayData.imageUrl}
              alt={event.title}
              width="100%"
              height="12.5rem"
              sx={{ objectFit: "cover", borderRadius: "0.6rem", mt: -5 }}
            />
            <Chip
              label={eventMetrics.status}
              color={eventMetrics.statusColor}
              size="small"
              sx={{ position: "absolute", top: 10, right: 10, fontWeight: "bold" }}
            />
          </MDBox>

          <MDBox pt={3} pb={1} px={1}>
            <MDTypography
              variant="h6"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
            >
              {event.title}
            </MDTypography>

            <Box display="flex" alignItems="center" mt={0.5}>
              <CategoryIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text">
                {event.category || "Uncategorized"}
              </MDTypography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" alignItems="center" mb={0.5}>
              <EventAvailableIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text">
                {displayData.formattedDate}
              </MDTypography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text">
                {event.location || "Location not specified"}
              </MDTypography>
            </Box>

            <Box mb={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Box display="flex" alignItems="center">
                  <GroupIcon fontSize="small" color="secondary" />
                  <MDTypography variant="caption" ml={0.5} color="text">
                    {event.participants?.length || 0}/{event.maxParticipants || 0} spots filled
                  </MDTypography>
                </Box>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {eventMetrics.participationPercentage}%
                </MDTypography>
              </Box>
              <MDProgress
                variant="contained"
                value={eventMetrics.participationPercentage}
                color={
                  (event.participants?.length || 0) >= (event.maxParticipants || 0)
                    ? "error"
                    : eventMetrics.participationPercentage > 80
                      ? "warning"
                      : "secondary"
                }
              />
            </Box>

            <MDBox display="flex" justifyContent="center" mt={2}>
              <MDButton
                variant="gradient"
                color={eventMetrics.canManage ? sidenavColor : "secondary"}
                size="medium"
              >
                {eventMetrics.canManage ? "MANAGE EVENT" : "VIEW DETAILS"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "grey.400",
            color: "white",
            "&:hover": { backgroundColor: "grey.600" },
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={cardState.menuAnchor}
          open={Boolean(cardState.menuAnchor)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={openEditModal}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit details
          </MenuItem>
          <MenuItem onClick={openManageModal} disabled={!eventMetrics.canManage}>
            <GroupIcon fontSize="small" sx={{ mr: 1 }} />
            Manage participants
          </MenuItem>
          <MenuItem
            onClick={handleDeleteClick}
            disabled={cardState.busy}
            sx={{ color: cardState.confirmDelete ? "error.main" : undefined }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {cardState.busy
              ? "Deleting..."
              : cardState.confirmDelete
                ? "Click again to confirm"
                : "Delete event"}
          </MenuItem>
        </Menu>
      </Card>

      {renderEditModal}
      {renderManageModal}

      <Modal
        open={cardState.open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}
      >
        <Fade in={cardState.open} timeout={300}>
          <Box
            sx={{
              position: "relative",
              width: isMobile ? "90vw" : "70vw",
              maxHeight: "90vh",
              bgcolor: "background.default",
              boxShadow: 24,
              borderRadius: "16px",
              overflow: "auto",
              outline: "none",
              transform: cardState.open ? "scale(1)" : "scale(0.9)",
              opacity: cardState.open ? 1 : 0,
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <IconButton
              onClick={handleClose}
              color={sidenavColor}
              sx={{ position: "absolute", right: 30, top: 25, zIndex: 1000 }}
            >
              <CloseIcon />
            </IconButton>

            <Card>
              <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={displayData.imageUrl}
                    alt={event.title}
                    sx={{ width: "100%", borderRadius: "12px" }}
                  />
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                        Event Status
                      </MDTypography>
                      <Box display="flex" gap={1}>
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Organizer"
                          color="primary"
                          size="medium"
                          sx={{
                            fontWeight: "bold",
                          }}
                        />
                        <Chip
                          label={eventMetrics.status}
                          color={eventMetrics.statusColor}
                          size="medium"
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDTypography variant="body2" color="text">
                        {event.participants?.length || 0}/{event.maxParticipants || 0} participants
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {eventMetrics.participationPercentage}% filled
                      </MDTypography>
                    </Box>
                    <MDProgress
                      variant="contained"
                      value={eventMetrics.participationPercentage}
                      color={
                        (event.participants?.length || 0) >= (event.maxParticipants || 0)
                          ? "error"
                          : eventMetrics.participationPercentage > 80
                            ? "warning"
                            : "secondary"
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="h3" textTransform="capitalize" sx={{ mb: 1 }}>
                    {event.title}
                  </MDTypography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CategoryIcon color="secondary" />
                    <MDTypography variant="h6" ml={1} color="text" fontWeight="light">
                      {event.category || "Uncategorized"}
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
                      {displayData.formattedDate}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon color="secondary" />
                    <MDTypography variant="body1" ml={1} color="text" fontWeight="light">
                      {event.location || "Location not specified"}
                    </MDTypography>
                  </Box>

                  <MDTypography variant="h6" color={darkMode ? "white" : "dark"} sx={{ mb: 2 }}>
                    Organizer Actions
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={2} mt={3}>
                    <MDButton
                      onClick={openEditModal}
                      variant="gradient"
                      color={sidenavColor}
                      startIcon={<EditIcon />}
                    >
                      Edit Event Details
                    </MDButton>
                    <MDButton
                      onClick={openManageModal}
                      variant="gradient"
                      color="secondary"
                      startIcon={<GroupIcon />}
                      disabled={!eventMetrics.canManage}
                    >
                      {eventMetrics.canManage
                        ? "Manage Participants"
                        : "Participants Management Disabled"}
                    </MDButton>
                    <MDButton
                      onClick={handleDeleteClick}
                      variant="gradient"
                      color="error"
                      startIcon={<DeleteIcon />}
                      disabled={cardState.busy}
                    >
                      {cardState.busy
                        ? "Deleting Event..."
                        : cardState.confirmDelete
                          ? "Click again to confirm"
                          : "Delete Event"}
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

OrganizerEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  onUpdated: PropTypes.func,
};

OrganizerEventCard.displayName = "OrganizerEventCard";

export default memo(OrganizerEventCard);
