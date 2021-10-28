import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import themes from "./themes/themes";
import { useAppSelector } from "./app/hooks";
import routes from "./components/routes";
import { selectAuth } from "./features/auth/authSlice";

function App() {
  const { user } = useAppSelector(selectAuth);

  const isLoggedIn = user && user.email ? true : false;
  const roles = user?.roles ? user?.roles : [];
  const routing = useRoutes(routes(isLoggedIn, roles));
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes.custom}>{routing}</ThemeProvider>;
    </StyledEngineProvider>
  );
}

export default App;
