import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useNotifications } from "context/NotifiContext";
import axios from "axios";
import { Add, Delete, EmojiEvents, CloudUpload, Warning } from "@mui/icons-material";
import { useAuth } from "context/AuthContext";

const CertificatePublisher = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();
  const { control, handleSubmit, reset, watch } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const { showToast } = useNotifications();

  // Consolidated state
  const [pageState, setPageState] = useState({
    isSubmitting: false,
    events: [],
    loadingEvents: true,
  });

  const [winners, setWinners] = useState([
    { studentEmail: "", winnerPosition: 1, certificateURL: "" },
    { studentEmail: "", winnerPosition: 2, certificateURL: "" },
    { studentEmail: "", winnerPosition: 3, certificateURL: "" },
  ]);

  // Fetch organizer's completed events
  useEffect(() => {
    const fetchEvents = async () => {
      setPageState((prev) => ({ ...prev, loadingEvents: true }));
      try {
        const response = await axios.get(`${BASE_URL}/api/events/organizer/completed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPageState((prev) => ({
          ...prev,
          events: response.data.data.events || [],
          loadingEvents: false,
        }));
      } catch (error) {
        console.error("Error fetching events:", error);
        showToast("Failed to load events", "error", "Loading Error");
        setPageState((prev) => ({ ...prev, loadingEvents: false }));
      }
    };

    fetchEvents();
  }, [BASE_URL, token, showToast]);

  // Add winner
  const addWinner = useCallback(() => {
    if (winners.length < 20) {
      setWinners((prev) => [
        ...prev,
        { studentEmail: "", winnerPosition: prev.length + 1, certificateURL: "" },
      ]);
      showToast("Winner slot added", "success", "Added");
    } else {
      showToast("Maximum 20 winners allowed", "warning", "Limit Reached");
    }
  }, [winners.length, showToast]);

  // Remove winner
  const removeWinner = useCallback(
    (index) => {
      if (winners.length > 1) {
        setWinners((prev) => {
          const newWinners = prev.filter((_, i) => i !== index);
          return newWinners.map((winner, i) => ({ ...winner, winnerPosition: i + 1 }));
        });
        showToast("Winner removed", "info", "Removed");
      } else {
        showToast("At least one winner is required", "warning", "Cannot Remove");
      }
    },
    [winners.length, showToast]
  );

  // Update winner field
  const updateWinner = useCallback((index, field, value) => {
    setWinners((prev) => {
      const newWinners = [...prev];
      newWinners[index][field] = value;
      return newWinners;
    });
  }, []);

  // Get position label with emoji
  const getPositionLabel = useCallback((position) => {
    const labels = {
      1: "🥇 1st Place",
      2: "🥈 2nd Place",
      3: "🥉 3rd Place",
    };
    return labels[position] || `🏅 ${position}th Place`;
  }, []);

  // Validate winners data
  const validateWinners = useCallback(() => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/.+\..+/;

    winners.forEach((winner, index) => {
      const position = index + 1;

      if (!winner.studentEmail?.trim()) {
        errors.push(`Winner ${position}: Email is required`);
      } else if (!emailRegex.test(winner.studentEmail)) {
        errors.push(`Winner ${position}: Invalid email format`);
      }

      if (!winner.certificateURL?.trim()) {
        errors.push(`Winner ${position}: Certificate URL is required`);
      } else if (!urlRegex.test(winner.certificateURL)) {
        errors.push(`Winner ${position}: Invalid certificate URL format`);
      }
    });

    return errors;
  }, [winners]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data) => {
      // Validate event selection
      if (!data.eventId) {
        showToast("Please select an event", "warning", "Event Required");
        return;
      }

      // Validate winners
      const validationErrors = validateWinners();
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => showToast(error, "error", "Validation Error"));
        return;
      }

      setPageState((prev) => ({ ...prev, isSubmitting: true }));

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

        // Handle partial errors
        if (res.data.data.errors && res.data.data.errors.length > 0) {
          res.data.data.errors.forEach((error) => {
            showToast(error, "warning", "Partial Success");
          });
        }

        // Handle successful certificates
        if (res.data.data.certificates && res.data.data.certificates.length > 0) {
          showToast(
            `Successfully issued ${res.data.data.certificates.length} certificate(s)`,
            "success",
            "Certificates Issued"
          );

          // Reset form
          reset();
          setWinners([
            { studentEmail: "", winnerPosition: 1, certificateURL: "" },
            { studentEmail: "", winnerPosition: 2, certificateURL: "" },
            { studentEmail: "", winnerPosition: 3, certificateURL: "" },
          ]);
        } else {
          showToast(
            "No certificates were issued. Check errors above.",
            "warning",
            "No Certificates"
          );
        }
      } catch (err) {
        console.error("Error:", err);
        const errorMessage = err.response?.data?.message || "Failed to issue certificates";
        showToast(errorMessage, "error", "Issuance Failed");
      } finally {
        setPageState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [winners, validateWinners, BASE_URL, token, reset, showToast]
  );

  // Watch selected event
  const selectedEventId = watch("eventId");
  const selectedEvent = useMemo(
    () => pageState.events.find((event) => event.id === selectedEventId),
    [pageState.events, selectedEventId]
  );

  // Get chip color based on position
  const getPositionColor = useCallback((position) => {
    if (position === 1) return "success";
    if (position === 2) return "warning";
    if (position === 3) return "secondary";
    return "default";
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 2,
        px: 2,
      }}
    >
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
                <EmojiEvents sx={{ fontSize: 40, color: "text.main", mb: 1 }} />
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
                            options={pageState.events}
                            loading={pageState.loadingEvents}
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
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {pageState.loadingEvents ? (
                                        <CircularProgress color="inherit" size={20} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
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
                        🏅 Assign Certificates ({winners.length}/20)
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
                              color={getPositionColor(winner.winnerPosition)}
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
                                  placeholder="https://drive.google.com/certificate.pdf"
                                  InputProps={{
                                    startAdornment: (
                                      <CloudUpload
                                        sx={{ opacity: 0.8, color: "primary.main", mr: 1 }}
                                      />
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
                        disabled={pageState.isSubmitting || !selectedEvent}
                        sx={{
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          py: 1.5,
                          minWidth: 280,
                        }}
                      >
                        {pageState.isSubmitting ? (
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
