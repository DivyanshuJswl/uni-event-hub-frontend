import PropTypes from "prop-types";
import { Card, CardContent, CardActions, Button, Chip, Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function SkillCard({ title, description, url, trend, demand, avgSalary }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const getTrendColor = (trend) => {
    switch (trend) {
      case "high":
        return "success";
      case "rising":
        return "warning";
      case "moderate":
        return "info";
      default:
        return "default";
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case "high":
        return "High Demand";
      case "rising":
        return "Rising Fast";
      case "moderate":
        return "Steady Growth";
      default:
        return "Trending";
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        boxShadow: 2,
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
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
            <Chip
              label={getTrendLabel(trend)}
              color={getTrendColor(trend)}
              size="small"
              sx={{
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
          {description}
        </MDTypography>

        {(demand || avgSalary) && (
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
          sx={{
            textTransform: "none",
            color: "primary.main",
            "&:hover": {
              backgroundColor: darkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.04)",
            },
          }}
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
  trend: PropTypes.string,
  demand: PropTypes.string,
  avgSalary: PropTypes.string,
};

SkillCard.defaultProps = {
  trend: null,
  demand: null,
  avgSalary: null,
};

export default SkillCard;
