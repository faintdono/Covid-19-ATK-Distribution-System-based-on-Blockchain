import React, { useState } from "react";
import useGeter from "../../../hooks/useGetter";

const Modal = ({ setOpenModal, UserKey }) => {
  const [Key, setKey] = useState(UserKey);
  const [listAddress, setListAddress] = useState([]);

  const Ledger = useGeter("getLedger", Key);

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
  } else if (
    Ledger[0].toString() === "0x0000000000000000000000000000000000000000" &&
    listAddress[0] === "0x0000000000000000000000000000000000000000"
  ) {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => setOpenModal(false)}
        ></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">History</p>
          </header>
          <section class="modal-card-body">
            undefined Key can't have History
          </section>
        </div>
      </div>
    );
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
