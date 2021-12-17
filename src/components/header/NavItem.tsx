import React from "react";

import { matchPath, useLocation, useNavigate } from "react-router-dom";
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
import {
  selectPreference,
  toggleThis,
} from "../../features/preferences/preferencesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

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
  const dispatch = useAppDispatch();

  const [open, setOpen] = React.useState(false);
  const { isMiniMode } = useAppSelector(selectPreference);

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

  const handleDrawerToggle = () => {
    dispatch(toggleThis({ type: "Mobile", newValue: false }));
  };

  const redirectRoute = (route: string) => {
    handleDrawerToggle();
    navigate(route);
  };

  if (!children)
    return (
      <Tooltip title={title}>
        <StyledListItemButton
          active={active ? 1 : 0}
          onClick={!href ? click : () => redirectRoute(href)}
          {...rest}
          disableGutters
        >
          <StyledListItemIcon active={active ? 1 : 0}>
            {nested ? <Dot active={active ? 1 : 0} /> : icon}
          </StyledListItemIcon>
          <StyledListItemText
            active={active ? 1 : 0}
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
        <StyledListItemButton
          disableGutters
          onClick={handleClick}
          active={active ? 1 : 0}
        >
          <StyledListItemIcon active={active ? 1 : 0}>
            {icon}
          </StyledListItemIcon>
          <StyledListItemText primary={title} active={active ? 1 : 0} />
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

export default NavItem;
