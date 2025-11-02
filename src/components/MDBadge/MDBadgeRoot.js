/**
 * Styled root component for MDBadge
 * @module components/MDBadge/MDBadgeRoot
 */

import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

// Padding configuration map
const PADDING_MAP = {
  xs: "0.45em 0.775em",
  sm: "0.55em 0.9em",
  md: "0.65em 1em",
  lg: "0.85em 1.375em",
};

// Indicator size configuration
const INDICATOR_SIZE_MAP = {
  small: { width: 20, height: 20 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 },
};

const MDBadgeRoot = styled(Badge)(({ theme, ownerState }) => {
  const { palette, typography, borders, functions } = theme;
  const { color, circular, border, size, indicator, variant, container, children } = ownerState;

  const { white, dark, gradients, badgeColors } = palette;
  const { size: fontSize, fontWeightBold } = typography;
  const { borderRadius, borderWidth } = borders;
  const { pxToRem, linearGradient } = functions;

  // Compute values
  const fontSizeValue = size === "xs" ? fontSize.xxs : fontSize.xs;
  const borderValue = border ? `${borderWidth[3]} solid ${white.main}` : "none";
  const borderRadiusValue = circular ? borderRadius.section : borderRadius.md;

  // Indicator styles
  const getIndicatorStyles = (sizeProp) => {
    const sizeConfig = INDICATOR_SIZE_MAP[sizeProp] || INDICATOR_SIZE_MAP.medium;
    return {
      width: pxToRem(sizeConfig.width),
      height: pxToRem(sizeConfig.height),
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      borderRadius: "50%",
      padding: 0,
      border: borderValue,
    };
  };

  // Gradient variant styles
  const getGradientStyles = (colorProp) => {
    const backgroundValue = gradients[colorProp]
      ? linearGradient(gradients[colorProp].main, gradients[colorProp].state)
      : linearGradient(gradients.info.main, gradients.info.state);
    const colorValue = colorProp === "light" ? dark.main : white.main;

    return {
      background: backgroundValue,
      color: colorValue,
    };
  };

  // Contained variant styles
  const getContainedStyles = (colorProp) => {
    const backgroundValue = badgeColors[colorProp]
      ? badgeColors[colorProp].background
      : badgeColors.info.background;
    const colorValue =
      colorProp === "light"
        ? dark.main
        : badgeColors[colorProp]
          ? badgeColors[colorProp].text
          : badgeColors.info.text;

    return {
      background: backgroundValue,
      color: colorValue,
    };
  };

  // Standalone badge styles
  const standAloneStyles = {
    position: "static",
    marginLeft: pxToRem(8),
    transform: "none",
    fontSize: pxToRem(9),
  };

  // Container badge styles
  const containerStyles = {
    position: "relative",
    transform: "none",
  };

  return {
    "& .MuiBadge-badge": {
      height: "auto",
      padding: PADDING_MAP[size] || PADDING_MAP.xs,
      fontSize: fontSizeValue,
      fontWeight: fontWeightBold,
      textTransform: "uppercase",
      lineHeight: 1,
      textAlign: "center",
      whiteSpace: "nowrap",
      verticalAlign: "baseline",
      border: borderValue,
      borderRadius: borderRadiusValue,
      ...(indicator && getIndicatorStyles(size)),
      ...(variant === "gradient" && getGradientStyles(color)),
      ...(variant === "contained" && getContainedStyles(color)),
      ...(!children && !container && standAloneStyles),
      ...(container && containerStyles),
    },
  };
});

MDBadgeRoot.displayName = "MDBadgeRoot";

export default MDBadgeRoot;
