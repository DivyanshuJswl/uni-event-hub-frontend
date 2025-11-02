/**
 * Styled root component for MDBox
 * @module components/MDBox/MDBoxRoot
 */

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// Validation arrays as constants
const VALID_GRADIENTS = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
  "dark",
  "light",
];

const VALID_COLORS = [
  "transparent",
  "white",
  "black",
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
  "light",
  "dark",
  "text",
  "grey-100",
  "grey-200",
  "grey-300",
  "grey-400",
  "grey-500",
  "grey-600",
  "grey-700",
  "grey-800",
  "grey-900",
];

const VALID_BORDER_RADIUS = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
const VALID_BOX_SHADOWS = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];

const MDBoxRoot = styled(Box)(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows } = theme;
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;

  const { gradients, grey, white } = palette;
  const { linearGradient } = functions;
  const { borderRadius: radius } = borders;
  const { colored } = boxShadows;

  // Grey color mapping
  const greyColors = {
    "grey-100": grey[100],
    "grey-200": grey[200],
    "grey-300": grey[300],
    "grey-400": grey[400],
    "grey-500": grey[500],
    "grey-600": grey[600],
    "grey-700": grey[700],
    "grey-800": grey[800],
    "grey-900": grey[900],
  };

  // Compute background value
  let backgroundValue = bgColor;

  if (variant === "gradient") {
    backgroundValue = VALID_GRADIENTS.includes(bgColor)
      ? linearGradient(gradients[bgColor].main, gradients[bgColor].state)
      : white.main;
  } else if (VALID_COLORS.includes(bgColor)) {
    backgroundValue = palette[bgColor] ? palette[bgColor].main : greyColors[bgColor];
  }

  // Compute color value
  let colorValue = VALID_COLORS.includes(color) ? palette[color]?.main || greyColors[color] : color;

  // Compute border radius value
  let borderRadiusValue = VALID_BORDER_RADIUS.includes(borderRadius)
    ? radius[borderRadius]
    : borderRadius;

  // Compute box shadow value
  let boxShadowValue = "none";

  if (VALID_BOX_SHADOWS.includes(shadow)) {
    boxShadowValue = boxShadows[shadow];
  } else if (coloredShadow && coloredShadow !== "none") {
    boxShadowValue = colored[coloredShadow];
  }

  return {
    opacity,
    background: backgroundValue,
    color: colorValue,
    borderRadius: borderRadiusValue,
    boxShadow: boxShadowValue,
  };
});

MDBoxRoot.displayName = "MDBoxRoot";

export default MDBoxRoot;
