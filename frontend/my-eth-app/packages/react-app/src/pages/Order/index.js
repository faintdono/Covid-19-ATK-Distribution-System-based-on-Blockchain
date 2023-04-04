import React from "react";
import ListOnGoing from "../../features/OrderManagement/components/ListOrders/ListOngoing";
import ListShipped from "../../features/OrderManagement/components/ListOrders/ListShipped";
import ListFinish from "../../features/OrderManagement/components/ListOrders/ListFinish";

const Order = () => {
  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Primary hero</p>
          <p className="subtitle">Primary subtitle</p>
        </div>
      </section>
      <div className="box">
        <div className="columns">
          <div className="column">
            <div className=""></div>
            <ListOnGoing />
          </div>
          <div className="column">
            <ListShipped />
          </div>
          <div className="column">
            <ListFinish />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
