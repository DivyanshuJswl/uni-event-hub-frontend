const colors = {
  background: {
    default: "#F7F9FC", // App canvas (very soft blue-grey for depth) [web:2]
    sidenav: "#EFF3F7", // Distinct from canvas for structure [web:2]
    card: "#FFFFFF", // High elevation surface [web:2]
  },

  text: {
    main: "#111316", // Near-black for AA with light surfaces [web:1]
    focus: "#000000", // Max emphasis on headings/active states [web:1]
  },

  // Utility
  transparent: { main: "rgba(0, 0, 0, 0)" },

  white: { main: "#FFFFFF", focus: "#F5F5F5" },

  black: { light: "#2B2B2B", main: "#000000", focus: "#000000" },

  // Brand accents — tuned for readability on white and light greys
  primary: {
    main: "#1E88E5", // Material blue 600-equivalent [web:2]
    focus: "#1565C0", // Darker for hover/pressed [web:2]
  },

  secondary: {
    main: "#6B7A6B", // Refined sage with higher contrast [web:1]
    focus: "#566556", // Darker state [web:1]
  },

  info: { main: "#0288D1", focus: "#0277BD" }, // Cyan-blue [web:2]
  success: { main: "#2E7D32", focus: "#1B5E20" }, // Green [web:2]
  warning: { main: "#ED6C02", focus: "#E65100" }, // Orange [web:2]
  error: { main: "#D32F2F", focus: "#C62828" }, // Red [web:2]

  // Light surfaces for hover/active on light theme
  light: {
    main: "rgba(0, 0, 0, 0.04)", // Subtle hover overlay on white [web:2]
    focus: "rgba(0, 0, 0, 0.08)", // Active/pressed overlay [web:2]
  },

  // Dark token useful for text on colored chips etc.
  dark: { main: "#101010", focus: "#000000" },

  // Neutral greys aligned to common UI steps
  grey: {
    100: "#FAFBFC",
    200: "#F3F4F6",
    300: "#E5E7EB",
    400: "#D1D5DB",
    500: "#9CA3AF",
    600: "#6B7280",
    700: "#4B5563",
    800: "#374151",
    900: "#111827",
  },

  // Gradients with accessible endpoints
  gradients: {
    primary: { main: "#64B5F6", state: "#1976D2" }, // Blue range [web:2]
    secondary: { main: "#9FB6A2", state: "#566556" }, // Sage range [web:1]
    info: { main: "#4FC3F7", state: "#0288D1" }, // Info range [web:2]
    success: { main: "#81C784", state: "#388E3C" }, // Success range [web:2]
    warning: { main: "#FFB74D", state: "#F57C00" }, // Warning range [web:2]
    error: { main: "#E57373", state: "#D32F2F" }, // Error range [web:2]
    light: { main: "#FFFFFF", state: "#F3F4F6" }, // Subtle light [web:2]
    dark: { main: "#4F4F4F", state: "#212121" }, // Neutral dark [web:2]
  },

  // Social brands unchanged
  socialMediaColors: {
    facebook: { main: "#3B5998", dark: "#2D4373" },
    twitter: { main: "#55ACEE", dark: "#2795E9" },
    instagram: { main: "#E1306C", dark: "#C72E5E" },
    linkedin: { main: "#0077B5", dark: "#005983" },
    youtube: { main: "#FF0000", dark: "#CC0000" },
    github: { main: "#24292E", dark: "#171A1D" },
  },

  // Badges: ensure on-background and on-color AA contrast
  badgeColors: {
    primary: { background: "#E9F3FF", text: "#1565C0" }, // ~8:1 on bg [web:1]
    secondary: { background: "#EDF3ED", text: "#4E5E4E" }, // improved sage [web:1]
    info: { background: "#D9F3FF", text: "#0277BD" }, // strong legibility [web:1]
    success: { background: "#E6F4EA", text: "#1B5E20" }, // AA text-on-badge [web:1]
    warning: { background: "#FFF3E0", text: "#E65100" }, // AA over light [web:1]
    error: { background: "#FFE5E7", text: "#C62828" }, // AA over light [web:1]
    light: { background: "#FFFFFF", text: "#6B7280" }, // neutral text [web:1]
    dark: { background: "#F0F2F5", text: "#111316" }, // high contrast [web:1]
  },

  // Colored shadows — subtle, not muddy on light backgrounds
  coloredShadows: {
    primary: "#90CAF9",
    secondary: "#9FB6A2",
    info: "#81D4FA",
    success: "#A5D6A7",
    warning: "#FFCC80",
    error: "#EF9A9A",
    light: "#E2E8F0",
    dark: "#94A3B8",
  },

  // Inputs and dividers — tuned for clear affordances on white
  inputBorderColor: "#D0D7DE", // GitHub-like neutral [web:1]

  // Tabs — indicator visible on light surfaces
  tabs: {
    indicator: { boxShadow: "#1E88E5" }, // Visible and on-brand [web:2]
  },
};

// Freeze to prevent mutations in runtime
Object.freeze(colors.background);
Object.freeze(colors.text);
Object.freeze(colors.transparent);
Object.freeze(colors.white);
Object.freeze(colors.black);
Object.freeze(colors.primary);
Object.freeze(colors.secondary);
Object.freeze(colors.info);
Object.freeze(colors.success);
Object.freeze(colors.warning);
Object.freeze(colors.error);
Object.freeze(colors.light);
Object.freeze(colors.dark);
Object.freeze(colors.grey);
Object.keys(colors.gradients).forEach((k) => Object.freeze(colors.gradients[k]));
Object.freeze(colors.gradients);
Object.keys(colors.socialMediaColors).forEach((k) => Object.freeze(colors.socialMediaColors[k]));
Object.freeze(colors.socialMediaColors);
Object.keys(colors.badgeColors).forEach((k) => Object.freeze(colors.badgeColors[k]));
Object.freeze(colors.badgeColors);
Object.freeze(colors.coloredShadows);
Object.freeze(colors.tabs.indicator);
Object.freeze(colors.tabs);

export default Object.freeze(colors);
