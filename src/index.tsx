import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "./styles/common.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";

import { Provider } from "react-redux";
import store from "./redux";
import { theme } from "./styles/mui-theme";

// I have to use the <CacheProvider> instead of the <StylesProvider injectFirst>>
// when using Typescript, in order to load the MUI default styles before the CSS modules
const muiCache = createCache({
  key: "mui",
  prepend: true,
});

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={muiCache}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
