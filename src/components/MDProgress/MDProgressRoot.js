/**
 * Styled root component for MDProgress
 * @module components/MDProgress/MDProgressRoot
 */

import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

const MDProgressRoot = styled(LinearProgress)(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { color, value, variant } = ownerState;

  const { text, gradients } = palette;
  const { linearGradient } = functions;

  // Compute background value
  const backgroundValue =
    variant === "gradient"
      ? gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.info.main, gradients.info.state)
      : palette[color]?.main || palette.info.main;

  return {
    "& .MuiLinearProgress-bar": {
      background: backgroundValue,
      width: `${value}%`,
      color: text.main,
    },
  };
});

MDProgressRoot.displayName = "MDProgressRoot";

export default MDProgressRoot;
