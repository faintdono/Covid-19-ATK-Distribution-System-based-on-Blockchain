import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const ReturnOrder = (OrderID) => {
  const { send, state } = useManagement("returnOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        Return Order
      </a>
    </div>
  );
};
export default ReturnOrder;
