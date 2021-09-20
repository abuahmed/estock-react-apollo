import React, { ReactNode, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Divider, List, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

import NavItem from "../NavItem";
import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as UserIcon,
  People as UsersIcon,
  List as ListIcon,
  Inventory2Outlined,
  ShoppingCartOutlined,
  ShoppingBagOutlined,
  DescriptionOutlined,
  BusinessOutlined,
  PeopleOutline,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import {
  selectSetting,
  toggleThis,
} from "../../features/settings/settingsSlice";
import { DrawerHeader } from "../DashboardSidebar";
import CustomDialog from "../modals/CustomDialog";
import ChangePassword from "../account/ChangePassword";
import { logout } from "../../features/auth/authReducers";

const SidebarContent = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = React.useState<string[]>([]);

  const theme = useTheme();
  const { user } = useAppSelector(selectAuth);
  const { isDrawerOpen, isMobileDrawerOpen, isMiniMode } =
    useAppSelector(selectSetting);
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
    setRoles(user?.roles.map((r) => r.displayName) as string[]);
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
          {getNavBarItems(roles).map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              onClick={
                !item.href
                  ? item.click === "changePassword"
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
      {/* {!isMiniMode && (
        <Box
          sx={{
            backgroundColor: 'background.default',
            m: 2,
            p: 2,
          }}
        >
          <Typography align="center" gutterBottom variant="h4">
            Need more?
          </Typography>
          <Typography align="center" variant="body2" noWrap>
            Upgrade to PRO version and access 20 more screens
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 2,
            }}
          >
            <Button
              color="primary"
              component="a"
              href="https://react-material-kit.devias.io"
              variant="contained"
            >
              See PRO version
            </Button>
          </Box>
        </Box>
      )} */}

      <CustomDialog isOpen={open} handleDialogClose={dialogClose}>
        <ChangePassword />
      </CustomDialog>
    </Box>
  );
};

const getNavBarItems = (roles: string[]) => {
  interface Props {
    href: string;
    title: string;
    icon: ReactNode;
    click?: string | undefined;
  }
  let items = [
    {
      href: "/app/dashboard",
      icon: <BarChartIcon />,
      title: "View Dashboard",
    },
    {
      href: "/app/onHand",
      icon: <ListIcon />,
      title: "OnHand Inventory",
    },
    {
      href: "/app/sale",
      icon: <ShoppingCartOutlined />,
      title: "Sales",
    },
    {
      href: "/app/purchase",
      icon: <ShoppingBagOutlined />,
      title: "Purchase",
    },
    {
      href: "/app/pi",
      icon: <Inventory2Outlined />,
      title: "Physical Inventory",
    },
    {
      href: "/app/items",
      icon: <DescriptionOutlined />,
      title: "Items",
    },
    {
      href: "/app/customers",
      icon: <PeopleOutline />,
      title: "Customers",
    },
    {
      href: "/app/vendors",
      icon: <BusinessOutlined />,
      title: "Vendors",
    },
    {
      href: "/app/users",
      icon: <UsersIcon />,
      title: "Users",
      click: "",
    },
  ];

  let privilegedItems: Props[] = [];

  items.forEach((item) => {
    for (let index = 0; index < roles.length; index++) {
      const rl = roles[index];
      if (rl.includes(item.title)) {
        privilegedItems.push(item);
        break;
      }
    }
  });

  privilegedItems = privilegedItems.concat([
    {
      href: "/app/profile",
      icon: <UserIcon />,
      title: "My Account",
    },

    {
      href: "",
      icon: <LockIcon />,
      title: "Change Password",
      click: "changePassword",
    },
    {
      href: "",
      icon: <ExitToAppIcon />,
      title: "Logout",
      click: "logout",
    },
  ]);
  return privilegedItems;

  // {
  //     href: "/app/settings",
  //     icon: <SettingsIcon />,
  //     title: "Settings",
  //   },
};

export default SidebarContent;
