import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "green",
  fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol"`,
  defaultGradient: {
    from: "orange",
    to: "red",
    deg: 45,
  },
  components: {
    Input: {
      defaultProps: {
        size: "md",
      },
    },
    Button: {
      defaultProps: {
        fw: 400,
        size: "md",
      },
    },
  },
});
