import React from "react";
import VerifyProduct from "../../features/SupplyChain/components/VerifyProduct";

const Home = () => (
  <div className="columns is-centered">
    <div className="column is-one-quarter"></div>
    <div className="column is-two-quarters">
      <VerifyProduct />
    </div>
    <div className="column is-one-quarter"></div>
  </div>
);

export default Home;
