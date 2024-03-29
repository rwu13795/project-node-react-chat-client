import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // type: 'light',
    primary: { main: "#00586e" },
    secondary: { main: "#00ccff", contrastText: "#00586e" },
    warning: { main: "#fc9403" },
    error: { main: "#f44336" },
    info: { main: "#008a00", contrastText: "#ffffff" },
  },
  typography: {
    fontFamily: ["Quantico", "sans-serif"].join(","),
    // body1 controls all default MUI component's text font-size
    body1: {
      fontSize: "1.8rem",
    },
    h3: {
      fontSize: "3vw",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 560,
      md: 765,
      lg: 1080,
      xl: 1350,
    },
  },
});

export { theme };
