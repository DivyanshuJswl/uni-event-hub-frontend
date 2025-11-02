/**
 * MDAvatar Component
 * Customizable avatar with gradient backgrounds and sizes
 * @module components/MDAvatar
 */

import { forwardRef, memo } from "react";
import PropTypes from "prop-types";
import MDAvatarRoot from "components/MDAvatar/MDAvatarRoot";

const MDAvatar = forwardRef(
  ({ bgColor = "transparent", size = "md", shadow = "none", ...rest }, ref) => (
    <MDAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
  )
);

MDAvatar.propTypes = {
  bgColor: PropTypes.oneOf([
    "transparent",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
  shadow: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl", "xxl", "inset"]),
};

MDAvatar.displayName = "MDAvatar";

export default memo(MDAvatar);
