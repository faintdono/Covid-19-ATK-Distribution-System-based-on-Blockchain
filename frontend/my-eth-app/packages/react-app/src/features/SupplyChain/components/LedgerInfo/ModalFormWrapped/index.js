import React, { useState } from "react";
import useGetter from "../../../hooks/useGetter";

const Modal = ({ setOpenModal, Key }) => {
  const ledger = useGetter("getLedger", Key);
  const Role = ["Manufacturer", "Distributor", "Wholesaler", "Retailer"];
  const Status = ["Unsaleable", "Saleable"];
  const [time, setTime] = useState(Date.now());

  const calculateTime = () => {
    if (ledger === undefined && Date.now() - time < 1000) {
      console.log("Loading");
      return "Loading";
    } else if (ledger !== undefined) {
      console.log("Founded");
      return "Founded";
    } else {
      console.log("Not Founded");
      return "Not Founded";
    }
  };

  if (calculateTime() === "Loading") {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => {
            setOpenModal(false);
          }}
        ></div>
        <div class="modal-card">
          <section className="modal-card-body">
            <div className="title is-4 has-text-centered">loading...</div>
            <progress
              className="progress is-small is-dark"
              max="100"
            ></progress>
          </section>
        </div>
      </div>
    );
  } else if (calculateTime() === "Not Founded") {
    return (
      <div className="modal is-active">
        <div
          class="modal-background"
          onClick={() => {
            setOpenModal(false);
          }}
        ></div>
        <div class="modal-card">
          <section className="modal-card-body">
            <div className="title is-4 has-text-centered">
              Failed to load ledger info
            </div>
            <div className="subtitle is-6 has-text-centered">
              This Ledger Key is invalid. Please check again.
            </div>
            <progress
              className="progress is-small is-danger"
              max="100"
              value="100"
            >
              100%
            </progress>
          </section>
        </div>
      </div>
    );
  } else if (calculateTime() === "Founded") {
    if (ledger[0].toString() === "0x0000000000000000000000000000000000000000ๅ") {
      return (
        <div className="modal is-active">
          <div
            class="modal-background"
            onClick={() => {
              setOpenModal(false);
            }}
          ></div>
          <div class="modal-card">
            <section className="modal-card-body">
              <div className="title is-4 has-text-centered">
                Failed to load ledger info
              </div>
              <div className="subtitle is-6 has-text-centered">
                This Ledger Key is not registered in the system.
              </div>
              <progress
                className="progress is-small is-danger"
                max="100"
                value="100"
              >
                100%
              </progress>
            </section>
          </div>
        </div>
      );
    } else {
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
    }
  }
};
export default Modal;
