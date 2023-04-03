import "./index.css";

import { DAppProvider, Goerli, Hardhat } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { BrowserRouter } from "react-router-dom";

const INFURA_PROJECT_ID = "9352c4ea35594880b179f70ece40051e";
const config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID,
    [Hardhat.chainId]: "http://localhost:8545",
  },
  multicallVersion: 2,
};

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <AppWithRouter />{" "}
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
