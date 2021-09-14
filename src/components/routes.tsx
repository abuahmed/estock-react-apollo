import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  Forgot,
  Profile,
  Reset,
  SignIn,
  SignUp,
  Verify,
} from "../features/auth";
import Dashboard from "../features/dashboard/Dashboard";
import Error from "../features/error/Error";
import LandingPage from "../features/home/LandingPage";
import { ItemEntry } from "../features/items/ItemEntry";
import { Items } from "../features/items/Items";
import { Headers } from "../features/transactions/Headers";
import { TransactionEntry } from "../features/transactions/TransactionEntry";
import { TransactionType } from "../features/transactions/types/transactionTypes";
import { Users } from "../features/users";
import { User } from "../features/users/User";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";

const routes = (isLoggedIn: Boolean) => [
  {
    path: "app/*",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "onHand", element: <Dashboard /> },
      { path: "sale", element: <Headers type={TransactionType.Sale} /> },
      {
        path: "sale/:id",
        element: <TransactionEntry type={TransactionType.Sale} />,
      },
      {
        path: "purchase",
        element: <Headers type={TransactionType.Purchase} />,
      },
      {
        path: "purchase/:id",
        element: <TransactionEntry type={TransactionType.Purchase} />,
      },
      { path: "pi", element: <Headers type={TransactionType.PI} /> },
      {
        path: "pi/:id",
        element: <TransactionEntry type={TransactionType.PI} />,
      },
      { path: "items", element: <Items /> },
      { path: "item/:id", element: <ItemEntry /> },
      { path: "customers", element: <Dashboard /> },
      { path: "vendors", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "users", element: <Users /> },
      { path: "user/:id", element: <User /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
      {
        path: "member",
        element: <Outlet />,
        children: [
          { path: "/", element: <Profile /> },
          { path: "/add", element: <Profile /> },
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
        path: "email/verify/:id/:token/:expires/:signature",
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

export default routes;
