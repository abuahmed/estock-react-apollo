// import { createMuiTheme } from '@mui/material/styles'
// import { blueGrey, lightGreen } from '@mui/material/colors'
// import { Palette } from '@mui/material/styles/createPalette'
// export default theme
import { createTheme, Theme } from "@mui/material/styles";

import customTheme from "./custom";
import defaultTheme from "./default";

// declare module "@mui/styles" {
//   interface DefaultTheme extends Theme {}
// }

const overrides = {
  typography: {
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.64rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.285rem",
    },
    h6: {
      fontSize: "1.142rem",
    },
  },
};

const themes = {
  default: createTheme({ ...defaultTheme, ...overrides }) as Theme,
  custom: createTheme({ ...customTheme, ...overrides }) as Theme,
  // { ...customTheme, ...overrides }),
};

export default themes;
