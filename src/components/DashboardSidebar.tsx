import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";

import SidebarContent from "./header/SidebarContent";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectSetting, toggleThis } from "../features/settings/settingsSlice";
import { SwipeableDrawer } from "@mui/material";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  //justifyContent: 'flex-end',
  //padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  //...theme.mixins.toolbar,
  justifyContent: "space-between",
  backgroundColor: theme.palette.primary.main,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const DashboardSidebar = () => {
  const dispatch = useAppDispatch();

  const { isMobileDrawerOpen, isDrawerOpen } = useAppSelector(selectSetting);

  const handleDrawerToggle = () => {
    dispatch(toggleThis({ type: "Mobile", newValue: !isMobileDrawerOpen }));
  };

  return (
    <Box>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        variant="temporary"
        onClose={handleDrawerToggle}
        open={!!isMobileDrawerOpen}
        onOpen={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <SidebarContent />
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        open={!!isDrawerOpen}
      >
        <>
          <SidebarContent />
        </>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;
