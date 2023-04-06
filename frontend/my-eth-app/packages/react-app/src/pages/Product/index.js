import React from "react";
import SideMenu from "../../features/SupplyChain/components/SideMenu";

const Product = () => {
  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Product Management</p>
          <p className="subtitle"></p>
        </div>
      </section>
      <section>
        <div className="box">
          <div className="columns">
            <div className="column is-one-fifth">
              <SideMenu />
            </div>
            <div className="column">
              <ul>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
                <li>Mockup</li>
              </ul>
            </div>
            <div className="column is-one-fifth">
              <div className="buttons">
                <button className="button is-info is-outlined">Mockup</button>
                <button className="button is-link is-outlined">Mockup</button>
              </div>
            </div>
          </div>
        </div>
        f
      </section>
    </>
  );
};

export default Product;
