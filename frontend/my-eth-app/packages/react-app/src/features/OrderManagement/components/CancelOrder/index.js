import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const CancelOrder = (OrderID) => {
  const { send, state } = useManagement("cancelaOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        Cancel Order
      </a>
    </div>
  );
};

export default CancelOrder;
