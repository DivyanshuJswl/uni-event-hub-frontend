/**
 * MDBox Component
 * Versatile box container with gradient backgrounds and customizable styling
 * @module components/MDBox
 */

import { forwardRef, memo } from "react";
import MDBoxRoot from "components/MDBox/MDBoxRoot";

const MDBox = forwardRef(
  (
    {
      variant = "contained",
      bgColor = "transparent",
      color = "dark",
      opacity = 1,
      borderRadius = "none",
      shadow = "none",
      coloredShadow = "none",
      ...rest
    },
    ref
  ) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{
        variant,
        bgColor,
        color,
        opacity,
        borderRadius,
        shadow,
        coloredShadow,
      }}
    />
  )
);

MDBox.displayName = "MDBox";

export default memo(MDBox);
