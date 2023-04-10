import React from "react";
import LeftSideMenu from "../../features/SupplyChain/components/LeftSideMenu";
import UserKey from "../../features/SupplyChain/components/UserKey";

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
            {/* <div className="column">
              <ListUserKey />
            </div>
            <div className="column is-one-fifth">
              <RightSideMenu />
            </div> */}
            <UserKey/>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
