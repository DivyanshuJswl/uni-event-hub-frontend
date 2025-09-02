import PropTypes from "prop-types";
import { Card, CardMedia, CardContent, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function NewsCard({ name, source, description, author, publishedAt, image, link }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      {image && (
        <CardMedia
          component="img"
          height="160"
          image={image}
          alt={name}
          sx={{
            objectFit: "cover",
            maxHeight: "160px",
            objectPosition: "center",
          }}
        />
      )}
      <CardContent>
        <MDTypography
          gutterBottom
          variant="h6"
          component="div"
          fontWeight="medium"
          sx={{ m: 1.5, lineHeight: 1 }}
        >
          {name}
        </MDTypography>

        <MDBox display="flex" justifyContent="space-between" mb={1}>
          {source && (
            <MDTypography variant="caption" fontWeight="bold" color="text">
              {source}
            </MDTypography>
          )}
          {publishedAt && (
            <MDTypography variant="caption" color="text">
              {formatDate(publishedAt)}
            </MDTypography>
          )}
        </MDBox>

        {description && (
          <MDTypography variant="body2" color="text">
            {description}
          </MDTypography>
        )}

        <MDBox sx={{ justifyContent: "flex-end" }} mt={2}>
          {author && (
            <MDTypography variant="caption" color="text" fontStyle="italic">
              By {author}
            </MDTypography>
          )}
          {link && (
            <Button
              size="small"
              endIcon={<Icon>arrow_forward</Icon>}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: "none" }}
            >
              Read More
            </Button>
          )}
        </MDBox>
      </CardContent>
    </Card>
  );
}

NewsCard.propTypes = {
  name: PropTypes.string,
  source: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  image: PropTypes.string,
  link: PropTypes.string,
  publishedAt: PropTypes.string,
};

NewsCard.defaultProps = {
  source: "",
  description: "",
  author: "",
  date: "",
  image: null,
};

export default NewsCard;
