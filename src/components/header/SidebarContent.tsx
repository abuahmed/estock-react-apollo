import React, { useEffect } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { Avatar, Box, Divider, List, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";

import NavItem from "./NavItem";

import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import {
  selectPreference,
  toggleThis,
} from "../../features/preferences/preferencesSlice";
import { DrawerHeader } from "../DashboardSidebar";
import CustomDialog from "../modals/CustomDialog";
import ChangePassword from "../account/ChangePassword";
import { logout } from "../../features/auth/authSlice";
import { SideBarItems } from "./SideBarItems";

const SidebarContent = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = React.useState<string[]>([]);

  const theme = useTheme();
  const { user } = useAppSelector(selectAuth);
  const { isDrawerOpen, isMobileDrawerOpen, isMiniMode } =
    useAppSelector(selectPreference);
  const handleDrawerToggle = () => {
    dispatch(toggleThis({ type: "Mobile", newValue: false }));
  };
  const handleDrawerClose = () => {
    dispatch(toggleThis({ type: "Drawer", newValue: false }));
    dispatch(toggleThis({ type: "Mobile", newValue: false }));
    dispatch(toggleThis({ type: "Mini", newValue: true }));
  };
  const changePasswordHandler = () => {
    setOpen(true);
  };
  const dialogClose = () => {
    setOpen(false);
  };
  const signOut = () => {
    dispatch(logout());
  };
  const voidFunction = () => {};
  useEffect(() => {
    setRoles(user?.roles?.map((r) => r.displayName) as string[]);
  }, [user?.roles]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <DrawerHeader>
        {isDrawerOpen || isMobileDrawerOpen ? (
          <Box
            sx={{
              width: "100%",
              p: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Avatar
                component={RouterLink}
                alt="avatar"
                src={user ? user.avatar : ""}
                sx={{
                  cursor: "pointer",
                  width: 64,
                  height: 64,
                }}
                to="/app/profile"
              />
              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                style={{ color: "white" }}
                onClick={handleDrawerClose}
                size="large"
              >
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                marginTop: 18,
                marginBottom: 8,
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  fontWeight: 500,
                }}
              >
                {user && user.name}
              </Typography>
              <Typography variant="h6">{user && user.email}</Typography>
            </div>
          </Box>
        ) : (
          <>
            {isMiniMode && (
              <Box sx={{ pt: 9, pb: 1 }}>
                <Avatar
                  component={RouterLink}
                  alt="avatar"
                  src={user ? user.avatar : ""}
                  sx={{
                    cursor: "pointer",
                    width: 64,
                    height: 64,
                  }}
                  to="/app/profile"
                />
              </Box>
            )}
          </>
        )}
      </DrawerHeader>

      <Divider />
      <Box sx={{ px: 1, py: 0 }}>
        <List onClick={handleDrawerToggle}>
          {SideBarItems(roles).map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              role={item.role}
              icon={item.icon}
              children={item.children}
              click={
                !item.href
                  ? item.clickedText === "changePassword"
                    ? changePasswordHandler
                    : signOut
                  : voidFunction
              }
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          m: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Link
            color={"primary"}
            href={"https://pinnasofts.com/"}
            target={"_blank"}
          >
            Home
          </Link>
          <Link
            color={"primary"}
            href={"https://pinnasofts.com/about"}
            target={"_blank"}
          >
            About Us
          </Link>
          <Link
            color={"primary"}
            href={"https://pinnasofts.com/blog"}
            target={"_blank"}
          >
            Blog
          </Link>
        </Box>
        <Typography>Copyright &copy; 2021</Typography>
      </Box>

      <CustomDialog
        title="Change Password"
        isOpen={open}
        handleDialogClose={dialogClose}
      >
        <ChangePassword />
      </CustomDialog>
    </Box>
  );
};

export default SidebarContent;
