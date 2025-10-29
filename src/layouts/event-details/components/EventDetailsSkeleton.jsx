import { memo, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Skeleton,
  Paper,
} from "@mui/material";
import { useMaterialUIController } from "context";

const EventDetailsSkeleton = memo(() => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized skeleton colors
  const colors = useMemo(
    () => ({
      main: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      light: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      lighter: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
    }),
    [darkMode]
  );

  return (
    <Container maxWidth="xl">
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={3}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2, bgcolor: colors.light }} />
        <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: colors.main }} />
      </Box>

      <Grid container spacing={4}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 3, bgcolor: colors.main }}
          />
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width="70%" height={50} sx={{ bgcolor: colors.main }} />
              <Skeleton
                variant="rounded"
                width={100}
                height={32}
                sx={{ borderRadius: 4, bgcolor: colors.light }}
              />
            </Box>

            {[1, 2, 3].map((item) => (
              <Box key={item} display="flex" alignItems="center" mb={2}>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 1, bgcolor: colors.light }}
                />
                <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: colors.light }} />
              </Box>
            ))}

            <Box mb={3}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={8}
                sx={{ borderRadius: 2, bgcolor: colors.lighter }}
              />
            </Box>

            <Box display="flex" gap={2}>
              {[1, 2].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 1, bgcolor: colors.main }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, backgroundColor: "background.default" }}
          >
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2, bgcolor: colors.main }} />
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="text"
                width="100%"
                height={20}
                sx={{ mb: 1, bgcolor: colors.light }}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
});

EventDetailsSkeleton.displayName = "EventDetailsSkeleton";

export default EventDetailsSkeleton;
