import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as UserIcon,
  People as UsersIcon,
  List as ListIcon,
  Description,
  PeopleOutline,
  CompareArrows,
  CorporateFareSharp,
  CorporateFareTwoTone,
  PointOfSale,
  History,
  ShoppingBag,
  Calculate,
} from "@mui/icons-material";

import { RoleTypes } from "../../features/auth/types/roleTypes";
import { NavItemChildProps, NavItemProps } from "./types";

export const SideBarItems = (userRoles: string[]) => {
  let menuItems: NavItemProps[] = [
    {
      href: "/app/dashboard",
      icon: <BarChartIcon />,
      title: RoleTypes.ViewDashboard,
      role: RoleTypes.ViewDashboard,
    },
    {
      href: "",
      icon: <ListIcon />,
      title: "Inventory",
      role: "Inventory",
      children: [
        {
          href: "/app/onHand",
          icon: <ListIcon />,
          title: "OnHand",
          role: RoleTypes.OnHandInventory,
        },
        {
          href: "/app/inventoryHistory",
          icon: <History />,
          title: "History",
          role: RoleTypes.InventoryHistory,
        },
        {
          href: "/app/pi",
          icon: <Calculate />,
          title: "List PI",
          role: RoleTypes.ViewPI,
        },
        {
          href: "/app/pi/0",
          icon: <Calculate />,
          title: "Add New PI",
          role: RoleTypes.AddPI,
        },
      ],
    },

    {
      href: "",
      icon: <PointOfSale />,
      title: "Sales",
      role: "Sales",
      children: [
        {
          href: "/app/sale",
          icon: <PointOfSale />,
          title: "List",
          role: RoleTypes.ViewSale,
        },
        {
          href: "/app/sale/0",
          icon: <PointOfSale />,
          title: "Add New",
          role: RoleTypes.AddSale,
        },
        {
          href: "/app/salesPayments",
          icon: <ListIcon />,
          title: "Payments",
          role: RoleTypes.SalesPayments,
        },
      ],
    },
    {
      href: "",
      icon: <ShoppingBag />,
      title: "Purchases",
      role: "Purchases",
      children: [
        {
          href: "/app/purchase",
          icon: <PointOfSale />,
          title: "List",
          role: RoleTypes.ViewPurchase,
        },
        {
          href: "/app/purchase/0",
          icon: <PointOfSale />,
          title: "Add New",
          role: RoleTypes.AddPurchase,
        },
        {
          href: "/app/purchasePayments",
          icon: <ListIcon />,
          title: "Payments",
          role: RoleTypes.PurchasePayments,
        },
      ],
    },
    {
      href: "",
      icon: <CompareArrows />,
      title: "Transfers",
      role: "Transfers",
      children: [
        {
          href: "/app/transfer",
          icon: <CompareArrows />,
          title: "List",
          role: RoleTypes.ViewTransfer,
        },
        {
          href: "/app/transfer/0",
          icon: <CompareArrows />,
          title: "Add New",
          role: RoleTypes.AddTransfer,
        },
      ],
    },

    {
      href: "",
      icon: <Description />,
      title: "Files",
      role: "Files",
      children: [
        {
          href: "/app/items",
          icon: <Description />,
          title: RoleTypes.ViewItems,
          role: RoleTypes.ViewItems,
        },
        {
          href: "/app/customers",
          icon: <PeopleOutline />,
          title: RoleTypes.ViewCustomers,
          role: RoleTypes.ViewCustomers,
        },
        {
          href: "/app/vendors",
          icon: <PeopleOutline />,
          title: RoleTypes.ViewVendors,
          role: RoleTypes.ViewVendors,
        },
        {
          href: "/app/fa",
          icon: <CorporateFareTwoTone />,
          title: RoleTypes.ViewFinancialAccounts,
          role: RoleTypes.ViewFinancialAccounts,
        },
      ],
    },

    {
      href: "",
      icon: <UsersIcon />,
      title: "Admin",
      role: "Admin",
      children: [
        {
          href: "/app/users",
          icon: <UsersIcon />,
          title: RoleTypes.ViewUsers,
          role: RoleTypes.ViewUsers,
          clickedText: "",
        },
        // {
        //   href: "/app/warehouses",
        //   icon: <UsersIcon />,
        //   title: RoleTypes.ViewWarehouses,
        //   role: RoleTypes.ViewWarehouses,
        //   clickedText: "",
        // },
        // {
        //   href: "/app/organizations",
        //   icon: <UsersIcon />,
        //   title: RoleTypes.ViewOrganizations,
        //   role: RoleTypes.ViewOrganizations,
        //   clickedText: "",
        // },
        {
          href: "/app/clients",
          icon: <CorporateFareSharp />,
          title: RoleTypes.ViewClients,
          role: RoleTypes.ViewClients,
          clickedText: "",
        },
      ],
    },
  ];

  const checkUserPrivilege = (item: NavItemProps) => {
    if (
      userRoles.some((userRole) => userRole === item.role) ||
      userRoles.some(
        (userRole) => userRole === item.role.replace("View", "Add")
      ) ||
      userRoles.some(
        (userRole) => userRole === item.role.replace("View", "Manage")
      )
    )
      return true;
    return false;
  };
  let privilegedMenuItems: NavItemProps[] = [];

  menuItems.forEach((menuItem) => {
    if (menuItem.children) {
      let nestedItem: NavItemChildProps[] = [];
      menuItem.children.forEach((child) => {
        if (checkUserPrivilege(child)) nestedItem.push(child);
      });
      if (nestedItem.length > 0) {
        privilegedMenuItems.push({
          ...menuItem,
          children: nestedItem as NavItemChildProps[],
        });
      }
    } else {
      if (checkUserPrivilege(menuItem)) privilegedMenuItems.push(menuItem);
    }
  });

  privilegedMenuItems = privilegedMenuItems.concat([
    {
      href: "",
      icon: <UserIcon />,
      title: "My Account",
      role: "My Account",
      children: [
        {
          href: "/app/profile",
          icon: <UserIcon />,
          title: "My Profile",
        },
        {
          href: "",
          icon: <LockIcon />,
          title: "Change Password",
          clickedText: "changePassword",
        },
        {
          href: "",
          icon: <ExitToAppIcon />,
          title: "Logout",
          clickedText: "logout",
        },
      ] as NavItemChildProps[],
    },
  ]);
  return privilegedMenuItems;

  // {
  //     href: "/app/settings",
  //     icon: <SettingsIcon />,
  //     title: "Settings",
  //   },
};
