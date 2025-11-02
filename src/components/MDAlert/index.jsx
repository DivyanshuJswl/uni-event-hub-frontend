/**
 * MDAlert Component
 * Displays dismissible alert messages with gradient backgrounds
 * @module components/MDAlert
 */

import { useState, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import Fade from "@mui/material/Fade";
import MDBox from "components/MDBox";
import MDAlertRoot from "components/MDAlert/MDAlertRoot";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

const MDAlert = ({ color = "info", dismissible = false, children, ...rest }) => {
  const [alertStatus, setAlertStatus] = useState("mount");

  // Memoized close handler
  const handleAlertStatus = useCallback(() => {
    setAlertStatus("fadeOut");
  }, []);

  // Memoized fade timeout
  const fadeTimeout = useMemo(() => 300, []);

  // Memoized unmount timeout
  const unmountTimeout = useMemo(() => 400, []);

  // Memoized alert template function
  const alertTemplate = useCallback(
    (mount = true) => (
      <Fade in={mount} timeout={fadeTimeout}>
        <MDAlertRoot ownerState={{ color }} {...rest}>
          <MDBox display="flex" alignItems="center" color="white">
            {children}
          </MDBox>
          {dismissible && (
            <MDAlertCloseIcon
              onClick={mount ? handleAlertStatus : undefined}
              role="button"
              aria-label="Close alert"
              tabIndex={mount ? 0 : -1}
              onKeyDown={(e) => {
                if (mount && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleAlertStatus();
                }
              }}
            >
              &times;
            </MDAlertCloseIcon>
          )}
        </MDAlertRoot>
      </Fade>
    ),
    [color, dismissible, children, handleAlertStatus, fadeTimeout, rest]
  );

  // Handle alert lifecycle
  if (alertStatus === "mount") {
    return alertTemplate();
  }

  if (alertStatus === "fadeOut") {
    setTimeout(() => setAlertStatus("unmount"), unmountTimeout);
    return alertTemplate(false);
  }

  return null;
};

MDAlert.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  dismissible: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

MDAlert.displayName = "MDAlert";

export default memo(MDAlert);
