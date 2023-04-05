import React from "react";
import useManagement from "../../hooks/useMangement";

const ReturnOrder = ({ OD }) => {
  const { send, state } = useManagement("returnOrder");

  return (
    <div>
      <button
        onClick={() => {
          send(OD);
        }}
        className="button is-danger"
      >
        Return
      </button>
    </div>
  );
};
export default ReturnOrder;
