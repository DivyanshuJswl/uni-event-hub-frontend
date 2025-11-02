/**
 * Styled root component for MDAvatar
 * Creates gradient background avatar with customizable size
 * @module components/MDAvatar/MDAvatarRoot
 */

import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

/**
 * Size configuration map
 * Extracted as constant for better performance
 */
const SIZE_MAP = {
  xs: { width: 24, height: 24, fontSizeKey: "xs" },
  sm: { width: 36, height: 36, fontSizeKey: "sm" },
  md: { width: 48, height: 48, fontSizeKey: "md" },
  lg: { width: 58, height: 58, fontSizeKey: "sm" },
  xl: { width: 74, height: 74, fontSizeKey: "md" },
  xxl: { width: 110, height: 110, fontSizeKey: "md" },
};

/**
 * Styled MDAvatar root component
 * Memoized by styled-components internally
 */
const MDAvatarRoot = styled(Avatar)(({ theme, ownerState }) => {
  const { palette, functions, typography, boxShadows } = theme;
  const { shadow, bgColor, size } = ownerState;

  const { gradients, transparent, white } = palette;
  const { pxToRem, linearGradient } = functions;
  const { size: fontSize, fontWeightRegular } = typography;

  // Compute background value
  const backgroundValue =
    bgColor === "transparent"
      ? transparent.main
      : linearGradient(gradients[bgColor].main, gradients[bgColor].state);

  // Get size configuration
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const sizeValue = {
    width: pxToRem(sizeConfig.width),
    height: pxToRem(sizeConfig.height),
    fontSize: fontSize[sizeConfig.fontSizeKey],
  };

  return {
    background: backgroundValue,
    color: white.main,
    fontWeight: fontWeightRegular,
    boxShadow: boxShadows[shadow],
    ...sizeValue,
  };
});

MDAvatarRoot.displayName = "MDAvatarRoot";

export default MDAvatarRoot;
