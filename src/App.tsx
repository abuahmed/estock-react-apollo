import { useRoutes } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { useAppSelector } from "./app/hooks";
import routes from "./components/routes";
import { selectAuth } from "./features/auth/authSlice";
import { selectPreference } from "./features/preferences/preferencesSlice";

import themes from "./themes/themes";

function App() {
  const { user } = useAppSelector(selectAuth);
  const { mode } = useAppSelector(selectPreference);

  const isLoggedIn = user && user.email ? true : false;
  const roles = user?.roles ? user?.roles : [];
  const routing = useRoutes(routes(isLoggedIn, roles));

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mode === "dark" ? themes.dark : themes.light}>
        {routing}
      </ThemeProvider>
      ;
    </StyledEngineProvider>
  );
}

export default App;
