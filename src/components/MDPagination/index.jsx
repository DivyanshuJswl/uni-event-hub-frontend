/**
 * MDPagination Component
 * Pagination wrapper and item component
 * @module components/MDPagination
 */

import { forwardRef, createContext, useContext, useMemo, memo } from "react";
import MDBox from "components/MDBox";
import MDPaginationItemRoot from "components/MDPagination/MDPaginationItemRoot";

// Pagination context
const PaginationContext = createContext(null);

const MDPagination = forwardRef(
  (
    {
      item = false,
      variant = "gradient",
      color = "info",
      size = "medium",
      active = false,
      children,
      ...rest
    },
    ref
  ) => {
    const context = useContext(PaginationContext);
    const paginationSize = context?.size || size;

    // Memoized context value
    const contextValue = useMemo(() => ({ variant, color, size }), [variant, color, size]);

    return (
      <PaginationContext.Provider value={contextValue}>
        {item ? (
          <MDPaginationItemRoot
            {...rest}
            ref={ref}
            variant={active ? context?.variant || variant : "outlined"}
            color={active ? context?.color || color : "secondary"}
            iconOnly
            circular
            ownerState={{ variant, active, paginationSize }}
          >
            {children}
          </MDPaginationItemRoot>
        ) : (
          <MDBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ listStyle: "none" }}
          >
            {children}
          </MDBox>
        )}
      </PaginationContext.Provider>
    );
  }
);

MDPagination.displayName = "MDPagination";

export default memo(MDPagination);
export { PaginationContext };
