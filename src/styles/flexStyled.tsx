import { styled } from "@mui/material/styles";

export const FlexColumnCenter = styled("div")(({}) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));
export const FlexStyle = styled("div")(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
    alignItems: "start",
  },
}));
