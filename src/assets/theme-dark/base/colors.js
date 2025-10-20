const colors = {
  background: {
    default: "#000000", // Dark navy blue (almost black)
    sidenav: "#050505", // Dark slate blue
    card: "#0a0a0a", // Dark gunmetal blue
  },

  text: {
    main: "#EDEDED", // Softer white for readability (not #fff)
    focus: "#FFFFFF", // Pure white for hover/active emphasis
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

  primary: {
    main: "#1E88E5", // Clean Material Blue (cool accent)
    focus: "#1565C0", // Slightly darker for hover states
  },

  secondary: {
    main: "#00A9E0", // Balanced cyan-blue
    focus: "#00C2FF", // Vibrant hover version
  },

  info: {
    main: "#2196F3",
    focus: "#1976D2",
  },

  success: {
    main: "#43A047", // Fresh green
    focus: "#2E7D32", // Deeper green for pressed states
  },

  warning: {
    main: "#FB8C00",
    focus: "#F57C00",
  },

  error: {
    main: "#E53935",
    focus: "#D32F2F",
  },

  light: {
    main: "rgba(255,255,255,0.08)", // Subtle overlay for surfaces
    focus: "rgba(255,255,255,0.12)", // Hover overlay
  },

  dark: {
    main: "#1C1C1E", // Deep neutral dark
    focus: "#121212", // True dark for hover areas
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
    primary: {
      main: "#42A5F5",
      state: "#1976D2",
    },
    secondary: {
      main: "#607D8B",
      state: "#455A64",
    },
    info: {
      main: "#64B5F6",
      state: "#1E88E5",
    },
    success: {
      main: "#66BB6A",
      state: "#388E3C",
    },
    warning: {
      main: "#FFB74D",
      state: "#FB8C00",
    },
    error: {
      main: "#E57373",
      state: "#D32F2F",
    },
    light: {
      main: "#2E2E2E",
      state: "#1C1C1E",
    },
    dark: {
      main: "#2A2A2A",
      state: "#101010",
    },
  },

  socialMediaColors: {
    facebook: { main: "#3B5998", dark: "#2D4373" },
    twitter: { main: "#55ACEE", dark: "#2795E9" },
    instagram: { main: "#E1306C", dark: "#C72E5E" },
    linkedin: { main: "#0077B5", dark: "#005983" },
    youtube: { main: "#FF0000", dark: "#CC0000" },
    github: { main: "#24292E", dark: "#171A1D" },
  },

  badgeColors: {
    primary: {
      background: "#1E3A8A",
      text: "#90CAF9",
    },
    secondary: {
      background: "#37474F",
      text: "#CFD8DC",
    },
    info: {
      background: "#1565C0",
      text: "#E3F2FD",
    },
    success: {
      background: "#1B5E20",
      text: "#C8E6C9",
    },
    warning: {
      background: "#E65100",
      text: "#FFE0B2",
    },
    error: {
      background: "#B71C1C",
      text: "#FFCDD2",
    },
    light: {
      background: "#2E2E2E",
      text: "#E0E0E0",
    },
    dark: {
      background: "#101010",
      text: "#FFFFFF",
    },
  },

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

  inputBorderColor: "#2E2E2E",

  tabs: {
    indicator: { boxShadow: "#1E88E5" },
  },
};

export default colors;
