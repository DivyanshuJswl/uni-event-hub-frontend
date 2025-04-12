import { Box, CircularProgress, Typography, keyframes } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Animation keyframes
const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
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
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
        animation: `${fadeIn} 0.5s ease-out forwards`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          opacity: 0.1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: `${pulse} 2s infinite ease-in-out`,
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
          // src="/path/to/your/logo.png" // Replace with your logo
          sx={{
            width: 40,
            height: 40,
            animation: `${pulse} 2s infinite ease-in-out`,
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          mt: 4,
          color: theme.palette.text.primary,
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
            width: 30,
            height: 2,
            background: theme.palette.primary.main,
            animation: `${pulse} 1.5s infinite ease-in-out`,
          },
        }}
      >
        Loading Uni-Event HUB
      </Typography>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          color: theme.palette.text.secondary,
          animation: `${fadeIn} 1s ease-out 0.6s both`,
        }}
      >
        Please wait while we prepare your dashboard
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
