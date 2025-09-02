// Add this import at the top of your SkillCard component file
import PropTypes from "prop-types";
import { Card, CardContent, CardActions, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";

function SkillCard({ title, description, url }) {
  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <MDTypography gutterBottom variant="h6" component="div" fontWeight="medium">
          {title}
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {description}
        </MDTypography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          endIcon={<Icon>arrow_forward</Icon>}
          href={url}
          sx={{ textTransform: "none" }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

// Make sure this PropTypes definition comes AFTER the component
SkillCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default SkillCard;
