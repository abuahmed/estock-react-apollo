import { useRoutes } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import themes from "./themes/themes";
import { useAppSelector } from "./app/hooks";
import routes from "./components/routes";
import { selectAuth } from "./features/auth/authSlice";
// import { selectPreference } from "./features/preferences/preferencesSlice";
// import customTheme from "./themes/default";
// import { green, deepOrange, grey, orange } from "@mui/material/colors";

function App() {
  const { user } = useAppSelector(selectAuth);
  //const { mode } = useAppSelector(selectPreference);

  const isLoggedIn = user && user.email ? true : false;
  const roles = user?.roles ? user?.roles : [];
  const routing = useRoutes(routes(isLoggedIn, roles));
  // const [currentTheme, setCurrentTheme] = useState<Theme>({
  //   ...themes.default,
  // });
  // React.useEffect(() => {
  //   setCurrentTheme(
  //     createTheme({
  //       ...customTheme,
  //       palette: {
  //         mode,
  //         ...(mode === "light"
  //           ? {
  //               // palette values for light mode
  //               primary: { main: "#008000" },
  //               secondary: { main: "#ff6d00" },
  //               divider: green[200],
  //               text: {
  //                 primary: grey[900],
  //                 secondary: grey[800],
  //               },
  //             }
  //           : {
  //               // palette values for dark mode
  //               primary: { main: "#739574" },
  //               secondary: { main: "#b24c00" },
  //               divider: deepOrange[700],
  //               background: {
  //                 default: "#121212",
  //                 paper: "#121212",
  //               },
  //               text: {
  //                 primary: "#fff",
  //                 secondary: grey[500],
  //               },
  //             }),
  //       },
  //     }) as Theme
  //   );
  // }, [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes.custom}>{routing}</ThemeProvider>;
    </StyledEngineProvider>
  );
}

export default App;
