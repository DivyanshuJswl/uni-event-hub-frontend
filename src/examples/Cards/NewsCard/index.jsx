import PropTypes from "prop-types";
import { Card, CardMedia, CardContent, Button, Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function NewsCard({ name, source, description, author, publishedAt, image, link }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        backgroundColor: darkMode ? "background.default" : "background.paper",
        "&:hover": {
          boxShadow: darkMode ? 6 : 4,
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
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
          sx={{ m: 1.5, lineHeight: 1.3, color: darkMode ? "white" : "dark" }}
        >
          {name}
        </MDTypography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexWrap="wrap"
        >
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
        </Box>

        {description && (
          <MDTypography
            variant="body2"
            color="text"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </MDTypography>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
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
              sx={{
                textTransform: "none",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(25, 118, 210, 0.08)"
                    : "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Read More
            </Button>
          )}
        </Box>
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
