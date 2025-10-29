import { useEffect, useMemo, memo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  // Set layout on mount and pathname change
  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname, dispatch]);

  // Memoized styles to prevent recalculation
  const layoutStyles = useMemo(
    () =>
      ({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      }),
    [miniSidenav]
  );

  return <MDBox sx={layoutStyles}>{children}</MDBox>;
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

DashboardLayout.displayName = "DashboardLayout";

export default memo(DashboardLayout);
