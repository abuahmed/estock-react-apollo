import {
  experimentalStyled,
  Grid,
  GridProps,
  Paper,
  PaperProps,
} from "@material-ui/core";

export const GridContainer = experimentalStyled(Grid)<GridProps>(
  ({ theme }) => ({
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    position: "absolute",
    top: 0,
    left: 0,
  })
);
export const LogoType = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
export const LogoTypeText = experimentalStyled("div")(({ theme }) => ({}));
export const LogoTypeIcon = experimentalStyled("div")(({ theme }) => ({
  width: 70,
  marginRight: theme.spacing(2),
}));
export const PaperRoot = experimentalStyled(Paper)<PaperProps>(({ theme }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    maxWidth: 404,
  },
}));
export const TextRow = experimentalStyled("div")(({ theme }) => ({
  marginBottom: theme.spacing(10),
  textAlign: "center",
}));
export const ErrorCode = experimentalStyled("div")(({ theme }) => ({
  fontSize: 148,
  fontWeight: 600,
}));
export const SafetyText = experimentalStyled("div")(({ theme }) => ({
  fontWeight: 300,
  color: theme.palette.text.primary,
}));
export const BackButton = experimentalStyled("div")(({ theme }) => ({
  textTransform: "none",
  fontSize: 22,
}));
