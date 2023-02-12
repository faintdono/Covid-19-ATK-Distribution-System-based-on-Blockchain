import "./index.css";

// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Goerli } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const INFURA_PROJECT_ID = "9352c4ea35594880b179f70ece40051e";
const config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID,
  },
};

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
// const client = new ApolloClient({
  // cache: new InMemoryCache(),
  // uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
// });

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      {/* <ApolloProvider client={client}> */}
        <App />
      {/* </ApolloProvider> */}
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
