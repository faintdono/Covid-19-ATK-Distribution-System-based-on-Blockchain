import React, { useState } from "react";
import useManagement from "../../hooks/useMangement";

export const OnHoldOrder = ({OD}) => {
  const { send, state } = useManagement("onholdOrder");

  return (
    <div>
      <button
        className="button is-warning"
        onClick={() => {
          send(OD);
        }}
      >
        OnHold
      </button>
    </div>
  );
};

export const UnHoldOrder = ({OD}) => {
  const { send, state } = useManagement("unholdOrder");

  return (
    <div>
      <button
        className="button is-success"
        onClick={() => {
          send(OD);
        }}
      >
        UnHold
      </button>
    </div>
  );
};
