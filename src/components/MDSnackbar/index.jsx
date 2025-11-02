/**
 * MDSnackbar Component
 * Notification snackbar with customizable colors and content
 * @module components/MDSnackbar
 */

import { useMemo, memo } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbarIconRoot from "components/MDSnackbar/MDSnackbarIconRoot";
import { useMaterialUIController } from "context";

const MDSnackbar = ({
  color = "info",
  icon,
  title,
  dateTime,
  content,
  close,
  bgWhite = false,
  open,
  ...rest
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized color configuration
  const colors = useMemo(() => {
    if (bgWhite) {
      return {
        titleColor: color,
        dateTimeColor: "dark",
        dividerColor: false,
      };
    }

    if (color === "light") {
      return {
        titleColor: darkMode ? "inherit" : "dark",
        dateTimeColor: darkMode ? "inherit" : "text",
        dividerColor: false,
      };
    }

    return {
      titleColor: "white",
      dateTimeColor: "white",
      dividerColor: true,
    };
  }, [bgWhite, color, darkMode]);

  // Fixed: Use proper background color from palette
  const backgroundColor = useMemo(
    () => (palette) => {
      if (bgWhite) {
        return palette.white?.main || "#ffffff";
      }
      if (darkMode) {
        return palette.background?.default || palette.grey?.[900] || "#1a1a1a";
      }
      return palette[color]?.main || palette.info?.main || "#1976d2";
    },
    [darkMode, color, bgWhite]
  );

  // Memoized close icon color
  const closeIconColor = useMemo(
    () => (palette) =>
      (bgWhite && !darkMode) || color === "light"
        ? palette.dark?.main || "#000000"
        : palette.white?.main || "#ffffff",
    [bgWhite, darkMode, color]
  );

  // Memoized content color
  const contentColor = useMemo(
    () => (palette) => {
      if (darkMode) {
        return color === "light" ? "inherit" : palette.white?.main || "#ffffff";
      }
      return bgWhite || color === "light"
        ? palette.text?.main || "#000000"
        : palette.white?.main || "#ffffff";
    },
    [bgWhite, color, darkMode]
  );

  // Memoized content font size
  const contentFontSize = useMemo(() => (typography) => typography.size?.sm || "0.875rem", []);

  return (
    <Snackbar
      open={open}
      TransitionComponent={Fade}
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      onClose={close}
      {...rest}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
          <Icon fontSize="small">close</Icon>
        </IconButton>
      }
    >
      <MDBox
        variant={bgWhite ? "contained" : "gradient"}
        bgColor={bgWhite ? "white" : color}
        minWidth="21.875rem"
        maxWidth="100%"
        shadow="md"
        borderRadius="md"
        p={1}
        sx={{
          backgroundColor,
        }}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="dark"
          p={1.5}
        >
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDSnackbarIconRoot fontSize="small" ownerState={{ color, bgWhite }}>
              {icon}
            </MDSnackbarIconRoot>
            <MDTypography
              variant="button"
              fontWeight="medium"
              color={colors.titleColor}
              textGradient={bgWhite}
            >
              {title}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDTypography variant="caption" color={colors.dateTimeColor}>
              {dateTime}
            </MDTypography>
            <Icon
              sx={{
                color: closeIconColor,
                fontWeight: ({ typography }) => typography.fontWeightBold,
                cursor: "pointer",
                marginLeft: 2,
                transform: "translateY(-1px)",
              }}
              onClick={close}
            >
              close
            </Icon>
          </MDBox>
        </MDBox>
        <Divider sx={{ margin: 0 }} light={colors.dividerColor} />
        <MDBox
          p={1.5}
          sx={{
            fontSize: contentFontSize,
            color: contentColor,
          }}
        >
          {content}
        </MDBox>
      </MDBox>
    </Snackbar>
  );
};

MDSnackbar.displayName = "MDSnackbar";

export default memo(MDSnackbar);
