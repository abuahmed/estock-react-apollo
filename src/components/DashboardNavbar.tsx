import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Toolbar, useMediaQuery } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { experimentalStyled as styled, Theme } from "@material-ui/core/styles";

import MuiAppBar, {
  AppBarProps as MuiAppBarProps,
} from "@material-ui/core/AppBar";

import Logo from "./Logo";
import { selectSetting, toggleThis } from "../features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import NavbarContent from "./header/NavbarContent";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarCustom = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up("sm")]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const DashboardNavbar = () => {
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  const { isDrawerOpen } = useAppSelector(selectSetting);

  useEffect(() => {
    if (isDesktop) {
      dispatch(toggleThis({ type: "Drawer", newValue: true }));
      dispatch(toggleThis({ type: "Mini", newValue: false }));
    }
  }, [dispatch, isDesktop]);

  const handleDrawerOpen = () => {
    if (isDesktop) {
      dispatch(toggleThis({ type: "Drawer", newValue: true }));
      dispatch(toggleThis({ type: "Mini", newValue: false }));
    } else {
      dispatch(toggleThis({ type: "Mobile", newValue: true }));
    }
  };
  return (
    <>
      <AppBarCustom position="fixed" open={isDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "0px",
              ...(isDrawerOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <RouterLink
            to="/"
            style={{
              marginRight: "24px",
            }}
          >
            <Logo />{" "}
          </RouterLink>
          <NavbarContent />
        </Toolbar>
      </AppBarCustom>
    </>
  );
};

export default DashboardNavbar;
