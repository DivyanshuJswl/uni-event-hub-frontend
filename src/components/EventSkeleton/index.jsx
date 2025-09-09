import { Card, Grid, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import React from "react";

const index = () => {
    const [ controller ] = useMaterialUIController();
    const { darkMode } = controller;
  return (
    <>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} md={6} lg={4} key={item}>
          <MDBox mb={3}>
            <Card
              sx={{
                padding: 2,
                backgroundColor: darkMode ? "background.default" : "background.paper",
                borderRadius: 2,
                boxShadow: darkMode
                  ? "0 4px 20px rgba(0, 0, 0, 0.12)"
                  : "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Image skeleton */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={200}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                }}
              />

              {/* Status chip skeleton */}
              <Skeleton
                variant="rounded"
                width={80}
                height={24}
                sx={{
                  borderRadius: 4,
                  mb: 2,
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                }}
              />

              {/* Title skeleton */}
              <Skeleton
                variant="text"
                width="80%"
                height={28}
                sx={{
                  mb: 1,
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                }}
              />

              {/* Category skeleton */}
              <Box display="flex" alignItems="center" mb={1}>
                <Skeleton
                  variant="circular"
                  width={16}
                  height={16}
                  sx={{
                    mr: 1,
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={20}
                  sx={{
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
              </Box>

              {/* Divider */}
              <Skeleton
                variant="text"
                width="100%"
                height={1}
                sx={{
                  my: 1,
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                }}
              />

              {/* Date skeleton */}
              <Box display="flex" alignItems="center" mb={1}>
                <Skeleton
                  variant="circular"
                  width={16}
                  height={16}
                  sx={{
                    mr: 1,
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  sx={{
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
              </Box>

              {/* Location skeleton */}
              <Box display="flex" alignItems="center" mb={2}>
                <Skeleton
                  variant="circular"
                  width={16}
                  height={16}
                  sx={{
                    mr: 1,
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="70%"
                  height={20}
                  sx={{
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
              </Box>

              {/* Participants progress skeleton */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Skeleton
                      variant="circular"
                      width={16}
                      height={16}
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      sx={{
                        bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                      }}
                    />
                  </Box>
                  <Skeleton
                    variant="text"
                    width={30}
                    height={20}
                    sx={{
                      bgcolor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                    }}
                  />
                </Box>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={6}
                  sx={{
                    borderRadius: 3,
                    bgcolor: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                  }}
                />
              </Box>

              {/* Button skeleton */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={40}
                sx={{
                  borderRadius: 1,
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                }}
              />
            </Card>
          </MDBox>
        </Grid>
      ))}
    </>
  );
};

export default index;
