import tinycolor from "tinycolor2";
import { grey } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";

const primary = "#008000";
const secondary = "#ff6d00";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";

//const lightenRate = 7.5;
const darkenRate = 15;

export const lightTheme = {
  palette: {
    mode: "light" as PaletteMode,
    primary: { main: primary },
    secondary: { main: secondary },
    warning: { main: warning },
    success: { main: success },
    info: { main: info },
    text: {
      primary: "#4A4A4A",
      secondary: "#6E6E6E",
    },
  },
};

export const darkTheme = {
  palette: {
    mode: "dark" as PaletteMode,
    primary: { main: tinycolor(info).darken(darkenRate).toHexString() },
    secondary: { main: tinycolor(warning).darken(darkenRate).toHexString() },
    warning: { main: tinycolor(warning).darken(darkenRate).toHexString() },
    success: { main: tinycolor(success).darken(darkenRate).toHexString() },
    info: { main: tinycolor(info).darken(darkenRate).toHexString() },
    background: {
      default: "#121212",
      paper: "#121212",
    },
    text: {
      primary: "#fff",
      secondary: grey[500],
    },
  },
};
// export const customTheme = {
//   palette: {
//     primary: {
//       light: "#b7deb8",
//       main: "#008000",
//       dark: "#739574",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#ff8a33",
//       main: "#ff6d00",
//       dark: "#b24c00",
//       contrastText: "#000",
//     },
//     text: {
//       primary: "#4A4A4A",
//       secondary: "#6E6E6E",
//       hint: "#5D5D5D",
//     },
//     background: {
//       default: "#F6F7FF",
//       light: "#F3F5FF",
//     },

//   },

// };

// export default customTheme;
