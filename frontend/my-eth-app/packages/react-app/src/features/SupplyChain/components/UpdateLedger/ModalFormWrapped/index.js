import React from "react";
import useUpdateLedgerStatus from "../../../hooks/useUpdateLedgerStatus";

const Modal = ({ setOpenModal }) => {
  const { send: updateLedger } = useUpdateLedgerStatus();

  return (
    <div className="modal is-active">
      <div
        className="modal-background"
        onClick={() => {
          setOpenModal(false);
        }}
      ></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Update Ledger</p>
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
            <label className="label">Key</label>
            <div className="control">
              <input className="input" type="text" id="Key" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            onClick={() => {
              updateLedger(document.getElementById("Key").value);
              setOpenModal(false);
            }}
          >
            Submit
          </button>
          <button
            class="button"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
