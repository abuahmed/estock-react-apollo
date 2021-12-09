import React from "react";

import { matchPath, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Collapse, List, Tooltip } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Dot,
  StyledListItemButton,
  StyledListItemIcon,
  StyledListItemText,
} from "../../styles/listStyled";
import { NavItemProps } from "./types";

const voidFunction = () => {};

const NavItem = ({
  href,
  icon,
  title,
  children,
  nested,
  click,
  ...rest
}: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const active = href
    ? !!matchPath(
        {
          path: href,
        },
        location.pathname
      )
    : false;

  // const active =
  //   href &&
  //   (location.pathname === href || location.pathname.indexOf(href) !== -1);

  const handleClick = () => {
    setOpen(!open);
  };

  const redirectRoute = (route: string) => {
    navigate(route);
  };

  if (!children)
    return (
      <Tooltip title={title}>
        <StyledListItemButton
          sx={{
            ...(active && {
              color: "primary.main",
            }),
          }}
          onClick={!href ? click : () => redirectRoute(href)}
          {...rest}
          disableGutters
        >
          <StyledListItemIcon
            sx={{
              ...(active && {
                color: "primary.main",
              }),
            }}
          >
            {nested ? (
              <Dot
                sx={{
                  ...(active && {
                    backgroundColor: "primary.main",
                  }),
                }}
              />
            ) : (
              icon
            )}
          </StyledListItemIcon>
          <StyledListItemText
            sx={{
              ...(active && {
                color: "text.primary",
              }),
            }}
            primary={title
              .replace("View", "")
              .replace("Manage", "")
              .replace("Entry", "")}
          />
        </StyledListItemButton>
      </Tooltip>
    );

  return (
    <Tooltip title={title}>
      <>
        <StyledListItemButton disableGutters onClick={handleClick}>
          <StyledListItemIcon
            sx={{
              ...(active && {
                color: "primary.main",
              }),
            }}
          >
            {icon}
          </StyledListItemIcon>
          <StyledListItemText
            primary={title}
            sx={{
              ...(active && {
                color: "text.primary",
              }),
            }}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItemButton>
        {children && (
          <Collapse in={open} timeout="auto" unmountOnExit sx={{ pl: 1 }}>
            <List component="div" disablePadding>
              {children.map((item) => (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  role={item.role}
                  icon={item.icon}
                  click={voidFunction}
                  nested
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    </Tooltip>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
