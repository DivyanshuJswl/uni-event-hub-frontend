/**
 * MDInput Component
 * Customizable input field with error and success states
 * @module components/MDInput
 */

import { forwardRef, memo } from "react";
import MDInputRoot from "components/MDInput/MDInputRoot";

const MDInput = forwardRef(({ error = false, success = false, disabled = false, ...rest }, ref) => (
  <MDInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
));

MDInput.displayName = "MDInput";

export default memo(MDInput);
