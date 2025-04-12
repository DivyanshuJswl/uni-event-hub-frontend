import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Grid, Divider } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useMaterialUIController } from "context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "utils/constants";

const CertificatePublisher = () => {
  const { control, handleSubmit, reset } = useForm();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [event, setEvent] = useState("");

  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [url1, setUrl1] = useState("");

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        eventName: "Title",
        winners: [
          {
            email: "test1@gmail.com",
            winnerPosition: 1,
            certificateURL: "https://example.com/certificate1.pdf",
          },
          {
            email: "testuser2@gmail.com",
            winnerPosition: 2,
            certificateURL: "https://example.com/certificate2.pdf",
          },
          {
            email: "testuser3@gmail.com",
            winnerPosition: 2,
            certificateURL: "https://example.com/certificate2.pdf",
          },
        ],
      };

      const res = await axios.post(
        `
        https://uni-event-backend.vercel.app/api/certificates/addcertificates 
        `,
        data
      );
      toast.success("Certificates published successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to publish certificates");
      console.error(err);
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
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: darkMode ? 1 : 3 }}>
            <CardContent sx={{ p: 4 }}>
              <MDTypography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Publish Winner Certificates
              </MDTypography>
              <MDTypography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Upload certificates and details for top 3 winners
              </MDTypography>

              <form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <MDBox
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: darkMode ? "background.default" : "grey.50",
                      }}
                    >
                      <MDTypography variant="h5" sx={{ mb: 2 }}>
                        Event details
                      </MDTypography>
                      <Controller
                        name="eventName"
                        control={control}
                        render={({ field }) => (
                          <MDInput
                            onChange={(e) => setEvent(e.target.value)}
                            fullWidth
                            label="Event Name"
                            type="text"
                            variant="outlined"
                            required
                          />
                        )}
                      />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="h5">Winner 1</MDTypography>
                    <Controller
                      name="winner1Email"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          onChange={(e) => setEmail1(e.target.value)}
                          fullWidth
                          label="Winner 1 Email"
                          type="email"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                    <Controller
                      name="winner1Certificate"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          fullWidth
                          onChange={(e) => setUrl1(e.target.value)}
                          label="Certificate URL"
                          type="url"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="h5">Winner 2</MDTypography>
                    <Controller
                      name="winner2Email"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          fullWidth
                          onChange={(e) => setEmail2(e.target.value)}
                          label="Winner 2 Email"
                          type="email"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                    <Controller
                      name="winner2Certificate"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          onChange={(e) => setUrl1(e.target.value)}
                          fullWidth
                          label="Certificate URL"
                          type="url"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="h5">Winner 3</MDTypography>
                    <Controller
                      name="winner3Email"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          onChange={(e) => setEmail3(e.target.value)}
                          fullWidth
                          label="Winner 3 Email"
                          type="email"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                    <Controller
                      name="winner3Certificate"
                      control={control}
                      render={({ field }) => (
                        <MDInput
                          onChange={(e) => setUrl1(e.target.value)}
                          fullWidth
                          label="Certificate URL"
                          type="url"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDButton
                      onClick={onSubmit}
                      type="submit"
                      variant="gradient"
                      color={sidenavColor}
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Certificates"}
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

export default CertificatePublisher;
