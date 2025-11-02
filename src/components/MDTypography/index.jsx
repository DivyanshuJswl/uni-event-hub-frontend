/**
 * MDTypography Component
 * Customizable typography with gradient text support
 * @module components/MDTypography
 */

import { forwardRef, memo } from "react";
import MDTypographyRoot from "components/MDTypography/MDTypographyRoot";
import { useMaterialUIController } from "context";

const MDTypography = forwardRef(
  (
    {
      color = "dark",
      fontWeight = false,
      textTransform = "none",
      verticalAlign = "unset",
      textGradient = false,
      opacity = 1,
      children,
      ...rest
    },
    ref
  ) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDTypographyRoot
        {...rest}
        ref={ref}
        ownerState={{
          color,
          textTransform,
          verticalAlign,
          fontWeight,
          opacity,
          textGradient,
          darkMode,
        }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);

MDTypography.displayName = "MDTypography";

export default memo(MDTypography);
