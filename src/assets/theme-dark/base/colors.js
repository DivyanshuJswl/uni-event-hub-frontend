const colors = {
  background: {
    // Use deep neutral greys (not pure black) for comfortable contrast on dark UIs
    default: "#050505",
    sidenav: "#0E0F11",
    card: "#1A1A1A",
  },

  text: {
    // Off-white for body text on dark surfaces to avoid glare while exceeding AA
    main: "#E6E6E6",
    focus: "#FFFFFF",
  },

  transparent: {
    main: "rgba(0, 0, 0, 0)",
  },

  white: {
    main: "#FAFAFA",
    focus: "#FFFFFF",
  },

  black: {
    light: "#151515",
    main: "#000000",
    focus: "#000000",
  },

  // Accents tuned for clarity on dark backgrounds, with darker hover/pressed
  primary: {
    main: "#3B82F6",
    focus: "#2563EB",
  },

  secondary: {
    main: "#22D3EE",
    focus: "#06B6D4",
  },

  info: {
    main: "#42A5F5",
    focus: "#1E88E5",
  },

  success: {
    main: "#4CAF50",
    focus: "#2E7D32",
  },

  warning: {
    main: "#FFB74D",
    focus: "#FB8C00",
  },

  error: {
    main: "#EF5350",
    focus: "#D32F2F",
  },

  // Subtle elevation overlays for dark surfaces (hover/active)
  light: {
    main: "rgba(255, 255, 255, 0.08)",
    focus: "rgba(255, 255, 255, 0.12)",
  },

  dark: {
    main: "#1C1C1E",
    focus: "#121212",
  },

  grey: {
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  gradients: {
    primary: { main: "#60A5FA", state: "#2563EB" },
    secondary: { main: "#67E8F9", state: "#06B6D4" },
    info: { main: "#64B5F6", state: "#1E88E5" },
    success: { main: "#66BB6A", state: "#2E7D32" },
    warning: { main: "#FFCC80", state: "#FB8C00" },
    error: { main: "#EF9A9A", state: "#D32F2F" },
    light: { main: "#2E2E2E", state: "#1C1C1E" },
    dark: { main: "#2A2A2A", state: "#101010" },
  },

  socialMediaColors: {
    facebook: { main: "#3B5998", dark: "#2D4373" },
    twitter: { main: "#55ACEE", dark: "#2795E9" },
    instagram: { main: "#E1306C", dark: "#C72E5E" },
    linkedin: { main: "#0077B5", dark: "#005983" },
    youtube: { main: "#FF0000", dark: "#CC0000" },
    github: { main: "#24292E", dark: "#171A1D" },
  },

  // Badge backgrounds deepen; badge text is brightened for clarity
  badgeColors: {
    primary: { background: "#1E3A8A", text: "#CFE8FF" },
    secondary: { background: "#37474F", text: "#E2ECEF" },
    info: { background: "#1565C0", text: "#E3F2FD" },
    success: { background: "#1B5E20", text: "#D5F5D8" },
    warning: { background: "#E65100", text: "#FFE6C2" },
    error: { background: "#B71C1C", text: "#FFD9DC" },
    light: { background: "#2E2E2E", text: "#E6E6E6" },
    dark: { background: "#101010", text: "#FFFFFF" },
  },

  // Shadows colored to match accents while remaining legible on dark
  coloredShadows: {
    primary: "#1A73E8",
    secondary: "#263238",
    info: "#00ACC1",
    success: "#43A047",
    warning: "#FB8C00",
    error: "#E53935",
    light: "#9E9E9E",
    dark: "#000000",
  },

  // Slightly lighter border for clearer delineation on dark
  inputBorderColor: "#2A2A2A",

  tabs: {
    indicator: { boxShadow: "#3B82F6" },
  },
};

export default colors;
