import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const RejectOrder = (OrderID) => {
  const { send, state } = useManagement("rejectOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        Reject Order
      </a>
    </div>
  );
};
export default RejectOrder;
