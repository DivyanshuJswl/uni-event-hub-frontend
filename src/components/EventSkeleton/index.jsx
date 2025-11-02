import { useMemo, memo } from "react";
import PropTypes from "prop-types";
import { Card, Grid, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

const EventCardSkeleton = ({ count = 3 }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized skeleton color values
  const skeletonColors = useMemo(
    () => ({
      primary: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      secondary: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      tertiary: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
    }),
    [darkMode]
  );

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      padding: 2,
      backgroundColor: "background.default",
      borderRadius: 2,
      boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.12)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
    }),
    [darkMode]
  );

  // Memoized skeleton style objects
  const skeletonStyles = useMemo(
    () => ({
      image: {
        borderRadius: 2,
        mb: 2,
        bgcolor: skeletonColors.primary,
      },
      statusChip: {
        borderRadius: 4,
        mb: 2,
        bgcolor: skeletonColors.secondary,
      },
      title: {
        mb: 1,
        bgcolor: skeletonColors.primary,
      },
      icon: {
        mr: 1,
        bgcolor: skeletonColors.secondary,
      },
      text: {
        bgcolor: skeletonColors.secondary,
      },
      divider: {
        my: 1,
        bgcolor: skeletonColors.tertiary,
      },
      progressBar: {
        borderRadius: 3,
        bgcolor: skeletonColors.tertiary,
      },
      button: {
        borderRadius: 1,
        bgcolor: skeletonColors.primary,
      },
    }),
    [skeletonColors]
  );

  // Generate array once based on count
  const skeletonItems = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <>
      {skeletonItems.map((item) => (
        <Grid item xs={12} md={6} lg={4} key={item}>
          <MDBox mb={3}>
            <Card sx={cardStyles}>
              {/* Image skeleton */}
              <Skeleton variant="rounded" width="100%" height={200} sx={skeletonStyles.image} />

              {/* Status chip skeleton */}
              <Skeleton variant="rounded" width={80} height={24} sx={skeletonStyles.statusChip} />

              {/* Title skeleton */}
              <Skeleton variant="text" width="80%" height={28} sx={skeletonStyles.title} />

              {/* Category skeleton */}
              <Box display="flex" alignItems="center" mb={1}>
                <Skeleton variant="circular" width={16} height={16} sx={skeletonStyles.icon} />
                <Skeleton variant="text" width="40%" height={20} sx={skeletonStyles.text} />
              </Box>

              {/* Divider */}
              <Skeleton variant="text" width="100%" height={1} sx={skeletonStyles.divider} />

              {/* Date skeleton */}
              <Box display="flex" alignItems="center" mb={1}>
                <Skeleton variant="circular" width={16} height={16} sx={skeletonStyles.icon} />
                <Skeleton variant="text" width="60%" height={20} sx={skeletonStyles.text} />
              </Box>

              {/* Location skeleton */}
              <Box display="flex" alignItems="center" mb={2}>
                <Skeleton variant="circular" width={16} height={16} sx={skeletonStyles.icon} />
                <Skeleton variant="text" width="70%" height={20} sx={skeletonStyles.text} />
              </Box>

              {/* Participants progress skeleton */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={16} height={16} sx={skeletonStyles.icon} />
                    <Skeleton variant="text" width={100} height={20} sx={skeletonStyles.text} />
                  </Box>
                  <Skeleton variant="text" width={30} height={20} sx={skeletonStyles.text} />
                </Box>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={6}
                  sx={skeletonStyles.progressBar}
                />
              </Box>

              {/* Button skeleton */}
              <Skeleton variant="rounded" width="100%" height={40} sx={skeletonStyles.button} />
            </Card>
          </MDBox>
        </Grid>
      ))}
    </>
  );
};

EventCardSkeleton.propTypes = {
  count: PropTypes.number,
};

EventCardSkeleton.displayName = "EventCardSkeleton";

export default memo(EventCardSkeleton);
