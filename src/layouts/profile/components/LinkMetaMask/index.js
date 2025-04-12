// MetaMaskIntegration.js component to replace the Conversations tab

import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";
import { BASE_URL } from "utils/constants";

const MetaMaskIntegration = () => {
  const [metaMaskAddress, setmetaMaskAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/api/wallet",
        { metaMaskAddress },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
        {
          withCredentials: true,
        }
      );
      console.log(res?.data);
    } catch (error) {
      setError(error);
      console.log(error);
    }
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
          onChange={(e) => setmetaMaskAddress(e.target.value)}
          placeholder="Enter your MetaMask account ID"
        />
      </MDBox>

      <MDBox display="flex" justifyContent="center" mb={4}>
        <MDButton variant="gradient" color="info" onClick={handleSubmit}>
          Link Account
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
            frameBorder={0}
          ></iframe>
        </MDBox>
        {/* <p>{error}</p> */}
        <MDTypography variant="button" color="text">
          Watch our guide on how to create and set up a MetaMask wallet
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default MetaMaskIntegration;
