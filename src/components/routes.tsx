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
