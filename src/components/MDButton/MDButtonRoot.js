/**
 * Styled root component for MDButton
 * @module components/MDButton/MDButtonRoot
 */

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Icon-only size configuration
const ICON_ONLY_SIZES = {
  small: { size: 25.4, padding: 4.5 },
  medium: { size: 38, padding: 11 },
  large: { size: 52, padding: 16 },
};

const MDButtonRoot = styled(Button)(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows } = theme;
  const { color, variant, size, circular, iconOnly, darkMode } = ownerState;

  const { white, text, transparent, gradients, grey } = palette;
  const { boxShadow, linearGradient, pxToRem, rgba } = functions;
  const { borderRadius } = borders;
  const { colored } = boxShadows;

  // Contained variant styles
  const getContainedStyles = () => {
    const backgroundValue = palette[color]?.main || white.main;
    const focusedBackgroundValue = palette[color]?.focus || white.focus;

    const boxShadowValue = colored[color]
      ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow(
          [0, 3],
          [1, -2],
          palette[color].main,
          0.2
        )}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
      : "none";

    const hoveredBoxShadowValue = colored[color]
      ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow(
          [0, 4],
          [23, 0],
          palette[color].main,
          0.15
        )}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
      : "none";

    let colorValue = white.main;
    if (!darkMode && (color === "white" || color === "light" || !palette[color])) {
      colorValue = text.main;
    } else if (darkMode && (color === "white" || color === "light" || !palette[color])) {
      colorValue = grey[600];
    }

    let focusedColorValue = white.main;
    if (color === "white") {
      focusedColorValue = text.main;
    } else if (color === "primary" || color === "error" || color === "dark") {
      focusedColorValue = white.main;
    }

    return {
      background: backgroundValue,
      color: colorValue,
      boxShadow: boxShadowValue,

      "&:hover": {
        backgroundColor: backgroundValue,
        boxShadow: hoveredBoxShadowValue,
      },

      "&:focus:not(:hover)": {
        backgroundColor: focusedBackgroundValue,
        boxShadow: palette[color]
          ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
          : boxShadow([0, 0], [0, 3.2], white.main, 0.5),
      },

      "&:disabled": {
        backgroundColor: backgroundValue,
        color: focusedColorValue,
      },
    };
  };

  // Outlined variant styles
  const getOutlinedStyles = () => {
    const backgroundValue = color === "white" ? rgba(white.main, 0.1) : transparent.main;
    const colorValue = palette[color]?.main || white.main;
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    const borderColorValue =
      color === "white" ? rgba(white.main, 0.75) : palette[color]?.main || rgba(white.main, 0.75);

    return {
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,

      "&:hover": {
        background: transparent.main,
        borderColor: colorValue,
      },

      "&:focus:not(:hover)": {
        background: transparent.main,
        boxShadow: boxShadowValue,
      },

      "&:active:not(:hover)": {
        backgroundColor: colorValue,
        color: white.main,
        opacity: 0.85,
      },

      "&:disabled": {
        color: colorValue,
        borderColor: colorValue,
      },
    };
  };

  // Gradient variant styles
  const getGradientStyles = () => {
    const backgroundValue =
      color === "white" || !gradients[color]
        ? white.main
        : linearGradient(gradients[color].main, gradients[color].state);

    const boxShadowValue = colored[color]
      ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow(
          [0, 3],
          [1, -2],
          palette[color].main,
          0.2
        )}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
      : "none";

    const hoveredBoxShadowValue = colored[color]
      ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow(
          [0, 4],
          [23, 0],
          palette[color].main,
          0.15
        )}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
      : "none";

    let colorValue = white.main;
    if (color === "white") {
      colorValue = text.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    }

    return {
      background: backgroundValue,
      color: colorValue,
      boxShadow: boxShadowValue,

      "&:hover": {
        boxShadow: hoveredBoxShadowValue,
      },

      "&:focus:not(:hover)": {
        boxShadow: boxShadowValue,
      },

      "&:disabled": {
        background: backgroundValue,
        color: colorValue,
      },
    };
  };

  // Text variant styles
  const getTextStyles = () => {
    const colorValue = palette[color]?.main || white.main;
    const focusedColorValue = palette[color]?.focus || white.focus;

    return {
      color: colorValue,

      "&:hover": {
        color: focusedColorValue,
      },

      "&:focus:not(:hover)": {
        color: focusedColorValue,
      },
    };
  };

  // Circular styles
  const getCircularStyles = () => ({
    borderRadius: borderRadius.section,
  });

  // Icon-only styles
  const getIconOnlyStyles = () => {
    const sizeConfig = ICON_ONLY_SIZES[size] || ICON_ONLY_SIZES.medium;
    const sizeValue = pxToRem(sizeConfig.size);
    const paddingValue = pxToRem(sizeConfig.padding);

    return {
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,
      padding: size === "medium" ? `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}` : paddingValue,

      "& .material-icons": {
        marginTop: 0,
      },

      "&:hover, &:focus, &:active": {
        transform: "none",
      },
    };
  };

  return {
    ...(variant === "contained" && getContainedStyles()),
    ...(variant === "outlined" && getOutlinedStyles()),
    ...(variant === "gradient" && getGradientStyles()),
    ...(variant === "text" && getTextStyles()),
    ...(circular && getCircularStyles()),
    ...(iconOnly && getIconOnlyStyles()),
  };
});

MDButtonRoot.displayName = "MDButtonRoot";

export default MDButtonRoot;
