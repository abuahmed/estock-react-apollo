import { experimentalStyled } from "@material-ui/core";

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",

  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const MainLayoutWrapper = experimentalStyled("div")({
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
});

const GradientBackground = experimentalStyled("div")(({ theme }) => ({
  background: theme.palette.background.default,
}));

const NormalBackground = experimentalStyled("div")(({ theme }) => ({
  background: theme.palette.background.paper,
}));

const ShadowStyled = experimentalStyled("div")(({ theme }) => ({
  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
  [theme.breakpoints.up("sm")]: {
    boxShadow: "0 .125rem .25rem rgba($black, .075)",
  },
  [theme.breakpoints.up("lg")]: {
    boxShadow: "0 1rem 3rem rgba($black, .175)",
  },
}));

export {
  GradientBackground,
  NormalBackground,
  MainLayoutRoot,
  MainLayoutWrapper,
  ShadowStyled,
};
