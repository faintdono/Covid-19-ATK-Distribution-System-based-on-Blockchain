import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const ShipOrder = ({ OD }) => {
  const { send, state } = useManagement("shipOrder");

  return (
    <div>
      <a
        href="#"
        onClick={() => {
          send(OD);
        }}
        className="navbar-item"
      >
        Ship Order
      </a>
    </div>
  );
};
export default ShipOrder;
