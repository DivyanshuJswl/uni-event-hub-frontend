// layouts/event-details/components/EventDetailsSkeleton.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Skeleton,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useMaterialUIController } from "context";

function EventDetailsSkeleton() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const skeletonColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const skeletonLightColor = darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const skeletonLighterColor = darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";

  return (
    <Container maxWidth="xl">
      {/* Back Button Skeleton */}
      <Box display="flex" alignItems="center" mb={3}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{
            mr: 2,
            bgcolor: skeletonLightColor,
          }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={40}
          sx={{
            bgcolor: skeletonColor,
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Image Skeleton */}
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{
              borderRadius: 3,
              bgcolor: skeletonColor,
            }}
          />
        </Grid>

        {/* Details Skeleton */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.default",
              boxShadow: darkMode
                ? "0 4px 20px rgba(0, 0, 0, 0.12)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Title and Status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Skeleton
                variant="text"
                width="70%"
                height={50}
                sx={{
                  bgcolor: skeletonColor,
                }}
              />
              <Skeleton
                variant="rounded"
                width={100}
                height={32}
                sx={{
                  borderRadius: 4,
                  bgcolor: skeletonLightColor,
                }}
              />
            </Box>

            {/* Category */}
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{
                  mr: 1,
                  bgcolor: skeletonLightColor,
                }}
              />
              <Skeleton
                variant="text"
                width={120}
                height={30}
                sx={{
                  bgcolor: skeletonLightColor,
                }}
              />
            </Box>

            {/* Divider */}
            <Skeleton
              variant="text"
              width="100%"
              height={1}
              sx={{
                my: 2,
                bgcolor: skeletonLighterColor,
              }}
            />

            {/* Date */}
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  bgcolor: skeletonLightColor,
                }}
              />
              <Box>
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                  sx={{
                    mb: 0.5,
                    bgcolor: skeletonLightColor,
                  }}
                />
                <Skeleton
                  variant="text"
                  width={200}
                  height={20}
                  sx={{
                    bgcolor: skeletonLightColor,
                  }}
                />
              </Box>
            </Box>

            {/* Location */}
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  bgcolor: skeletonLightColor,
                }}
              />
              <Box>
                <Skeleton
                  variant="text"
                  width={80}
                  height={24}
                  sx={{
                    mb: 0.5,
                    bgcolor: skeletonLightColor,
                  }}
                />
                <Skeleton
                  variant="text"
                  width={150}
                  height={20}
                  sx={{
                    bgcolor: skeletonLightColor,
                  }}
                />
              </Box>
            </Box>

            {/* Organizer */}
            <Box display="flex" alignItems="center" mb={3}>
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  bgcolor: skeletonLightColor,
                }}
              />
              <Box>
                <Skeleton
                  variant="text"
                  width={90}
                  height={24}
                  sx={{
                    mb: 0.5,
                    bgcolor: skeletonLightColor,
                  }}
                />
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  sx={{
                    bgcolor: skeletonLightColor,
                  }}
                />
              </Box>
            </Box>

            {/* Participation */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                  sx={{
                    bgcolor: skeletonLightColor,
                  }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  sx={{
                    bgcolor: skeletonLightColor,
                  }}
                />
              </Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={8}
                sx={{
                  borderRadius: 2,
                  bgcolor: skeletonLighterColor,
                }}
              />
            </Box>

            {/* Buttons */}
            <Box display="flex" gap={2}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={40}
                sx={{
                  borderRadius: 1,
                  bgcolor: skeletonColor,
                }}
              />
              <Skeleton
                variant="rounded"
                width="100%"
                height={40}
                sx={{
                  borderRadius: 1,
                  bgcolor: skeletonColor,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Description Skeleton */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.default",
              boxShadow: darkMode
                ? "0 4px 20px rgba(0, 0, 0, 0.12)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Skeleton
              variant="text"
              width={200}
              height={30}
              sx={{
                mb: 2,
                bgcolor: skeletonColor,
              }}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              sx={{
                mb: 1,
                bgcolor: skeletonLightColor,
              }}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              sx={{
                mb: 1,
                bgcolor: skeletonLightColor,
              }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{
                mb: 1,
                bgcolor: skeletonLightColor,
              }}
            />
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              sx={{
                mb: 1,
                bgcolor: skeletonLightColor,
              }}
            />
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={{
                bgcolor: skeletonLightColor,
              }}
            />
          </Paper>
        </Grid>

        {/* Participants Skeleton */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.default",
              boxShadow: darkMode
                ? "0 4px 20px rgba(0, 0, 0, 0.12)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Skeleton
              variant="text"
              width={200}
              height={30}
              sx={{
                mb: 2,
                bgcolor: skeletonColor,
              }}
            />
            <List>
              {[1, 2, 3].map((item) => (
                <ListItem key={item} divider>
                  <ListItemAvatar>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{
                        bgcolor: skeletonLightColor,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Skeleton
                        variant="text"
                        width={120}
                        height={24}
                        sx={{
                          bgcolor: skeletonLightColor,
                        }}
                      />
                    }
                    secondary={
                      <Skeleton
                        variant="text"
                        width={150}
                        height={20}
                        sx={{
                          bgcolor: skeletonLighterColor,
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default EventDetailsSkeleton;
