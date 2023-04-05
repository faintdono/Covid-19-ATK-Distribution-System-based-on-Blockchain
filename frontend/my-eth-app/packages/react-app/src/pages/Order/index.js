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
      <section>
        <div className="box">
          <div className="columns">
            <div className="column">
              <article className="message">
                <div className="message-header">On-going Order</div>
                <div class="message-body">
                  <ListOnGoing />
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message">
                <div className="message-header">Shipped Order</div>
                <div class="message-body">
                  <ListShipped />
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message">
                <div className="message-header">Finished Order</div>
                <div class="message-body">
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
