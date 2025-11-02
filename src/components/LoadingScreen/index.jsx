import { Box, CircularProgress, Typography, keyframes } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Animations
const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        backgroundColor: theme.palette.background.default || "#000000",
        zIndex: 9999,
        animation: `${fadeIn} 0.6s ease-out forwards`,
      }}
    >
      {/* Spinner */}
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: `${pulse} 1.2s infinite ease-in-out`,
        }}
      >
        <CircularProgress
          thickness={2}
          size={120}
          sx={{
            position: "absolute",
            color: theme.palette.primary.light,
            animation: `${rotate} 2s linear infinite`,
          }}
        />
        <CircularProgress
          thickness={3}
          size={80}
          sx={{
            position: "absolute",
            color: theme.palette.primary.main,
            animation: `${rotate} 1.5s linear infinite reverse`,
          }}
        />
        <Box
          component="img"
          src="https://res.cloudinary.com/dh5cebjwj/image/upload/v1758826369/Untitled_design_prev_ui_zdpphg.svg"
          alt="App Logo"
          sx={{
            width: 42,
            height: 42,
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))",
          }}
        />
      </Box>

      {/* Loading Text */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary,
          fontWeight: 500,
          letterSpacing: 1.2,
          animation: `${fadeIn} 0.8s ease-out 0.3s both`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        Loading Uni-Event HUB
      </Typography>

      {/* Subtext */}
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.main,
          opacity: 0.7,
          letterSpacing: 0.5,
        }}
      >
        Please wait while we prepare your dashboard
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
