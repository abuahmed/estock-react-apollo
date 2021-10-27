import React, { ReactNode } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Button, ListItem } from "@mui/material";

interface Props {
  href: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}
const voidFunction = () => {};

const NavItem = ({ href, icon, title, onClick, ...rest }: Props) => {
  const location = useLocation();

  const active = href
    ? !!matchPath(
        {
          path: href,
        },
        location.pathname
      )
    : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        py: 0,
      }}
      onClick={!href ? onClick : voidFunction}
      {...rest}
    >
      <Button
        component={RouterLink}
        sx={{
          color: "text.secondary",
          fontWeight: "medium",
          justifyContent: "flex-start",
          letterSpacing: 0,
          py: 1.25,
          textTransform: "none",
          width: "100%",
          ...(active && {
            color: "primary.main",
          }),
          "& svg": {
            mr: 1,
          },
        }}
        to={href}
      >
        <ListItemIcon color="text.secondary">{icon}</ListItemIcon>
        <ListItemText
          primary={title
            .replace("View", "")
            .replace("Manage", "")
            .replace("Entry", "")}
        />
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
