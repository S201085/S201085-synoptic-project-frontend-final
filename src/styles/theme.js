import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    primary: {
      main: "#3cb066",
      contrastText: "#fff",
    },
    secondary: {
      main: "#734769",
      contrastText: "#fff",
    },
    accent: {
      main: "#1d211e",
    },
    black: {
      main: "#000",
      contrastText: "#fff",
    },
    white: {
      main: "#fff",
      contrastText: "#3cb066",
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
});
