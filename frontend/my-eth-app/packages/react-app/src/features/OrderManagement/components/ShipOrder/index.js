import React from "react";
import useManagement from "../../hooks/useMangement";

const ShipOrder = ({ OD }) => {
  const { send, state } = useManagement("shipOrder");

  return (
    <div>
      <button
        onClick={() => {
          send(OD);
        }}
        className="button is-success"
      >
        Ship
      </button>
    </div>
  );
};
export default ShipOrder;
