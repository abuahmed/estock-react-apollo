import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import themes from "./themes/themes";
import { useAppSelector } from "./app/hooks";
import routes from "./components/routes";
import { selectAuth } from "./features/auth/authSlice";

function App() {
  const { user } = useAppSelector(selectAuth);

  const isLoggedIn = user ? true : false;
  const routing = useRoutes(routes(isLoggedIn));
  return <ThemeProvider theme={themes.custom}>{routing}</ThemeProvider>;
}

export default App;
