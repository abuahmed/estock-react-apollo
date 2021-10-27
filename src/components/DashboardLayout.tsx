import { Outlet } from "react-router-dom";

import { styled, Theme } from "@mui/material/styles";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import Footer from "./footer/Footer";
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
import { useAppSelector } from "../app/hooks";

import { selectAuth } from "../features/auth/authSlice";
import Toast from "./Layout/Toast";
import Box from "@mui/material/Box";
const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100vh",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  //paddingTop: 64,
  // [theme.breakpoints.up('lg')]: {
  //   paddingLeft: 256,
  // },
}));

const DashboardLayoutContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  overflow: "auto",
  paddingTop: 64,
});

const DashboardLayoutContent = styled("div")(({ theme }) => ({
  flex: "1 1 auto",
  overflow: "auto",
  padding: theme.spacing(4),
  flexGrow: 1,
  p: 3,
}));

const DashboardLayout = () => {
  const { success } = useAppSelector(selectAuth);
  return (
    <DashboardLayoutRoot>
      <DashboardNavbar />
      <DashboardSidebar />

      <Box>
        {success && <Toast severity="success">{success!.message}</Toast>}
      </Box>

      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
          <Box sx={{ flexGrow: 1 }} />

          <Footer />
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
