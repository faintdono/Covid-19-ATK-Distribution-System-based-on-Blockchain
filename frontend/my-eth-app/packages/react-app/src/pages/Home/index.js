import React from "react";
import VerifyProduct from "../../features/SupplyChain/components/VerifyProduct";

const Home = () => (
  <>
    <section className="hero is-primary">
      <div className="hero-body">
        <p className="title">
          COVATK
        </p>
        <p className="subtitle">
          A decentralized supply chain management system
        </p>
      </div>
    </section>
    <br/>
    <div className="columns is-centered">
      <div className="column is-one-quarter"></div>
      <div className="column is-two-quarters">
        <VerifyProduct />
      </div>
      <div className="column is-one-quarter"></div>
    </div>
  </>
);

export default Home;
