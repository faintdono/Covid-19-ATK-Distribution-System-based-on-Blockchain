import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

const RejectOrder = ({ OD }) => {
  const { send, state } = useManagement("rejectOrder");

  return (
    <div>
      <button
        className="button is-danger"
        onClick={() => {
          send(OD);
        }}
      >
        Reject
      </button>
    </div>
  );
};
export default RejectOrder;
