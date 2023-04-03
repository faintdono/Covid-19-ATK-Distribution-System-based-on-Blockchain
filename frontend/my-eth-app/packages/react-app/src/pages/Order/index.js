import React from "react";
import CreateOrder from "../../features/OrderManagement/components/CreateOrder";
import useGet from "../../features/OrderManagement/hooks/useGet";
import ListOnGoing from "../../features/OrderManagement/components/ListOrders/ListOngoing";

const Order = () => {
  return (
    <>
      <div className="has-text-centered">
        <section className="hero is-info">
          <div className="container">
            <h1 className="title">Order Page</h1>
            <h2 className="page-title">List order that you have.</h2>
          </div>
        </section>
      </div>
      <ListOnGoing />
    </>
  );
};

export default Order;
