import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

function DefaultProjectCard({ image, label, title, description, action, authors }) {
  // Memoized authors rendering
  const renderAuthors = useMemo(() => {
    return authors.map(({ image: media, name }) => (
      <Tooltip key={name} title={name} placement="bottom">
        <MDAvatar
          src={media}
          alt={name}
          size="xs"
          sx={({ borders: { borderWidth }, palette: { white } }) => ({
            border: `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",
            ml: -1.25,
            "&:hover, &:focus": { zIndex: "10" },
          })}
        />
      </Tooltip>
    ));
  }, [authors]);

  // Memoized button component
  const ActionButton = useMemo(() => {
    const buttonProps = {
      variant: "outlined",
      size: "small",
      color: action.color,
      children: action.label,
    };

    return action.type === "internal" ? (
      <MDButton component={Link} to={action.route} {...buttonProps} />
    ) : (
      <MDButton
        component="a"
        href={action.route}
        target="_blank"
        rel="noreferrer"
        {...buttonProps}
      />
    );
  }, [action]);

  // Memoized title component
  const TitleComponent = useMemo(() => {
    const titleProps = {
      variant: "h5",
      textTransform: "capitalize",
      children: title,
    };

    return action.type === "internal" ? (
      <MDTypography component={Link} to={action.route} {...titleProps} />
    ) : (
      <MDTypography
        component="a"
        href={action.route}
        target="_blank"
        rel="noreferrer"
        {...titleProps}
      />
    );
  }, [action, title]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
        <CardMedia
          src={image}
          component="img"
          title={title}
          sx={{ maxWidth: "100%", margin: 0, objectFit: "cover" }}
        />
      </MDBox>
      <MDBox mt={1} mx={0.5}>
        <MDTypography variant="button" fontWeight="regular" color="text" textTransform="capitalize">
          {label}
        </MDTypography>
        <MDBox mb={1}>{TitleComponent}</MDBox>
        <MDBox mb={3} lineHeight={0}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          {ActionButton}
          <MDBox display="flex">{renderAuthors}</MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

DefaultProjectCard.defaultProps = {
  authors: [],
};

DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "white",
    ]).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
};

DefaultProjectCard.displayName = "DefaultProjectCard";

export default memo(DefaultProjectCard);
