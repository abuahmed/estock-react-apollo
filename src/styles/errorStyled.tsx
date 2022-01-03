import { Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const GridContainer = styled(Grid)(({ theme }) => ({
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
}));
export const LogoType = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export const LogoTypeText = styled("div")(({ theme }) => ({}));
export const LogoTypeIcon = styled("div")(({ theme }) => ({
  width: 70,
  marginRight: theme.spacing(2),
}));
export const PaperRoot = styled(Paper)(({ theme }) => ({
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
export const TextRow = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(10),
  textAlign: "center",
}));
export const ErrorCode = styled("div")(({ theme }) => ({
  fontSize: 148,
  fontWeight: 600,
}));
export const SafetyText = styled("div")(({ theme }) => ({
  fontWeight: 300,
  color: theme.palette.text.primary,
}));
export const BackButton = styled("div")(({ theme }) => ({
  textTransform: "none",
  fontSize: 22,
}));
