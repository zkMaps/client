import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const subgraphUri = "https://api.thegraph.com/subgraphs/name/ronerlih/zkmapsdev";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "dark"}>
      <RecoilRoot>
        <BrowserRouter>
          <App subgraphUri={subgraphUri} />
        </BrowserRouter>
      </RecoilRoot>
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
