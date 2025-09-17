import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";
import { useAuth } from "context/AuthContext";

const MetaMaskIntegration = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user, token } = useAuth();

  const student = user;
  const [metaMaskAddress, setMetaMaskAddress] = useState(student?.metaMaskAddress || "");

  // Show message if user is not authenticated
  if (!student || !token) {
    return (
      <MDBox p={3} borderRadius="lg" shadow="lg">
        <MDTypography variant="body2" color="text">
          Please log in to link your MetaMask wallet.
        </MDTypography>
      </MDBox>
    );
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const res = await axios.patch(
        `${BASE_URL}/api/wallet`,
        { metaMaskAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data?.status === "success") {
        setSuccess(true);
        // Update local storage with the new student data from response
        sessionStorage.setItem("student", JSON.stringify(res.data.data.student));
        // Update local state with the new address
        setMetaMaskAddress(res.data.data.student.metaMaskAddress);

        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(res.data?.message || "Failed to link wallet");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "An error occurred");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (success) setSuccess(false);
    setError(null);
    setMetaMaskAddress(e.target.value);
  };

  return (
    <MDBox p={3} borderRadius="lg" shadow="lg">
      <MDBox mb={3}>
        <MDTypography variant="h5" fontWeight="medium">
          Link MetaMask Wallet
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Connect your MetaMask wallet to receive your certificates
        </MDTypography>
      </MDBox>

      <MDBox mb={4}>
        <MDInput
          type="text"
          label="Your MetaMask ID"
          fullWidth
          value={metaMaskAddress}
          onChange={handleInputChange}
          placeholder="Enter your MetaMask account ID"
        />
      </MDBox>

      {/* Success Message */}
      {success && (
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="button" color="success" fontWeight="medium">
            ✓ Wallet linked successfully!
          </MDTypography>
        </MDBox>
      )}

      {/* Error Message */}
      {error && (
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="button" color="error" fontWeight="medium">
            ⚠️ Error: {error}
          </MDTypography>
        </MDBox>
      )}

      <MDBox display="flex" justifyContent="center" mb={4}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleSubmit}
          disabled={isLoading || !metaMaskAddress.trim()}
        >
          {isLoading ? "Processing..." : student.metaMaskAddress ? "Update Wallet" : "Link Wallet"}
        </MDButton>
      </MDBox>

      <MDBox mt={4}>
        <MDTypography variant="h6" fontWeight="medium" mb={2}>
          New to MetaMask?
        </MDTypography>

        <MDBox borderRadius="lg" overflow="hidden" height="180px" mb={2} position="relative">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/_7DaX2KLWCE?si=vPdhH_N3ef8jTFdb"
            title="How to create MetaMask wallet"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none", borderRadius: "8px" }}
            loading="lazy"
          />
        </MDBox>
        <MDTypography variant="button" color="text">
          Watch our guide on how to create and set up a MetaMask wallet
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default MetaMaskIntegration;
