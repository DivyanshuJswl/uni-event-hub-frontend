import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Avatar,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MDButton from "components/MDButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

const CreateEvent = ({ onEventCreated }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { handleSubmit, control, reset } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { showToast } = useNotifications();
  const { token } = useAuth();

  // Consolidated state
  const [formState, setFormState] = useState({
    isSubmitting: false,
    imagePreview: null,
    imageFile: null,
    createdEvent: null,
  });

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

  // Handle image change
  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        showToast(
          "Please upload a valid image file (JPEG, PNG, GIF, WebP)",
          "warning",
          "Invalid File Type"
        );
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast("Image size should be less than 5MB", "warning", "File Too Large");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  // Remove image
  const removeImage = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      imagePreview: null,
      imageFile: null,
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    reset({
      title: "",
      description: "",
      date: null,
      location: "",
      capacity: "",
      category: "",
      eventURL: "",
      enableRegistration: false,
      digitalCertificates: false,
      sendReminders: false,
    });
    setFormState({
      isSubmitting: false,
      imagePreview: null,
      imageFile: null,
      createdEvent: null,
    });
  }, [reset]);

  // Form submission
  const onSubmit = useCallback(
    async (data) => {
      // Validation
      if (!data.title || !data.date || !data.location || !data.category || !data.capacity) {
        showToast("Please fill in all required fields", "warning", "Missing Required Fields");
        return;
      }

      if (data.capacity <= 0 || isNaN(data.capacity)) {
        showToast("Capacity must be a positive number", "warning", "Invalid Capacity");
        return;
      }

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const formData = new FormData();
        const formattedDate = dayjs(data.date).toISOString();

        // Append all fields
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("date", formattedDate);
        formData.append("location", data.location);
        formData.append("maxParticipants", data.capacity);
        formData.append("category", data.category);
        formData.append("eventURL", data.eventURL || "");
        formData.append("enableRegistration", data.enableRegistration ? "true" : "false");
        formData.append("digitalCertificates", data.digitalCertificates ? "true" : "false");
        formData.append("sendReminders", data.sendReminders ? "true" : "false");

        if (formState.imageFile) {
          formData.append("image", formState.imageFile);
        }

        const response = await axios.post(`${BASE_URL}/api/events/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          timeout: 30000,
        });

        if (response.data.status === "success") {
          const event = response.data.data.event;
          setFormState((prev) => ({
            ...prev,
            createdEvent: event,
            isSubmitting: false,
          }));

          showToast(`Event "${data.title}" created successfully!`, "success", "Event Published");

          // Call parent callback to refresh events list
          if (onEventCreated) {
            onEventCreated();
          }

          resetForm();
        }
      } catch (err) {
        console.error("Error creating event:", err);

        let errorMessage = "Failed to create event";

        if (err.response) {
          if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.status === 400) {
            errorMessage = "Invalid data - Please check all fields";
          } else if (err.response.status === 401) {
            errorMessage = "Unauthorized - Please login again";
          } else if (err.response.status === 413) {
            errorMessage = "File too large - Max 5MB";
          } else if (err.response.status === 500) {
            errorMessage = "Server error - Please try again later";
          }
        } else if (err.code === "ERR_NETWORK") {
          errorMessage = "Network error - Check your connection";
        } else if (err.code === "ECONNABORTED") {
          errorMessage = "Request timeout - Please try again";
        }

        showToast(errorMessage, "error", "Creation Failed");
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [BASE_URL, token, formState.imageFile, showToast, resetForm, onEventCreated]
  );

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && e.target.type !== "textarea") {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    },
    [handleSubmit, onSubmit]
  );

  // Event categories
  const categories = useMemo(
    () => [
      { value: "workshop", label: "Workshop" },
      { value: "seminar", label: "Seminar" },
      { value: "social", label: "Social" },
      { value: "hackathon", label: "Hackathon" },
      { value: "cultural", label: "Cultural" },
      { value: "technology", label: "Technology" },
      { value: "others", label: "Others" },
    ],
    []
  );

  return (
    <Box sx={{ backgroundColor: "background.default", py: 1, minHeight: "100vh" }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: darkMode ? 1 : 3, overflow: "visible" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "text.main",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Create New Event
              </Typography>

              {formState.createdEvent ? (
                <Box sx={{ textAlign: "center", p: 4, backgroundColor: "background.default" }}>
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Event Created Successfully!
                  </Typography>
                  {(formState.createdEvent.featuredImage?.url ||
                    formState.createdEvent.images?.[0]?.url) && (
                    <Avatar
                      src={
                        formState.createdEvent.featuredImage?.url ||
                        formState.createdEvent.images?.[0]?.url
                      }
                      alt="Event cover"
                      sx={{
                        width: 200,
                        height: 200,
                        mx: "auto",
                        mb: 2,
                        border: "3px solid",
                        borderColor: "success.main",
                      }}
                      variant="rounded"
                    />
                  )}
                  <MDTypography variant="h6" gutterBottom color={darkMode ? "white" : "dark"}>
                    {formState.createdEvent.title}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    {dayjs(formState.createdEvent.date).format("MMMM D, YYYY h:mm A")}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    {formState.createdEvent.location}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    Category: {formState.createdEvent.category}
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    sx={{ mt: 3 }}
                    onClick={resetForm}
                  >
                    Create Another Event
                  </MDButton>
                </Box>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    {/* Title */}
                    <Grid item xs={12}>
                      <Controller
                        name="title"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Event title is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Event Title"
                            variant="outlined"
                            required
                            error={!!error}
                            helperText={error?.message}
                            onKeyPress={handleKeyPress}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Date & Time */}
                    <Grid item xs={12}>
                      <ThemeProvider theme={pickerTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="date"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "Event date and time is required" }}
                            render={({
                              field: { onChange, value, ref },
                              fieldState: { error },
                            }) => (
                              <DateTimePicker
                                disablePast
                                onChange={onChange}
                                value={value ? dayjs(value) : null}
                                label="Event Date & Time"
                                sx={{
                                  width: "100%",
                                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                                }}
                                slotProps={{
                                  textField: {
                                    variant: "outlined",
                                    required: true,
                                    error: !!error,
                                    helperText: error?.message,
                                    onKeyPress: handleKeyPress,
                                    inputRef: ref,
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </ThemeProvider>
                    </Grid>

                    {/* Category & Capacity */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label" required>
                          Category
                        </InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          rules={{ required: "Category is required" }}
                          render={({ field, fieldState: { error } }) => (
                            <Select
                              {...field}
                              labelId="category-label"
                              label="Category"
                              variant="outlined"
                              error={!!error}
                              sx={{ borderRadius: 2, height: "2.75rem" }}
                            >
                              {categories.map((cat) => (
                                <MenuItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="capacity"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Capacity is required",
                          min: { value: 1, message: "Capacity must be at least 1" },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Capacity"
                            type="number"
                            variant="outlined"
                            required
                            error={!!error}
                            helperText={error?.message}
                            onKeyPress={handleKeyPress}
                            inputProps={{ min: 1 }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12}>
                      <Controller
                        name="location"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Location is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Location (Online or Venue)"
                            variant="outlined"
                            required
                            error={!!error}
                            helperText={error?.message}
                            onKeyPress={handleKeyPress}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Event URL */}
                    <Grid item xs={12}>
                      <Controller
                        name="eventURL"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Event URL"
                            variant="outlined"
                            onKeyPress={handleKeyPress}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Image Upload */}
                    <Grid item xs={12}>
                      <input
                        accept="image/*,.gif"
                        style={{ display: "none" }}
                        id="event-image-upload"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="event-image-upload">
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<CloudUploadIcon color="text" />}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            borderStyle: "dashed",
                            borderWidth: 2,
                            color: "text.main",
                            opacity: 0.5,
                            borderColor: "grey.600",
                            "&:hover": {
                              borderStyle: "groove",
                              borderWidth: 0.5,
                              borderColor: "grey.600",
                              opacity: 0.6,
                            },
                          }}
                        >
                          {formState.imageFile
                            ? formState.imageFile.name
                            : "Upload Cover Image (Max 5MB)"}
                        </Button>
                      </label>
                      {formState.imagePreview && (
                        <Box sx={{ mt: 2, position: "relative", maxWidth: 400, mx: "auto" }}>
                          <IconButton
                            onClick={removeImage}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          <img
                            src={formState.imagePreview}
                            alt="Preview"
                            style={{
                              width: "100%",
                              maxHeight: 200,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </Box>
                      )}
                    </Grid>

                    {/* Event Settings */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: darkMode ? "white" : "primary" }}
                      >
                        Event Settings
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Controller
                          name="enableRegistration"
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox {...field} checked={field.value} color="primary" />
                              }
                              label="Enable Registration"
                            />
                          )}
                        />
                        <Controller
                          name="digitalCertificates"
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox {...field} checked={field.value} color="primary" />
                              }
                              label="Issue Digital Certificates"
                            />
                          )}
                        />
                        <Controller
                          name="sendReminders"
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox {...field} checked={field.value} color="primary" />
                              }
                              label="Send Reminder Emails"
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <MDButton
                        type="submit"
                        variant="gradient"
                        color={sidenavColor}
                        fullWidth
                        size="large"
                        disabled={formState.isSubmitting}
                        sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: "1rem" }}
                      >
                        {formState.isSubmitting ? (
                          <>
                            <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                            Creating Event...
                          </>
                        ) : (
                          "Publish Event"
                        )}
                      </MDButton>
                    </Grid>
                  </Grid>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

CreateEvent.propTypes = {
  onEventCreated: PropTypes.func,
};

export default CreateEvent;
