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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMaterialUIController } from "context";
import MDButton from "components/MDButton";
import axios from "axios";
import { BASE_URL } from "utils/constants";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const { handleSubmit, control, register, setValue } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [category, setCategory] = useState("");
  const [eventURL, setEventURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (date) => {
    setDate(date ? date.toISOString() : null);
    console.log(date ? date.toISOString() : "No date selected");
  };

  const onSubmit = async () => {
    if (!title || !date || !location) {
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
      const res = await axios.post(
        `${BASE_URL}/api/events/create`,
        { title, description, date, location, maxParticipants, category, eventURL },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setDate(null);
      setLocation("");
      setMaxParticipants("");
      setCategory("");
      setEventURL("");
    } catch (err) {
      let errorMessage = "Failed to create event";

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Validation error: " + (err.response.data.message || "Invalid data");
        } else if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (err.response.status === 500) {
          errorMessage = "Server error - Please try again later";
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

      setError(err);
      console.error("Event creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "background.default" : "grey.100",
      }}
    >
      {/* Toast Container */}
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
                  color: darkMode ? "white" : "text.primary",
                  mb: 3,
                }}
              >
                Create New Event
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="title"
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, onChange, value, ...fieldProps } }) => (
                        <TextField
                          inputRef={ref}
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          fullWidth
                          label="Event Title"
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                          {...fieldProps}
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
                          onChange={(e) => setDescription(e.target.value)}
                          value={description}
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
                        render={({ field: { ref, onChange, value, ...fieldProps } }) => (
                          <DatePicker
                            inputRef={ref}
                            onChange={(date) => {
                              handleDateChange(date);
                              onChange(date ? date.toISOString() : null);
                            }}
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
                      onChange={(e) => setTime(e.target.value)}
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
                        // onChange={(e) => setCategory(e.target.value)}
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value, ...fieldProps } }) => (
                          <Select
                            inputRef={ref}
                            onChange={(e) => setCategory(e.target.value)}
                            labelId="category-label"
                            label="Category"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              height: 56,
                            }}
                            {...fieldProps}
                          >
                            {/* "workshop", "seminar", "social", "hackathon", "cultural", "technology", */}
                            <MenuItem value="workshop">workshop</MenuItem>
                            <MenuItem value="seminar">seminar</MenuItem>
                            <MenuItem value="social">social</MenuItem>
                            <MenuItem value="hackathon">hackathon</MenuItem>
                            <MenuItem value="cultural">cultural</MenuItem>
                            <MenuItem value="technology">technology</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="capacity"
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={maxParticipants}
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
                          fullWidth
                          onChange={(e) => setLocation(e.target.value)}
                          value={location}
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
                    <Button
                      component="label"
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
                      htmlFor="cover-image"
                    >
                      Upload Cover Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        id="cover-image"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("coverImage", file);
                          }
                        }}
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: darkMode ? "white" : "text.primary",
                      }}
                    >
                      Event Settings
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Controller
                        name="enableRegistration"
                        control={control}
                        defaultValue={false}
                        render={({ field: { ref, onChange, value, ...fieldProps } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                inputRef={ref}
                                onChange={onChange}
                                checked={value}
                                color={darkMode ? "secondary" : sidenavColor || "primary"}
                                {...fieldProps}
                              />
                            }
                            label="Enable Registration"
                            sx={{ color: sidenavColor }}
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
                                color={darkMode ? "secondary" : sidenavColor || "primary"}
                              />
                            }
                            label="Issue Digital Certificates"
                            sx={{ color: darkMode ? "text.secondary" : "text.primary" }}
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
                                color={darkMode ? "secondary" : sidenavColor || "primary"}
                              />
                            }
                            label="Send Reminder Emails"
                            sx={{ color: darkMode ? "text.secondary" : "text.primary" }}
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
                      {isSubmitting ? "Creating Event..." : "Publish Event"}
                    </MDButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateEvent;
