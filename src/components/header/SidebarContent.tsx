import React, { ReactNode, useEffect } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { Avatar, Box, Divider, List, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";

import NavItem from "../NavItem";
import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as UserIcon,
  People as UsersIcon,
  List as ListIcon,
  ShoppingCartOutlined,
  ShoppingBagOutlined,
  DescriptionOutlined,
  BusinessOutlined,
  PeopleOutline,
  CompareArrowsOutlined,
  CreditCardOutlined,
  CorporateFareSharp,
} from "@mui/icons-material";
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
import { logout } from "../../features/auth/authReducers";

import { RoleTypes } from "../../features/auth/types/roleTypes";

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

const getNavBarItems = (userRoles: string[]) => {
  interface Props {
    href: string;
    title: string;
    icon: ReactNode;
    click?: string | undefined;
  }
  let menuItems = [
    {
      href: "/app/dashboard",
      icon: <BarChartIcon />,
      title: RoleTypes.ViewDashboard,
    },
    {
      href: "/app/onHand",
      icon: <ListIcon />,
      title: RoleTypes.OnHandInventory,
    },
    {
      href: "/app/sale",
      icon: <ShoppingCartOutlined />,
      title: RoleTypes.ViewSale,
    },
    {
      href: "/app/purchase",
      icon: <ShoppingBagOutlined />,
      title: RoleTypes.ViewPurchase,
    },
    {
      href: "/app/transfer",
      icon: <CompareArrowsOutlined />,
      title: RoleTypes.ViewTransfer,
    },
    {
      href: "/app/pi",
      icon: <CreditCardOutlined />,
      title: RoleTypes.ViewPI,
    },
    {
      href: "/app/items",
      icon: <DescriptionOutlined />,
      title: RoleTypes.ViewItems,
    },
    {
      href: "/app/customers",
      icon: <PeopleOutline />,
      title: RoleTypes.ViewCustomers,
    },
    {
      href: "/app/vendors",
      icon: <BusinessOutlined />,
      title: RoleTypes.ViewVendors,
    },
    {
      href: "/app/users",
      icon: <UsersIcon />,
      title: RoleTypes.ViewUsers,
      click: "",
    },
    // {
    //   href: "/app/warehouses",
    //   icon: <UsersIcon />,
    //   title: RoleTypes.ViewWarehouses,
    //   click: "",
    // },
    // {
    //   href: "/app/organizations",
    //   icon: <UsersIcon />,
    //   title: RoleTypes.ViewOrganizations,
    //   click: "",
    // },
    {
      href: "/app/clients",
      icon: <CorporateFareSharp />,
      title: RoleTypes.ViewClients,
      click: "",
    },
  ];

  let privilegedMenuItems: Props[] = [];

  menuItems.forEach((item) => {
    if (
      userRoles.some((userRole) => userRole === item.title) ||
      userRoles.some(
        (userRole) => userRole === item.title.replace("View", "Add")
      ) ||
      userRoles.some(
        (userRole) => userRole === item.title.replace("View", "Manage")
      )
    ) {
      privilegedMenuItems.push(item);
    }
  });

  privilegedMenuItems = privilegedMenuItems.concat([
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
  return privilegedMenuItems;

  // {
  //     href: "/app/settings",
  //     icon: <SettingsIcon />,
  //     title: "Settings",
  //   },
};

export default SidebarContent;
