import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useMaterialUIController } from "context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Add, Delete, EmojiEvents, CloudUpload, Warning } from "@mui/icons-material";
import { useAuth } from "context/AuthContext";

const CertificatePublisher = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();
  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [winners, setWinners] = useState([
    { studentEmail: "", winnerPosition: 1, certificateURL: "" },
    { studentEmail: "", winnerPosition: 2, certificateURL: "" },
    { studentEmail: "", winnerPosition: 3, certificateURL: "" },
  ]);

  // Fetch organizer's completed events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/events/organizer/completed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data.data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [BASE_URL]);

  const addWinner = () => {
    if (winners.length < 20) {
      setWinners([
        ...winners,
        { studentEmail: "", winnerPosition: winners.length + 1, certificateURL: "" },
      ]);
    }
  };

  const removeWinner = (index) => {
    if (winners.length > 1) {
      const newWinners = winners.filter((_, i) => i !== index);
      setWinners(newWinners.map((winner, i) => ({ ...winner, winnerPosition: i + 1 })));
    }
  };

  const updateWinner = (index, field, value) => {
    const newWinners = [...winners];
    newWinners[index][field] = value;
    setWinners(newWinners);
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case 1:
        return "🥇 1st Place";
      case 2:
        return "🥈 2nd Place";
      case 3:
        return "🥉 3rd Place";
      default:
        return `🏅 ${position}th Place`;
    }
  };

  const validateWinners = () => {
    const errors = [];

    winners.forEach((winner, index) => {
      if (!winner.studentEmail?.trim()) {
        errors.push(`Winner ${index + 1}: Email is required`);
      }
      if (!winner.certificateURL?.trim()) {
        errors.push(`Winner ${index + 1}: Certificate URL is required`);
      }
      if (winner.studentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(winner.studentEmail)) {
        errors.push(`Winner ${index + 1}: Invalid email format`);
      }
      if (winner.certificateURL && !/^https?:\/\/.+\..+/.test(winner.certificateURL)) {
        errors.push(`Winner ${index + 1}: Invalid certificate URL format`);
      }
    });

    return errors;
  };

  const onSubmit = async (data) => {
    // Validate winners before submission
    const validationErrors = validateWinners();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    // Validate event selection
    if (!data.eventId) {
      toast.error("Please select an event");
      return;
    }

    setIsSubmitting(true);
    try {
      const certificateData = {
        eventId: data.eventId,
        winners: winners.map((winner) => ({
          studentEmail: winner.studentEmail.trim(),
          winnerPosition: winner.winnerPosition,
          certificateURL: winner.certificateURL.trim(),
        })),
      };

      const res = await axios.post(`${BASE_URL}/api/certificates/issue`, certificateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.data.errors && res.data.data.errors.length > 0) {
        res.data.data.errors.forEach((error) => {
          toast.warning(error);
        });
      }

      if (res.data.data.certificates && res.data.data.certificates.length > 0) {
        toast.success(`🎉 ${res.data.message}`);
        reset();
        setWinners([
          { studentEmail: "", winnerPosition: 1, certificateURL: "" },
          { studentEmail: "", winnerPosition: 2, certificateURL: "" },
          { studentEmail: "", winnerPosition: 3, certificateURL: "" },
        ]);
      } else {
        toast.warning("No certificates were issued. Please check the errors above.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Failed to issue certificates");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventId = watch("eventId");
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 2,
        px: 2,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} theme={darkMode ? "dark" : "light"} />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: darkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.24)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header Section */}
              <MDBox textAlign="center" mb={2}>
                <EmojiEvents
                  sx={{
                    fontSize: 40,
                    color: sidenavColor,
                    mb: 1,
                  }}
                />
                <MDTypography variant="h3" gutterBottom fontWeight="bold">
                  Issue Blockchain Certificates
                </MDTypography>
                <MDTypography variant="body2" sx={{ opacity: 0.8, maxWidth: 600, mx: "auto" }}>
                  Issue tamper-proof, blockchain-verified certificates to event winners. Each
                  certificate is linked to the recipient&apos;s MetaMask wallet.
                </MDTypography>
              </MDBox>

              {/* Important Notice */}
              <Alert severity="" sx={{ mb: 2 }}>
                <MDTypography variant="caption" fontWeight="medium">
                  📌 Important: Winners must have a MetaMask wallet linked to their profile to
                  receive certificates.
                </MDTypography>
              </Alert>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Event Selection Section */}
                  <Grid item xs={12}>
                    <MDBox
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: darkMode
                          ? "rgba(255, 255, 255, 0.02)"
                          : "rgba(0, 0, 0, 0.02)",
                        border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                      }}
                    >
                      <MDTypography variant="h5" fontWeight="medium" sx={{ mb: 3 }}>
                        🏆 Select Event
                      </MDTypography>

                      <Controller
                        name="eventId"
                        control={control}
                        rules={{ required: "Event selection is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Autocomplete
                            {...field}
                            options={events}
                            loading={loadingEvents}
                            getOptionLabel={(option) =>
                              `${option.title} - ${new Date(option.date).toLocaleDateString()}`
                            }
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, newValue) => {
                              field.onChange(newValue?.id || "");
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Completed Event"
                                variant="outlined"
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        )}
                      />

                      {selectedEvent && (
                        <MDBox
                          mt={2}
                          p={2}
                          sx={{
                            backgroundColor: darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)",
                            borderRadius: 1,
                          }}
                        >
                          <MDTypography variant="h6" color={sidenavColor}>
                            {selectedEvent.title}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            📅 {new Date(selectedEvent.date).toLocaleDateString()} • 📍{" "}
                            {selectedEvent.location} • 🏷️ {selectedEvent.category}
                          </MDTypography>
                        </MDBox>
                      )}
                    </MDBox>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  {/* Winners Section */}
                  <Grid item xs={12}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <MDTypography variant="h5" fontWeight="medium">
                        🏅 Assign Certificate
                      </MDTypography>
                      <MDButton
                        onClick={addWinner}
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Add />}
                        disabled={winners.length >= 20}
                      >
                        Add Winner
                      </MDButton>
                    </MDBox>

                    <Grid container spacing={3}>
                      {winners.map((winner, index) => (
                        <Grid item xs={12} key={index}>
                          <MDBox
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              backgroundColor: darkMode
                                ? "rgba(255, 255, 255, 0.02)"
                                : "rgba(0, 0, 0, 0.02)",
                              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                              position: "relative",
                            }}
                          >
                            <Chip
                              label={getPositionLabel(winner.winnerPosition)}
                              color={
                                winner.winnerPosition === 1
                                  ? "success"
                                  : winner.winnerPosition === 2
                                    ? "warning"
                                    : winner.winnerPosition === 3
                                      ? "secondary"
                                      : "default"
                              }
                              sx={{ mb: 2, fontWeight: "bold" }}
                            />

                            {winners.length > 1 && (
                              <IconButton
                                onClick={() => removeWinner(index)}
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  right: 16,
                                  color: "error.main",
                                }}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            )}

                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <MDInput
                                  fullWidth
                                  label="Student Email"
                                  type="email"
                                  value={winner.studentEmail}
                                  onChange={(e) =>
                                    updateWinner(index, "studentEmail", e.target.value)
                                  }
                                  variant="outlined"
                                  placeholder="student@example.com"
                                />
                                <MDTypography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
                                  Provide email ID of student
                                </MDTypography>
                              </Grid>
                              <Grid item xs={12}>
                                <MDInput
                                  fullWidth
                                  label="Certificate URL"
                                  type="url"
                                  value={winner.certificateURL}
                                  onChange={(e) =>
                                    updateWinner(index, "certificateURL", e.target.value)
                                  }
                                  variant="outlined"
                                  required
                                  placeholder="https://drive.com/certificate.pdf"
                                  InputProps={{
                                    startAdornment: (
                                      <CloudUpload sx={{ opacity: 0.8, color: "primary.main" }} />
                                    ),
                                  }}
                                />
                                <MDTypography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
                                  Upload certificate to cloud storage and paste the URL here (PDF or
                                  Image)
                                </MDTypography>
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <MDBox textAlign="center" mt={2}>
                      <MDButton
                        type="submit"
                        variant="gradient"
                        color={sidenavColor}
                        disabled={isSubmitting || !selectedEvent}
                        sx={{
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          py: 1.5,
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Processing...
                          </>
                        ) : (
                          <>🔐 Issue Blockchain Certificates</>
                        )}
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </form>

              {/* Footer Notes */}
              <MDBox mt={2} textAlign="center">
                <Alert severity="">
                  <MDTypography variant="caption" fontWeight="medium">
                    <Warning sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                    Each certificate is permanently recorded on the blockchain with a unique
                    verification link
                  </MDTypography>
                </Alert>
                <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                  💡 Recipients will receive verification links and can view certificates in their
                  profile
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CertificatePublisher;
