import { styled } from "@mui/material/styles";

import { ListItemButton, ListItemButtonProps } from "@mui/material";
import { ListItemIcon, ListItemIconProps } from "@mui/material";
import { ListItemText, ListItemTextProps } from "@mui/material";

interface InputListItemButtonProps extends ListItemButtonProps {
  active?: boolean;
}

interface InputListItemIconProps extends ListItemIconProps {
  active?: boolean;
}

interface InputListItemTextProps extends ListItemTextProps {
  active?: boolean;
}
interface DotProps {
  active?: boolean;
}

export const StyledListItemButton = styled(
  ListItemButton
)<InputListItemButtonProps>(({ theme, active }) => ({
  textDecoration: "none",
  "&:hover, &:focus": {
    backgroundColor: theme.palette.background.default,
  },
  // "& svg": {
  //   marginRight: 1,
  // },
  ...(active && {
    color: theme.palette.primary.main,
  }),
  color: theme.palette.text.secondary,
}));

export const StyledListItemIcon = styled(ListItemIcon)<InputListItemIconProps>(
  ({ theme, active }) => ({
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    "&:hover, &:focus": {
      color: theme.palette.primary.main,
    },
    ...(active && {
      color: theme.palette.primary.main,
    }),
    transition: theme.transitions.create("color"),
    minWidth: 64,
    display: "flex",
    justifyContent: "center",
  })
);

export const StyledListItemText = styled(ListItemText)<InputListItemTextProps>(
  ({ theme, active }) => ({
    padding: 0,
    color: theme.palette.text.secondary,
    "&:hover, &:focus": {
      color: theme.palette.primary.main,
    },
    ...(active && {
      color: theme.palette.text.primary,
    }),
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 16,
  })
);

export const Dot = styled("div")<DotProps>(({ theme, active }) => ({
  width: 11,
  height: 11,
  backgroundColor: theme.palette.text.secondary,
  borderRadius: "50%",
  transition: theme.transitions.create("background-color"),
  "&:hover, &:focus": {
    backgroundColor: theme.palette.primary.main,
  },
  ...(active && {
    backgroundColor: theme.palette.primary.main,
  }),
}));
