import { useState, useCallback, memo } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";

const MetaMaskIntegration = memo(() => {
  const { user, token, updateWallet } = useAuth();
  const { showToast } = useNotifications();

  // Consolidated state
  const [walletState, setWalletState] = useState({
    isLoading: false,
    metaMaskAddress: "",
  });

  // Memoized input handler
  const handleInputChange = useCallback((e) => {
    setWalletState((prev) => ({ ...prev, metaMaskAddress: e.target.value }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await updateWallet(walletState.metaMaskAddress);

      if (result.success) {
        setWalletState({
          isLoading: false,
          metaMaskAddress: result.metaMaskAddress || walletState.metaMaskAddress,
        });
        showToast("Wallet linked successfully!", "success", "MetaMask Connected");
      } else {
        setWalletState((prev) => ({ ...prev, isLoading: false }));
        showToast(result.message || "Failed to link wallet", "error", "Connection Failed");
      }
    } catch (error) {
      setWalletState((prev) => ({ ...prev, isLoading: false }));
      showToast("An error occurred while linking wallet", "error", "Connection Failed");
    }
  }, [walletState.metaMaskAddress, updateWallet, showToast]);

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
          value={walletState.metaMaskAddress}
          onChange={handleInputChange}
          placeholder="Enter your MetaMask account ID (0x...)"
        />
      </MDBox>

      <MDBox display="flex" justifyContent="center" mb={4}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleSubmit}
          disabled={walletState.isLoading || !walletState.metaMaskAddress.trim()}
        >
          {walletState.isLoading
            ? "Processing..."
            : user.metaMaskAddress
              ? "Update Wallet"
              : "Link Wallet"}
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
});

MetaMaskIntegration.displayName = "MetaMaskIntegration";

export default MetaMaskIntegration;
