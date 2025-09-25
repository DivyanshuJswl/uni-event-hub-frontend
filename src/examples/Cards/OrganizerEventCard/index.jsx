import React, { useMemo, useState } from "react";
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
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  Alert,
  FormControl,
  Select as MuiSelect,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";

// Modal style matching ProfileInfoCard
const modalStyle = (darkMode) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: darkMode ? "background.default" : "background.paper",
  borderRadius: 3,
  boxShadow: 20,
  p: 0,
  zIndex: 1301,
  outline: "none",
  WebkitOverflowScrolling: "touch",
});

// Constants for validation
const ALLOWED_CATEGORIES = ["workshop", "seminar", "social", "hackathon", "technology", "cultural"];
const MIN_PARTICIPANTS = 1;
const MAX_PARTICIPANTS = 1000;

// Validation functions
const validateTitle = (title) => {
  return title.trim().length >= 5 && title.trim().length <= 150;
};

const validateDescription = (description) => {
  return description.trim().length >= 10 && description.trim().length <= 1000;
};

const validateLocation = (location) => {
  return location.trim().length >= 2 && location.trim().length <= 200;
};

const validateParticipants = (participants) => {
  const num = parseInt(participants);
  return !isNaN(num) && num >= MIN_PARTICIPANTS && num <= MAX_PARTICIPANTS;
};

const validateCategory = (category) => {
  return ALLOWED_CATEGORIES.includes(category.toLowerCase());
};

const validateDate = (date) => {
  return new Date(date) > new Date();
};

function OrganizerEventCard({ event, onUpdated }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { token } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [open, setOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmTimerId, setConfirmTimerId] = useState(null);
  const [details, setDetails] = useState(event);

  // Edit Event Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: 0,
    category: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  // Manage Participants Modal State
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [participantActionBusy, setParticipantActionBusy] = useState(false);
  const [newParticipantId, setNewParticipantId] = useState("");
  const [participantErrors, setParticipantErrors] = useState({});
  const [participantMessage, setParticipantMessage] = useState({ type: "", text: "" });

  const status = useMemo(() => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventEnd = event.endDate
      ? new Date(event.endDate)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    if (now < eventDate) return "upcoming";
    if (now >= eventDate && now <= eventEnd) return "ongoing";
    return "completed";
  }, [event.date, event.endDate]);

  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
        return "primary";
      case "ongoing":
        return "secondary";
      case "completed":
        return "error";
      default:
        return "default";
    }
  };

  const statusColor = getStatusColor();
  const participationPercentage = Math.round(
    ((event.participants?.length || 0) / Math.max(event.maxParticipants || 1, 1)) * 100
  );
  const canManage = status === "upcoming" || status === "ongoing";
  const formattedDate = new Date(event.date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const imageUrl =
    event.featuredImage?.url ||
    event.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60";

  // Event Handlers
  const handleOpen = async () => {
    setOpen(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/events/${event._id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDetails(res?.data?.data?.event || event);
    } catch (e) {
      console.error("Error fetching event details:", e);
      setDetails(event);
    }
  };

  const handleClose = () => setOpen(false);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleDelete = async () => {
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    try {
      setBusy(true);
      await axios.delete(`${BASE_URL}/api/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      onUpdated?.();
    } catch (err) {
      console.error("Error deleting event:", err);
    } finally {
      setBusy(false);
      handleMenuClose();
    }
  };

  const handleDeleteClick = (e) => {
    e?.stopPropagation?.();
    if (busy) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      if (confirmTimerId) {
        clearTimeout(confirmTimerId);
      }
      const id = setTimeout(() => setConfirmDelete(false), 3500);
      setConfirmTimerId(id);
      return;
    }
    // Confirmed
    setConfirmDelete(false);
    if (confirmTimerId) clearTimeout(confirmTimerId);
    handleDelete();
  };

  // Edit Event Modal Functions
  const openEditModal = () => {
    const src = details || event;
    setEditForm({
      title: src.title || "",
      description: src.description || "",
      location: src.location || "",
      date: src.date ? new Date(src.date).toISOString().slice(0, 16) : "",
      maxParticipants: src.maxParticipants || 0,
      category: src.category || "",
    });
    setEditErrors({});
    setEditMessage({ type: "", text: "" });
    setEditModalOpen(true);
    handleMenuClose();
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditErrors({});
    setEditMessage({ type: "", text: "" });
  };

  const validateEditField = (field, value) => {
    switch (field) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (!validateTitle(value)) return "Title must be between 5 and 100 characters";
        return "";

      case "description":
        if (!value.trim()) return "Description is required";
        if (!validateDescription(value))
          return "Description must be between 10 and 1000 characters";
        return "";

      case "location":
        if (!value.trim()) return "Location is required";
        if (!validateLocation(value)) return "Location must be between 3 and 200 characters";
        return "";

      case "date":
        if (!value) return "Date and time is required";
        if (!validateDate(value)) return "Event date must be in the future";
        return "";

      case "maxParticipants":
        if (!value) return "Maximum participants is required";
        if (!validateParticipants(value))
          return `Participants must be between ${MIN_PARTICIPANTS} and ${MAX_PARTICIPANTS}`;
        return "";

      case "category":
        if (!value) return "Category is required";
        if (!validateCategory(value))
          return `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`;
        return "";

      default:
        return "";
    }
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const saveEventEdit = async () => {
    // Validate all fields
    const newErrors = {};
    Object.keys(editForm).forEach((field) => {
      const error = validateEditField(field, editForm[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      setEditMessage({ type: "error", text: "Please fix the errors before saving" });
      return;
    }

    setEditLoading(true);
    setEditMessage({ type: "", text: "" });

    try {
      const body = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        location: editForm.location.trim(),
        date: new Date(editForm.date).toISOString(),
        maxParticipants: parseInt(editForm.maxParticipants),
        category: editForm.category.toLowerCase(),
      };

      await axios.patch(`${BASE_URL}/api/events/${event._id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEditMessage({ type: "success", text: "Event updated successfully!" });

      setTimeout(() => {
        closeEditModal();
        onUpdated?.();
      }, 1500);
    } catch (error) {
      console.error("Error updating event:", error);
      setEditMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update event. Please try again.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Manage Participants Modal Functions
  const openManageModal = () => {
    setManageModalOpen(true);
    setParticipantErrors({});
    setParticipantMessage({ type: "", text: "" });
    handleMenuClose();
  };

  const closeManageModal = () => {
    setManageModalOpen(false);
    setNewParticipantId("");
    setParticipantErrors({});
    setParticipantMessage({ type: "", text: "" });
  };

  const validateParticipantId = (id) => {
    if (!id.trim()) return "Student ID is required";
    if (id.trim().length < 3) return "Student ID must be at least 3 characters";
    return "";
  };

  const modifyParticipant = async (action, studentId) => {
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    const error = validateParticipantId(studentId);
    if (error) {
      setParticipantErrors({ studentId: error });
      return;
    }

    try {
      setParticipantActionBusy(true);
      setParticipantMessage({ type: "", text: "" });

      await axios.put(
        `${BASE_URL}/api/events/modify-participants/${event._id}`,
        { action, studentId: studentId.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Refresh details
      const res = await axios.get(`${BASE_URL}/api/events/${event._id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDetails(res?.data?.data?.event || details);

      setParticipantMessage({
        type: "success",
        text:
          action === "add"
            ? "Participant added successfully!"
            : "Participant removed successfully!",
      });

      setNewParticipantId("");
      onUpdated?.();
    } catch (error) {
      console.error("Error modifying participant:", error);
      setParticipantMessage({
        type: "error",
        text: error.response?.data?.message || `Failed to ${action} participant. Please try again.`,
      });
    } finally {
      setParticipantActionBusy(false);
    }
  };

  // Render Edit Event Modal following ProfileInfoCard pattern
  const renderEditEventModal = () => (
    <Modal
      open={editModalOpen}
      onClose={closeEditModal}
      aria-labelledby="edit-event-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
      closeAfterTransition
    >
      <Fade in={editModalOpen}>
        <Box sx={modalStyle(darkMode)}>
          {/* Header */}
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

          {/* Content */}
          <MDBox px={4} py={3}>
            {editMessage.text && (
              <Alert severity={editMessage.type || "info"} sx={{ mb: 2 }}>
                {editMessage.text}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Event Title
                  </MDTypography>
                  <MDInput
                    value={editForm.title}
                    onChange={(e) => handleEditFieldChange("title", e.target.value)}
                    error={!!editErrors.title}
                    helperText={editErrors.title}
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
                    value={editForm.description}
                    onChange={(e) => handleEditFieldChange("description", e.target.value)}
                    error={!!editErrors.description}
                    helperText={editErrors.description}
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
                  <FormControl fullWidth error={!!editErrors.category}>
                    <MuiSelect
                      value={editForm.category}
                      onChange={(e) => handleEditFieldChange("category", e.target.value)}
                      displayEmpty
                      sx={{ height: "2.75rem" }}
                    >
                      <MenuItem value="" disabaled>
                        Select category
                      </MenuItem>
                      {ALLOWED_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                    {editErrors.category && (
                      <MDTypography variant="caption" color="error">
                        {editErrors.category}
                      </MDTypography>
                    )}
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
                    value={editForm.maxParticipants}
                    onChange={(e) => handleEditFieldChange("maxParticipants", e.target.value)}
                    error={!!editErrors.maxParticipants}
                    helperText={editErrors.maxParticipants}
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
                  <MDInput
                    type="datetime-local"
                    value={editForm.date}
                    onChange={(e) => handleEditFieldChange("date", e.target.value)}
                    error={!!editErrors.date}
                    helperText={editErrors.date}
                    fullWidth
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                    Location
                  </MDTypography>
                  <MDInput
                    value={editForm.location}
                    onChange={(e) => handleEditFieldChange("location", e.target.value)}
                    error={!!editErrors.location}
                    helperText={editErrors.location}
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
                disabled={editLoading}
                startIcon={<CancelIcon />}
              >
                Cancel
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={saveEventEdit}
                disabled={editLoading}
                startIcon={editLoading ? <CircularProgress size={16} /> : <SaveIcon />}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );

  // Render Manage Participants Modal following ProfileInfoCard pattern
  const renderManageParticipantsModal = () => (
    <Modal
      open={manageModalOpen}
      onClose={closeManageModal}
      aria-labelledby="manage-participants-title"
      sx={{
        backdropFilter: "blur(8px) brightness(0.7)",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 1300,
      }}
      closeAfterTransition
    >
      <Fade in={manageModalOpen}>
        <Box sx={modalStyle(darkMode)}>
          {/* Header */}
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

          {/* Content */}
          <MDBox px={4} py={3}>
            {participantMessage.text && (
              <Alert severity={participantMessage.type || "info"} sx={{ mb: 2 }}>
                {participantMessage.text}
              </Alert>
            )}

            {/* Add Participant Section */}
            <MDBox mb={3}>
              <MDTypography variant="h6" color="text" fontWeight="bold" mb={2}>
                Add New Participant
              </MDTypography>
              <MDBox display="flex" gap={1} alignItems="flex-start">
                <MDBox flex={1}>
                  <MDInput
                    value={newParticipantId}
                    onChange={(e) => {
                      setNewParticipantId(e.target.value);
                      if (participantErrors.studentId) {
                        setParticipantErrors({});
                      }
                    }}
                    error={!!participantErrors.studentId}
                    helperText={participantErrors.studentId}
                    placeholder="Enter Student ID"
                    fullWidth
                  />
                </MDBox>
                <MDButton
                  variant="gradient"
                  color="success"
                  onClick={() => modifyParticipant("add", newParticipantId)}
                  disabled={participantActionBusy || !newParticipantId.trim()}
                  startIcon={
                    participantActionBusy ? <CircularProgress size={16} /> : <PersonAddIcon />
                  }
                >
                  Add
                </MDButton>
              </MDBox>
            </MDBox>

            <Divider sx={{ my: 2 }} />

            {/* Current Participants Section */}
            <MDBox>
              <MDTypography variant="h6" color="text" fontWeight="bold" mb={2}>
                Current Participants ({details?.participants?.length || 0})
              </MDTypography>

              {!details?.participants || details.participants.length === 0 ? (
                <MDBox textAlign="center" py={4}>
                  <MDTypography variant="body2" color="text">
                    No participants enrolled yet.
                  </MDTypography>
                </MDBox>
              ) : (
                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {details.participants.map((participant, index) => (
                    <ListItem
                      key={participant._id || index}
                      divider
                      sx={{
                        py: 1,
                        alignItems: "center",
                      }}
                    >
                      {/* Participant Info - Takes full available space */}
                      <MDBox sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                        <MDTypography
                          variant="button"
                          fontWeight="medium"
                          color="text"
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.875rem" },
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {participant.name || "Unknown User"}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.75rem" },
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {participant.email || participant._id}
                        </MDTypography>
                      </MDBox>

                      {/* Action Button - Icon only on mobile */}
                      <Tooltip title="Remove participant">
                        <MDButton
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={participantActionBusy}
                          onClick={() => modifyParticipant("remove", participant._id)}
                          sx={{
                            minWidth: "auto",
                            px: { xs: 1, sm: 2 },
                            width: { xs: "32px", sm: "auto" }, // Fixed width on mobile
                            height: { xs: "32px", sm: "auto" },
                            "& .MuiButton-startIcon": {
                              margin: { xs: 0, sm: "inherit" }, // Remove margin on mobile
                            },
                          }}
                        >
                          {/* Show only icon on mobile, icon + text on desktop */}
                          <PersonRemoveIcon sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />
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
                disabled={participantActionBusy}
              >
                Close
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Fade>
    </Modal>
  );

  return (
    <div>
      {/* Event Card */}
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: darkMode ? "background.default" : "background.paper",
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: darkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* Organizer Badge */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label="Organizer"
            color="primary"
            size="small"
            sx={{
              fontWeight: "bold",
              backgroundColor: darkMode ? "rgba(25, 118, 210, 0.9)" : "rgba(25, 118, 210, 0.9)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>

        <MDBox padding="1rem">
          <MDBox position="relative">
            <MDBox
              component="img"
              src={imageUrl}
              alt={event.title}
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
              color={statusColor}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
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
              {event.title}
            </MDTypography>

            <Box display="flex" alignItems="center" mt={0.5}>
              <CategoryIcon fontSize="small" color="secondary" />
              <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                {event.category || "Uncategorized"}
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
                {event.location || "Location not specified"}
              </MDTypography>
            </Box>

            <Box mb={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Box display="flex" alignItems="center">
                  <GroupIcon fontSize="small" color="secondary" />
                  <MDTypography variant="caption" ml={0.5} color="text" fontWeight="light">
                    {event.participants?.length || 0}/{event.maxParticipants || 0} spots filled
                  </MDTypography>
                </Box>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {participationPercentage}%
                </MDTypography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={participationPercentage}
                color={
                  (event.participants?.length || 0) >= (event.maxParticipants || 0)
                    ? "error"
                    : participationPercentage > 80
                      ? "warning"
                      : "secondary"
                }
                sx={{
                  height: 6,
                  borderRadius: 3,
                }}
              />
            </Box>

            <MDBox display="flex" justifyContent="center" alignItems="center" padding="8px" mt={2}>
              <MDButton
                variant="gradient"
                color={canManage ? sidenavColor : "secondary"}
                size="medium"
              >
                {canManage ? "MANAGE EVENT" : "VIEW DETAILS"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Action Menu */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)",
            "&:hover": {
              backgroundColor: darkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,1)",
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={openEditModal}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit details
          </MenuItem>
          <MenuItem onClick={openManageModal} disabled={!canManage}>
            <GroupIcon fontSize="small" sx={{ mr: 1 }} />
            Manage participants
          </MenuItem>
          <MenuItem
            onClick={handleDeleteClick}
            disabled={busy}
            sx={{ color: confirmDelete ? "error.main" : undefined }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {busy ? "Deleting..." : confirmDelete ? "Click again to confirm" : "Delete event"}
          </MenuItem>
        </Menu>
      </Card>

      {/* Render Modals */}
      {renderEditEventModal()}
      {renderManageParticipantsModal()}

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
          zIndex: 1200,
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
                    src={imageUrl}
                    alt={event.title}
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
                          label={status}
                          color={statusColor}
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
                        {participationPercentage}% filled
                      </MDTypography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={participationPercentage}
                      color={
                        (event.participants?.length || 0) >= (event.maxParticipants || 0)
                          ? "error"
                          : participationPercentage > 80
                            ? "warning"
                            : "secondary"
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography
                    variant="h3"
                    textTransform="capitalize"
                    color={darkMode ? "white" : "dark"}
                    sx={{ mb: 1 }}
                  >
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
                      {formattedDate}
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
                  <Box display="flex" flexDirection="column" gap={2}>
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
                      disabled={!canManage}
                    >
                      {canManage ? "Manage Participants" : "Participants Management Disabled"}
                    </MDButton>
                    <MDButton
                      onClick={handleDeleteClick}
                      variant="gradient"
                      color={confirmDelete ? "error" : "error"}
                      startIcon={<DeleteIcon />}
                      disabled={busy}
                    >
                      {busy
                        ? "Deleting Event..."
                        : confirmDelete
                          ? "Click again to confirm"
                          : "Delete Event"}
                    </MDButton>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

OrganizerEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  onUpdated: PropTypes.func,
};

export default OrganizerEventCard;
