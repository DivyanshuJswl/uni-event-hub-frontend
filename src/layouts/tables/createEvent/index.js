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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMaterialUIController } from "context";
import MDButton from "components/MDButton";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { handleSubmit, control, reset } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [createdEvent, setCreatedEvent] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
    if (!data.title || !data.date || !data.location) {
      toast.warning("Please fill in all required fields", {
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
      // First create the event
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        maxParticipants: data.capacity,
        category: data.category,
        eventURL: data.eventURL,
        enableRegistration: data.enableRegistration,
        digitalCertificates: data.digitalCertificates,
        sendReminders: data.sendReminders,
      };

      const eventResponse = await axios.post(`${BASE_URL}/api/events/create`, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Event creation response:", eventResponse);
      const eventId = eventResponse.data.data?.event?._id;
      console.log("Extracted eventId:", eventId);
      // If there's an image, upload it
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("eventId", eventId);
        console.log("Uploading image for eventId:", eventId);
        const uploadResponse = await axios.post(
          `${BASE_URL}/api/events/${eventId}/upload-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Upload URL:", uploadResponse);
        imageUrl = uploadResponse.data.url;

        // In your frontend code, modify the PATCH request:
        try {
          const response = await axios.patch(
            `${BASE_URL}/api/events/${eventId}`,
            { imageUrl },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          console.log("Update successful:", response.data);
        } catch (err) {
          console.error("Update error:", err.response?.data || err.message);
        }
      }

      // Get the full event details with image
      const fullEventResponse = await axios.get(`${BASE_URL}/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setCreatedEvent(fullEventResponse.data.data);
      reset();
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      let errorMessage = "Failed to create event";

      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        if (err.response.status === 400) {
          errorMessage = "Validation error: " + (err.response.data.message || "Invalid data");
        } else if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (err.response.status === 500) {
          errorMessage = "Server error - Please try again later";
        } else if (err.code === "ERR_CONNECTION_REFUSED") {
          errorMessage = "Connection refused - Please check your server";
        }
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "background.default" : "grey.100",
        py: 2,
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
      />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: darkMode ? 1 : 3,
              overflow: "visible",
              backgroundColor: darkMode ? "background.default" : "rgb(243, 253, 255)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: darkMode ? "white" : "primary",
                  mb: 3,
                }}
              >
                Create New Event
              </Typography>

              {createdEvent ? (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    border: "1px dashed",
                    borderColor: "success.main",
                    borderRadius: 2,
                    backgroundColor: darkMode ? "background.paper" : "success.light",
                  }}
                >
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Event Created Successfully!
                  </Typography>
                  {createdEvent.imageUrl && (
                    <Avatar
                      src={createdEvent.imageUrl}
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
                  <Typography variant="h6" gutterBottom>
                    {createdEvent.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dayjs(createdEvent.date).format("MMMM D, YYYY h:mm A")}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {createdEvent.location}
                  </Typography>
                  <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    sx={{ mt: 3 }}
                    onClick={() => setCreatedEvent(null)}
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
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Event Title"
                            variant="outlined"
                            required
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

                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="date"
                          control={control}
                          defaultValue={null}
                          render={({ field: { onChange, value, ...fieldProps } }) => (
                            <DatePicker
                              onChange={(date) => onChange(date ? date.toISOString() : null)}
                              value={value ? dayjs(value) : null}
                              label="Event Date"
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                              slotProps={{
                                textField: {
                                  variant: "outlined",
                                  required: true,
                                  ...fieldProps,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="time"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Event Time"
                            type="time"
                            InputLabelProps={{ shrink: true }}
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

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="category-label"
                              label="Category"
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                height: 56,
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
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Capacity"
                            type="number"
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

                    <Grid item xs={12}>
                      <Controller
                        name="location"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Location (Online or Venue)"
                            variant="outlined"
                            required
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
                          Upload Cover Image
                        </Button>
                      </label>
                      {imagePreview && (
                        <Box
                          sx={{
                            mt: 2,
                            position: "relative",
                            width: "100%",
                            maxWidth: 400,
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

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Controller
                          name="enableRegistration"
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  color={darkMode ? "secondary" : sidenavColor || "primary"}
                                />
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
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  color={darkMode ? "secondary" : sidenavColor || "primary"}
                                />
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
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  color={darkMode ? "secondary" : sidenavColor || "primary"}
                                />
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
