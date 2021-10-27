import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  Forgot,
  Profile,
  Reset,
  SignIn,
  SignUp,
  Verify,
} from "../features/auth";
import { Role } from "../features/auth/types/authType";
import { RoleTypes } from "../features/auth/types/roleTypes";
import Dashboard from "../features/dashboard/Dashboard";
import Error from "../features/error/Error";
import LandingPage from "../features/home/LandingPage";
import { BusinessPartnerEntry } from "../features/setups/BusinessPartnerEntry";
import { BusinessPartners } from "../features/setups/BusinessPartners";
import { Clients } from "../features/setups/Clients";
import { ItemEntry } from "../features/setups/ItemEntry";
import { Items } from "../features/setups/Items";
import { Organizations } from "../features/setups/Organizations";
import { BusinessPartnerType } from "../features/setups/types/bpTypes";
import { Warehouses } from "../features/setups/Warehouses";
import { Headers } from "../features/transactions/Headers";
import { Inventories } from "../features/transactions/Inventories";
import { TransactionEntry } from "../features/transactions/TransactionEntry";
import { TransactionType } from "../features/transactions/types/transactionTypes";
import { Users, User } from "../features/users";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";

let PrivilegedRoles: Role[] = [];
const routes = (isLoggedIn: Boolean, roles: Role[]) => {
  PrivilegedRoles = roles;
  return [
    {
      path: "app/*",
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: "dashboard",
          element: isPrivileged(<Dashboard />, RoleTypes.ViewDashboard),
        },
        {
          path: "onHand",
          element: isPrivileged(<Inventories />, RoleTypes.OnHandInventory),
        },
        {
          path: "sale",
          element: isPrivileged(
            <Headers type={TransactionType.Sale} />,
            RoleTypes.ViewSale
          ),
        },
        {
          path: "sale/:id",
          element: isPrivileged(
            <TransactionEntry type={TransactionType.Sale} />,
            RoleTypes.AddSale
          ),
        },
        {
          path: "purchase",
          element: isPrivileged(
            <Headers type={TransactionType.Purchase} />,
            RoleTypes.ViewPurchase
          ),
        },
        {
          path: "purchase/:id",
          element: isPrivileged(
            <TransactionEntry type={TransactionType.Purchase} />,
            RoleTypes.AddPurchase
          ),
        },
        {
          path: "pi",
          element: isPrivileged(
            <Headers type={TransactionType.PI} />,
            RoleTypes.ViewPI
          ),
        },
        {
          path: "pi/:id",
          element: isPrivileged(
            <TransactionEntry type={TransactionType.PI} />,
            RoleTypes.AddPI
          ),
        },
        {
          path: "transfer",
          element: isPrivileged(
            <Headers type={TransactionType.Transfer} />,
            RoleTypes.ViewTransfer
          ),
        },
        {
          path: "transfer/:id",
          element: isPrivileged(
            <TransactionEntry type={TransactionType.Transfer} />,
            RoleTypes.AddTransfer
          ),
        },
        {
          path: "items",
          element: isPrivileged(<Items />, RoleTypes.ViewItems),
        },
        {
          path: "item/:id",
          element: isPrivileged(<ItemEntry />, RoleTypes.ManageItems),
        },
        {
          path: "customers",
          element: isPrivileged(
            <BusinessPartners type={BusinessPartnerType.Customer} />,
            RoleTypes.ViewCustomers
          ),
        },
        {
          path: "customer/:id",
          element: isPrivileged(
            <BusinessPartnerEntry type={BusinessPartnerType.Customer} />,
            RoleTypes.ManageCustomers
          ),
        },
        {
          path: "vendors",
          element: isPrivileged(
            <BusinessPartners type={BusinessPartnerType.Vendor} />,
            RoleTypes.ViewVendors
          ),
        },
        {
          path: "vendor/:id",
          element: isPrivileged(
            <BusinessPartnerEntry type={BusinessPartnerType.Vendor} />,
            RoleTypes.ManageVendors
          ),
        },
        {
          path: "clients",
          element: isPrivileged(<Clients />, RoleTypes.ViewClients),
        },
        {
          path: "organizations/:clientId",
          element: isPrivileged(<Organizations />, RoleTypes.ViewOrganizations),
        },
        {
          path: "warehouses/:organizationId",
          element: isPrivileged(<Warehouses />, RoleTypes.ViewWarehouses),
        },
        { path: "profile", element: <Profile /> },
        { path: "users", element: <Users /> },
        { path: "user/:id", element: <User /> },
        { path: "", element: <Navigate to="/app/dashboard" /> },
        {
          path: "member",
          element: <Outlet />,
          children: [
            { path: "", element: <Profile /> },
            { path: "add", element: <Profile /> },
          ],
        },
      ],
    },
    {
      path: "/",
      element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
      children: [
        { path: "home", element: <LandingPage /> },
        { path: "login", element: <SignIn /> },
        { path: "register", element: <SignUp /> },
        {
          path: "verify/:id/:token/:expires/:signature",
          element: <Verify />,
        },
        { path: "forgotPassword", element: <Forgot /> },
        { path: "reset/:id/:token", element: <Reset /> },
        { path: "404", element: <Error /> },
        { path: "/", element: <Navigate to="/home" /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
  ];
};

function isPrivileged(element: ReactNode, privileged: string): ReactNode {
  if (
    PrivilegedRoles.some((r) => r.displayName === privileged) ||
    PrivilegedRoles.some(
      (r) => r.displayName === privileged.replace("Add", "View")
    ) ||
    PrivilegedRoles.some(
      (r) => r.displayName === privileged.replace("View", "Add")
    )
  ) {
    return element;
  }

  return <Navigate to="/app/profile" />;
}
export default routes;
//privileged.substr(0, 3) === "Add" &&
// else {
//     if (
//       PrivilegedRoles.some(
//         (r) => r.displayName === privileged.replace("Add", "View")
//       )
//     )
