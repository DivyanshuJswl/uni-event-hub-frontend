/**
 * MDBadge Component
 * Customizable badge with gradient and contained variants
 * @module components/MDBadge
 */

import { forwardRef, memo } from "react";
import PropTypes from "prop-types";
import MDBadgeRoot from "components/MDBadge/MDBadgeRoot";

const MDBadge = forwardRef(
  (
    {
      color = "info",
      variant = "gradient",
      size = "sm",
      circular = false,
      indicator = false,
      border = false,
      container = false,
      children = false,
      ...rest
    },
    ref
  ) => (
    <MDBadgeRoot
      {...rest}
      ownerState={{
        color,
        variant,
        size,
        circular,
        indicator,
        border,
        container,
        children,
      }}
      ref={ref}
      color="default"
    >
      {children}
    </MDBadgeRoot>
  )
);

MDBadge.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  variant: PropTypes.oneOf(["gradient", "contained"]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  circular: PropTypes.bool,
  indicator: PropTypes.bool,
  border: PropTypes.bool,
  children: PropTypes.node,
  container: PropTypes.bool,
};

MDBadge.displayName = "MDBadge";

export default memo(MDBadge);
