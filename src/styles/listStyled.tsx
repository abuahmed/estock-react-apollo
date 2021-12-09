import { styled } from "@mui/material/styles";

import { ListItemButton, ListItemButtonProps } from "@mui/material";
import { ListItemIcon, ListItemIconProps } from "@mui/material";
import { ListItemText, ListItemTextProps } from "@mui/material";

export const StyledListItemButton = styled(ListItemButton)<ListItemButtonProps>(
  ({ theme }) => ({
    textDecoration: "none",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.default,
    },
    "& svg": {
      mr: 1,
    },
    color: theme.palette.text.secondary,
    justifyContent: "flex-start",
    letterSpacing: 0,
    py: 1.25,
    textTransform: "none",
    width: "100%",
  })
);
export const StyledListItemIcon = styled(ListItemIcon)<ListItemIconProps>(
  ({ theme }) => ({
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    "&:hover, &:focus": {
      color: theme.palette.primary.main,
    },
    transition: theme.transitions.create("color"),
    width: 24,
    display: "flex",
    justifyContent: "center",
  })
);

export const StyledListItemText = styled(ListItemText)<ListItemTextProps>(
  ({ theme }) => ({
    padding: 0,
    color: theme.palette.text.secondary,
    "&:hover, &:focus": {
      color: theme.palette.primary.main,
    },
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 16,
  })
);

export const Dot = styled("div")(({ theme }) => ({
  width: 11,
  height: 11,
  backgroundColor: theme.palette.text.secondary,
  borderRadius: "50%",
  transition: theme.transitions.create("background-color"),
  "&:hover, &:focus": {
    backgroundColor: theme.palette.primary.main,
  },
}));
