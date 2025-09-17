import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Grid, Divider, Card, CardContent, Chip, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useMaterialUIController } from "context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Add, Delete, EmojiEvents } from "@mui/icons-material";

const CertificatePublisher = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { control, handleSubmit, reset, setValue } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winners, setWinners] = useState([
    { email: "", position: 1, certificateURL: "" },
    { email: "", position: 2, certificateURL: "" },
    { email: "", position: 3, certificateURL: "" },
  ]);

  const addWinner = () => {
    if (winners.length < 10) {
      setWinners([...winners, { email: "", position: winners.length + 1, certificateURL: "" }]);
    }
  };

  const removeWinner = (index) => {
    if (winners.length > 1) {
      const newWinners = winners.filter((_, i) => i !== index);
      setWinners(newWinners.map((winner, i) => ({ ...winner, position: i + 1 })));
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
        return `${position}th Place`;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const winnersData = winners.map((winner) => ({
        email: winner.email,
        winnerPosition: winner.position,
        certificateURL: winner.certificateURL,
      }));

      const certificateData = {
        eventName: data.eventName,
        winners: winnersData,
      };

      const res = await axios.post(
        `${BASE_URL}/api/certificates/addcertificates`,
        certificateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("🎉 Certificates published successfully!");
      console.log(res.data);
      reset();
      setWinners([
        { email: "", position: 1, certificateURL: "" },
        { email: "", position: 2, certificateURL: "" },
        { email: "", position: 3, certificateURL: "" },
      ]);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Failed to publish certificates");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "background.default" : "grey.100",
        py: 4,
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
            <CardContent sx={{ p: 4 }}>
              {/* Header Section */}
              <MDBox textAlign="center" mb={4}>
                <EmojiEvents
                  sx={{
                    fontSize: 32,
                    color: sidenavColor,
                    mb: 2,
                  }}
                />
                <MDTypography variant="h3" gutterBottom fontWeight="bold">
                  Publish Winner Certificates
                </MDTypography>
                <MDTypography variant="regular" sx={{ opacity: 0.8, maxWidth: 400, mx: "auto" }}>
                  Recognize and reward participants by issuing digital certificates for your event
                  winners
                </MDTypography>
              </MDBox>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  {/* Event Details Section */}
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
                        🏆 Event Details
                      </MDTypography>
                      <Controller
                        name="eventName"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Event name is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <MDInput
                            {...field}
                            fullWidth
                            label="Event Name"
                            type="text"
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  {/* Winners Section */}
                  <Grid item xs={12}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <MDTypography variant="h5" fontWeight="medium">
                        🏅 Winners
                      </MDTypography>
                      <MDButton
                        onClick={addWinner}
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Add />}
                        disabled={winners.length >= 10}
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
                              label={getPositionLabel(winner.position)}
                              color={
                                winner.position === 1
                                  ? "success"
                                  : winner.position === 2
                                    ? "warning"
                                    : winner.position === 3
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
                              <Grid item xs={12} md={6}>
                                <MDInput
                                  fullWidth
                                  label="Winner Email"
                                  type="email"
                                  value={winner.email}
                                  onChange={(e) => updateWinner(index, "email", e.target.value)}
                                  variant="outlined"
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
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
                                  placeholder="https://example.com/certificate.pdf"
                                />
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <MDBox textAlign="center" mt={4}>
                      <MDButton
                        type="submit"
                        variant="gradient"
                        color={sidenavColor}
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          minWidth: 200,
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          py: 1.5,
                        }}
                      >
                        {isSubmitting ? <>⏳ Publishing...</> : <>🚀 Publish Certificates</>}
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </form>

              {/* Footer Note */}
              <MDBox mt={4} textAlign="center">
                <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                  💡 Certificates will be automatically sent to winners via email
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
