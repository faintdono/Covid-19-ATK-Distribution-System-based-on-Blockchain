import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

export const OnHoldOrder = (OrderID) => {
  const { send, state } = useManagement("onholdOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        OnHold Order
      </a>
    </div>
  );
};

export const UnHoldOrder = (OrderID) => {
  const { send, state } = useManagement("unholdOrder");

  return (
    <div>
      <a
        href="#"
        onclick={() => {
          send(OrderID);
        }}
        className="navbar-item"
      >
        UnHold Order
      </a>
    </div>
  );
};
