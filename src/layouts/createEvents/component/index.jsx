import React, { useState } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useAuth } from "context/AuthContext";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";

const CreateEvent = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { handleSubmit, control, reset } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [createdEvent, setCreatedEvent] = useState(null);
  const { token } = useAuth();

  const pickerTheme = createTheme({
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
          root: ({ ownerState, theme }) => ({
            color: darkMode ? "#ffffff" : theme.palette.text.primary,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
            "&:hover": {
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
            },
          }),
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
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const onSubmit = async (data) => {
    // Enhanced validation
    if (!data.title || !data.date || !data.location || !data.category || !data.capacity) {
      toast.warning(
        "Please fill in all required fields (Title, Date, Location, Category, Capacity)",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    // Validate capacity is positive number
    if (data.capacity && (data.capacity <= 0 || isNaN(data.capacity))) {
      toast.warning("Capacity must be a positive number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = data.date ? dayjs(data.date).toISOString() : null;

      // Create FormData for multipart request
      const formData = new FormData();

      // Append event data as individual fields for better backend parsing
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

      // Append image file if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Single API call for event creation and image upload
      const response = await axios.post(`${BASE_URL}/api/events/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
      });

      console.log("Event creation response:", response);

      if (response.data.status === "success") {
        setCreatedEvent(response.data.data.event);

        toast.success(
          `Event created successfully! ${
            response.data.data.imageUploaded ? "Image uploaded." : "No image uploaded."
          }`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Reset form
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
        setImagePreview(null);
        setImageFile(null);
      }
    } catch (err) {
      let errorMessage = "Failed to create event";

      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);

        if (err.response.data?.message) {
          errorMessage = "Error: " + err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = "Validation error: " + (err.response.data?.message || "Invalid data");
        } else if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (err.response.status === 413) {
          errorMessage = "File too large - Please upload a smaller image (max 5MB)";
        } else if (err.response.status === 500) {
          errorMessage = "Server error - Please try again later";
        }
      } else if (err.code === "ERR_NETWORK" || err.code === "ERR_CONNECTION_REFUSED") {
        errorMessage = "Network error - Please check your connection";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout - Please try again";
      } else if (err.request) {
        errorMessage = "No response received from server";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press in form fields
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.type !== "textarea") {
        handleSubmit(onSubmit)(); // Trigger form submission
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "background.default" : "grey.100",
        py: 1,
        minHeight: "100vh",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: darkMode ? 1 : 3,
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: darkMode ? "white" : "primary.main",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Create New Event
              </Typography>

              {createdEvent ? (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    backgroundColor: darkMode ? "background.default" : "transparent",
                  }}
                >
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Event Created Successfully!
                  </Typography>
                  {(createdEvent.featuredImage?.url || createdEvent.images?.[0]?.url) && (
                    <Avatar
                      src={createdEvent.featuredImage?.url || createdEvent.images?.[0]?.url}
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
                    {createdEvent.title}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    {dayjs(createdEvent.date).format("MMMM D, YYYY h:mm A")}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    {createdEvent.location}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom color={darkMode ? "white" : "dark"}>
                    Category: {createdEvent.category}
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    sx={{ mt: 3 }}
                    onClick={() => {
                      setCreatedEvent(null);
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
                    }}
                  >
                    Create Another Event
                  </MDButton>
                </Box>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <ThemeProvider theme={pickerTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="date"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: "Event date and time is required",
                            }}
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
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    fontSize: "0.9rem",
                                  },
                                  "& .MuiInputLabel-root": {
                                    fontSize: "0.9rem",
                                  },
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
                              sx={{
                                borderRadius: 2,
                                height: "2.75rem",
                              }}
                            >
                              <MenuItem value="workshop">Workshop</MenuItem>
                              <MenuItem value="seminar">Seminar</MenuItem>
                              <MenuItem value="social">Social</MenuItem>
                              <MenuItem value="hackathon">Hackathon</MenuItem>
                              <MenuItem value="cultural">Cultural</MenuItem>
                              <MenuItem value="technology">Technology</MenuItem>
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
                          min: {
                            value: 1,
                            message: "Capacity must be at least 1",
                          },
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

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
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            borderStyle: "dashed",
                            borderWidth: 2,
                            borderColor: darkMode ? "grey.700" : "grey.400",
                            "&:hover": {
                              borderColor: darkMode ? "grey.600" : "grey.500",
                            },
                          }}
                        >
                          {imageFile ? imageFile.name : "Upload Cover Image (Max 5MB)"}
                        </Button>
                      </label>
                      {imagePreview && (
                        <Box
                          sx={{
                            mt: 2,
                            position: "relative",
                            width: "100%",
                            maxWidth: 400,
                            mx: "auto",
                          }}
                        >
                          <IconButton
                            onClick={removeImage}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              zIndex: 10,
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          <img
                            src={imagePreview}
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

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: darkMode ? "white" : "primary",
                        }}
                      >
                        Event Settings
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
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

                    <Grid item xs={12}>
                      <MDButton
                        type="submit"
                        variant="gradient"
                        color={sidenavColor}
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                      >
                        {isSubmitting ? (
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

export default CreateEvent;
