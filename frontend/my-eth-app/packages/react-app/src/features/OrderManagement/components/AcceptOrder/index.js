import React from "react";
import useManagement from "../../hooks/useMangement";

const AcceptOrder = ({ OD }) => {
  const { send, state } = useManagement("acceptOrder");

  return (
    <div>
      <button
        onClick={() => {
          send(OD);
        }}
        className="button is-success"
      >
        Accept
      </button>
    </div>
  );
};
export default AcceptOrder;
