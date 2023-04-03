import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const ShipOrder = (OrderID) => {
  const { send, state } = useManagement("shipOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        Ship Order
      </a>
    </div>
  );
};
export default ShipOrder;
