import React, { useState } from "react";
import useGetLedger from "../../../hooks/useGetLedger";

const Modal = ({ setOpenModal, UserKey }) => {
  const [Key, setKey] = useState(UserKey);
  const [listAddress, setListAddress] = useState([]);

  const Ledger = useGetLedger(Key);

  let exKey = Key;
  if (Ledger === undefined) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">History</p>
          </header>
          <section class="modal-card-body">loading...</section>
        </div>
      </div>
    );
  } else if (
    exKey !==
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    setListAddress([...listAddress, Ledger[0]]);
    exKey = Ledger[5];
    setKey(Ledger[5]);
  }
  return (
    <div className="modal is-active">
      <div
        className="modal-background"
        onClick={() => setOpenModal(false)}
      ></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">History</p>
          <button
            class="delete"
            aria-label="close"
            onClick={() => {
              setOpenModal(false);
            }}
          ></button>
        </header>
        <section class="modal-card-body">
          <div className="field">
            <label className="label">Address</label>
            <div className="control">
              {listAddress.map((address) => (
                <div>{address}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Modal;
