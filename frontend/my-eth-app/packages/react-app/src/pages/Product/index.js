import React from "react";
import LeftSideMenu from "../../features/SupplyChain/components/LeftSideMenu";
import ListUserKey from "../../features/SupplyChain/components/ListUserKey";
import RightSideMenu from "../../features/SupplyChain/components/RightSideMenu";

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
              <LeftSideMenu />
            </div>
            <div className="column">
              <ListUserKey />
            </div>
            <div className="column is-one-fifth">
              <RightSideMenu />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
