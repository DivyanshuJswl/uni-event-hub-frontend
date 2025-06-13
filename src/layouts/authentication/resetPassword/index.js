import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";
import { BASE_URL } from "contexts/constants";
function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post({BASE_URL}+"/api/auth/reset-password", {
        token,
        newPassword: password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/auth/sign-in"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBox>
      {success ? (
        <MDBox>
          <MDTypography variant="h4" color="success">
            Password reset successfully!
          </MDTypography>
          <MDTypography>Redirecting to login page...</MDTypography>
        </MDBox>
      ) : (
        <form onSubmit={handleSubmit}>
          <MDInput
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <MDInput
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          {error && (
            <MDTypography color="error" variant="caption">
              {error}
            </MDTypography>
          )}
          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            disabled={loading}
            fullWidth
            sx={{ mt: 3 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </MDButton>
        </form>
      )}
    </MDBox>
  );
}

export default ResetPasswordPage;
