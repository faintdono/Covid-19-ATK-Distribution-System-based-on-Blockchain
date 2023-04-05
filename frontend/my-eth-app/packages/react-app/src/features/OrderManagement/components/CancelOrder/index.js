import React from "react";
import useManagement from "../../hooks/useMangement";

const CancelOrder = ({ OD }) => {
  const { send, state } = useManagement("cancelOrder");

  return (
    <div>
      <button
        onClick={() => {
          send(OD);
        }}
        className="button is-danger"
      >
        Cancel
      </button>
    </div>
  );
};

export default CancelOrder;
