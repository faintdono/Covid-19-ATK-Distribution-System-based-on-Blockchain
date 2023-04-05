import React from "react";
import ListOnGoing from "../../features/OrderManagement/components/ListOrders/ListOngoing";
import ListShipped from "../../features/OrderManagement/components/ListOrders/ListShipped";
import ListFinish from "../../features/OrderManagement/components/ListOrders/ListFinish";
import CreateOrder from "../../features/OrderManagement/components/CreateOrder";

const Order = () => {
  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Order Management</p>
          <p className="subtitle">
            <CreateOrder />
          </p>
        </div>
      </section>
      <section>
        <div className="box">
          <div className="columns">
            <div className="column">
              <article className="menu">
                <div className="menu-label">On-going Order</div>
                <div class="menu-list">
                  <ListOnGoing />
                </div>
              </article>
            </div>
            <div className="column">
              <article className="menu">
                <div className="menu-label">Shiping Order</div>
                <div class="menu-list">
                  <ListShipped />
                </div>
              </article>
            </div>
            <div className="column">
              <article className="menu">
                <div className="menu-label">Finished Order</div>
                <div class="menu-list">
                  <ListFinish />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Order;
