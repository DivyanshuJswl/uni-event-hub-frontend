import { useMemo, memo } from "react";
import PropTypes from "prop-types";
import { Card, CardMedia, CardContent, Button, Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function NewsCard({
  name = "",
  source = "",
  description = "",
  author = "",
  publishedAt = "",
  image = null,
  link = "",
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized date formatting function
  const formattedDate = useMemo(() => {
    if (!publishedAt) return "";
    const date = new Date(publishedAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [publishedAt]);

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      mb: 2,
      boxShadow: 3,
      "&:hover": {
        boxShadow: darkMode ? 6 : 4,
        transform: "translateY(-2px)",
        transition: "all 0.2s ease-in-out",
      },
    }),
    [darkMode]
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

  // Memoized media styles
  const mediaStyles = useMemo(
    () => ({
      objectFit: "cover",
      maxHeight: "160px",
      objectPosition: "center",
    }),
    []
  );

  return (
    <Card sx={cardStyles}>
      {image && (
        <CardMedia component="img" height="160" image={image} alt={name} sx={mediaStyles} />
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
          {formattedDate && (
            <MDTypography variant="caption" color="text">
              {formattedDate}
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
              sx={buttonStyles}
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
  name: PropTypes.string.isRequired,
  source: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.string,
  publishedAt: PropTypes.string,
  image: PropTypes.string,
  link: PropTypes.string,
};

NewsCard.displayName = "NewsCard";

export default memo(NewsCard);
