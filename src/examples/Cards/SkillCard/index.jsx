import { useMemo, memo } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardActions, Button, Chip, Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

// Memoized helper functions outside component
const getTrendColor = (trend) => {
  const colors = {
    high: "success",
    rising: "warning",
    moderate: "info",
  };
  return colors[trend] || "default";
};

const getTrendLabel = (trend) => {
  const labels = {
    high: "High Demand",
    rising: "Rising Fast",
    moderate: "Steady Growth",
  };
  return labels[trend] || "Trending";
};

function SkillCard({ title, description, url, trend, demand, avgSalary }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized trend data
  const trendData = useMemo(
    () => ({
      color: getTrendColor(trend),
      label: getTrendLabel(trend),
    }),
    [trend]
  );

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      p: 2,
      boxShadow: 2,
      "&:hover": {
        transform: "translateY(-2px)",
        transition: "all 0.2s ease-in-out",
        boxShadow: 4,
      },
    }),
    []
  );

  // Memoized button styles
  const buttonStyles = useMemo(
    () => ({
      textTransform: "none",
      color: "primary.main",
      "&:hover": {
        backgroundColor: darkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.04)",
      },
    }),
    [darkMode]
  );

  // Memoized chip styles
  const chipStyles = useMemo(
    () => ({
      fontWeight: "bold",
      fontSize: "0.7rem",
    }),
    []
  );

  // Check if metadata exists
  const hasMetadata = useMemo(() => demand || avgSalary, [demand, avgSalary]);

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <MDTypography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight="medium"
            sx={{
              color: darkMode ? "white" : "dark",
              flex: 1,
              mr: 1,
            }}
          >
            {title}
          </MDTypography>
          {trend && (
            <Chip label={trendData.label} color={trendData.color} size="small" sx={chipStyles} />
          )}
        </Box>

        <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
          {description}
        </MDTypography>

        {hasMetadata && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {demand && (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                📈 {demand} Job Demand
              </MDTypography>
            )}
            {avgSalary && (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                💰 {avgSalary} Avg Salary
              </MDTypography>
            )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "end", transform: "translateY(-20px)" }}>
        <Button
          size="small"
          endIcon={<Icon>arrow_forward</Icon>}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={buttonStyles}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

SkillCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["high", "rising", "moderate"]),
  demand: PropTypes.string,
  avgSalary: PropTypes.string,
};

SkillCard.defaultProps = {
  trend: null,
  demand: null,
  avgSalary: null,
};

SkillCard.displayName = "SkillCard";

export default memo(SkillCard);
