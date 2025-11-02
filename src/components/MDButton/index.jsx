/**
 * MDButton Component
 * Customizable button with multiple variants and styles
 * @module components/MDButton
 */

import { forwardRef, memo } from "react";
import MDButtonRoot from "components/MDButton/MDButtonRoot";
import { useMaterialUIController } from "context";

const MDButton = forwardRef(
  (
    {
      color = "white",
      variant = "contained",
      size = "medium",
      circular = false,
      iconOnly = false,
      children,
      ...rest
    },
    ref
  ) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
      >
        {children}
      </MDButtonRoot>
    );
  }
);

MDButton.displayName = "MDButton";

export default memo(MDButton);
