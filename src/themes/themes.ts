// import { createMuiTheme } from '@material-ui/core/styles'
// import { blueGrey, lightGreen } from '@material-ui/core/colors'
// import { Palette } from '@material-ui/core/styles/createPalette'
// export default theme
import { createTheme } from "@material-ui/core/styles";
import customTheme from "./custom";
import defaultTheme from "./default";

const overrides = {
  typography: {
    fontFamily: "cursive",
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
  default: createTheme({ ...defaultTheme, ...overrides }),
  custom: createTheme({ ...customTheme, ...overrides }),
  // { ...customTheme, ...overrides }),
};

export default themes;
