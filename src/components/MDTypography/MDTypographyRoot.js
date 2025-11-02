/**
 * Styled root component for MDTypography
 * @module components/MDTypography/MDTypographyRoot
 */

import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// Font weight mapping
const FONT_WEIGHT_MAP = {
  light: "fontWeightLight",
  regular: "fontWeightRegular",
  medium: "fontWeightMedium",
  bold: "fontWeightBold",
};

const MDTypographyRoot = styled(Typography)(({ theme, ownerState }) => {
  const { palette, typography, functions } = theme;
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient, darkMode } =
    ownerState;

  const { gradients, transparent, white } = palette;
  const { linearGradient } = functions;

  // Get font weight value
  const fontWeightValue =
    fontWeight && FONT_WEIGHT_MAP[fontWeight] ? typography[FONT_WEIGHT_MAP[fontWeight]] : undefined;

  // Gradient styles
  const gradientStyles = textGradient
    ? {
        backgroundImage:
          color !== "inherit" && color !== "text" && color !== "white" && gradients[color]
            ? linearGradient(gradients[color].main, gradients[color].state)
            : linearGradient(gradients.dark.main, gradients.dark.state),
        display: "inline-block",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: transparent.main,
        position: "relative",
        zIndex: 1,
      }
    : {};

  // Compute color value
  let colorValue =
    color === "inherit" || !palette[color] ? "inherit" : palette[color]?.main || "inherit";

  if (darkMode) {
    if (color === "inherit" || !palette[color]) {
      colorValue = "inherit";
    } else if (color === "dark") {
      colorValue = white.main;
    }
  }

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: "none",
    color: colorValue,
    ...(fontWeightValue && { fontWeight: fontWeightValue }),
    ...gradientStyles,
  };
});

MDTypographyRoot.displayName = "MDTypographyRoot";

export default MDTypographyRoot;
