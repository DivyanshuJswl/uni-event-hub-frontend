/**
 * Styled close icon component for MDAlert
 * Creates clickable close button
 * @module components/MDAlert/MDAlertCloseIcon
 */

import { styled } from "@mui/material/styles";

/**
 * Styled MDAlert close icon component
 * Memoized by styled-components internally
 */
const MDAlertCloseIcon = styled("span")(({ theme }) => {
  const { palette, typography, functions } = theme;

  const { white } = palette;
  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    color: white.main,
    fontSize: size.xl,
    padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
    marginLeft: pxToRem(40),
    fontWeight: fontWeightMedium,
    cursor: "pointer",
    lineHeight: 0,
    transition: "opacity 0.2s ease",

    "&:hover": {
      opacity: 0.8,
    },

    // Accessibility improvements
    "&:focus": {
      outline: "2px solid rgba(255, 255, 255, 0.5)",
      outlineOffset: "2px",
    },
  };
});

MDAlertCloseIcon.displayName = "MDAlertCloseIcon";

export default MDAlertCloseIcon;
