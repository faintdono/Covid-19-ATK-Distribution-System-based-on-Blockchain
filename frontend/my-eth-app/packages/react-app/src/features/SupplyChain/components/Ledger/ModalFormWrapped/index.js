import React from "react";
import useGetter from "../../../hooks/useGetter";

const Modal = ({ setOpenModal, Key }) => {
  const ledger = useGetter("getLedger", Key);
  if (ledger === undefined) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">loading...</div>
      </div>
    );
  }
  const Role = ["Manufacturer", "Distributor", "Wholesaler", "Retailer"];
  const Status = ["Unsaleable", "Saleable"];
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
          <p class="modal-card-title"></p>
          <button
            class="delete"
            aria-label="close"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </header>
        <section class="modal-card-body">
          <div className="field">
            <label className="label">LedgerKey</label>
            <div className="control">{Key}</div>
          </div>
          <div className="field">
            <label className="label">Address</label>
            <div className="control">{ledger[0]}</div>
          </div>
          <div className="field">
            <label className="label">Role</label>
            <div className="control">{Role[ledger[1]]}</div>
          </div>
          <div className="field">
            <label className="label">Seller Address</label>
            <div className="control">{ledger[2]} </div>
          </div>
          <div className="field">
            <label className="label">Order ID</label>
            <div className="control">
              {ledger[3] ? ledger[3].toString() : "None"}
            </div>
          </div>
          <div className="field">
            <label className="label">Invoice</label>
            <div className="control">
              {ledger[4] ? ledger[4].toString() : "None"}
            </div>
          </div>
          <div className="field">
            <label className="label">Upper Key</label>
            <div className="control">{ledger[5]}</div>
          </div>
          <div className="field">
            <label className="label">Amount</label>
            <div className="control">{ledger[6].toString()}</div>
          </div>
          <div className="field">
            <label className="label">Status</label>
            <div className="control">{Status[ledger[7]]}</div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Modal;
