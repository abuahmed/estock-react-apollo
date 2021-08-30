import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { CssBaseline } from "@material-ui/core";
import "./index.css";
import "font-awesome/css/font-awesome.min.css";

import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./app/graphql";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <BrowserRouter>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
