import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useAuth } from "context/AuthContext";

const MetaMaskIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState("");

  const { user, token, updateWallet } = useAuth();

  // Show message if user is not authenticated
  if (!user || !token) {
    return (
      <MDBox p={3} borderRadius="lg" shadow="lg">
        <MDTypography variant="body2" color="text">
          Please log in to link your MetaMask wallet.
        </MDTypography>
      </MDBox>
    );
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setLocalError(null);
    setLocalSuccess(false);

    const result = await updateWallet(metaMaskAddress);

    if (result.success) {
      setLocalSuccess(true);
      setMetaMaskAddress(result.metaMaskAddress || metaMaskAddress);
      setTimeout(() => setLocalSuccess(false), 2500);
    } else {
      setLocalError(result.message);
    }

    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    if (localSuccess) setLocalSuccess(false);
    setLocalError(null);
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

      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Your MetaMask ID"
          fullWidth
          value={metaMaskAddress}
          onChange={handleInputChange}
          placeholder="Enter your MetaMask account ID (0x...)"
        />
      </MDBox>

      {/* Success Message */}
      {localSuccess && (
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="button" color="success" fontWeight="medium">
            ✓ Wallet linked successfully!
          </MDTypography>
        </MDBox>
      )}

      {/* Error Message */}
      {localError && (
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="button" color="error" fontWeight="medium">
            ⚠️ Error: {localError}
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
          {isLoading ? "Processing..." : user.metaMaskAddress ? "Update Wallet" : "Link Wallet"}
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
