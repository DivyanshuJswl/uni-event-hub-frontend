import React, { useEffect, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import PropTypes from "prop-types";

function HCaptchaComponent({ onVerify, onError, onExpire, reset }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const captchaRef = useRef(null);
  const sitekey = (process.env.REACT_APP_HCAPTCHA_SITE_KEY || "").trim();
  // Reset captcha when needed (e.g., after form submission errors)
  useEffect(() => {
    if (reset) {
      captchaRef.current?.resetCaptcha();
    }
  }, [reset]);

  return (
    <MDBox
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "center",
        "& iframe": {
          borderRadius: "8px",
        },
      }}
    >
      <HCaptcha
        ref={captchaRef}
        sitekey={sitekey}
        onVerify={onVerify}
        onError={onError}
        onExpire={onExpire}
        theme={darkMode ? "dark" : "light"}
        languageOverride="en"
        size="normal"
      />
    </MDBox>
  );
}

HCaptchaComponent.propTypes = {
  onVerify: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onExpire: PropTypes.func,
  reset: PropTypes.bool,
};

export default HCaptchaComponent;
