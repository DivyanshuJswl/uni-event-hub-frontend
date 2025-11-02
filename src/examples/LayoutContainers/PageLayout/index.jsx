import { useEffect, useMemo, memo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";

function PageLayout({ background = "default", children }) {
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();

  // Set layout on mount and pathname change
  useEffect(() => {
    setLayout(dispatch, "page");
  }, [pathname, dispatch]);

  // Memoized styles to prevent recalculation
  const layoutStyles = useMemo(
    () => ({
      width: "100vw",
      height: "100%",
      minHeight: "100vh",
      bgColor: background,
      overflowX: "hidden",
    }),
    [background]
  );

  return <MDBox sx={layoutStyles}>{children}</MDBox>;
}

PageLayout.propTypes = {
  background: PropTypes.oneOf(["white", "light", "default"]),
  children: PropTypes.node.isRequired,
};

PageLayout.displayName = "PageLayout";

export default memo(PageLayout);
