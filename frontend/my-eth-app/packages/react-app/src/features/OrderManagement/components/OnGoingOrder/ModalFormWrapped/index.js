import React from "react";
import { useEthers } from "@usedapp/core";
import useGetOrder from "../../../hooks/useGetOrder";
import ConfirmOrder from "../../ConfirmOrder";
import RejectOrder from "../../RejectOrder";
import ShipOrder from "../../ShipOrder";

const Modal = ({ setOpenModal, OrderID }) => {
  const { account } = useEthers();
  const order = useGetOrder(OrderID);
  if (order === undefined) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">loading...</div>
      </div>
    );
  }
  if (account === order[1] && order[8] === 0) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{OrderID}</p>
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
              <label className="label">Buyer Address</label>
              <div className="control">{order[0].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Seller Address</label>
              <div className="control">{order[1].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Invoice</label>
              <div className="control">
                {order[3] ? order[3].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Lot ID</label>
              <div className="control">
                {order[4] ? order[4].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">SKU</label>
              <div className="control">
                {order[5] ? order[5].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Amount</label>
              <div className="control">{order[6].toString}</div>
            </div>
            <div className="field">
              <label className="label">Date</label>
              <div className="control">{Date(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{order[8]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{Date(order[9].toNumber())}</div>
            </div>
            <div className="buttons">
              <ConfirmOrder OD={OrderID} />
              <RejectOrder OD={OrderID} />
            </div>
          </section>
        </div>
      </div>
    );
  } else if (account === order[0]) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{OrderID}</p>
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
              <label className="label">Buyer Address</label>
              <div className="control">{order[0].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Seller Address</label>
              <div className="control">{order[1].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Invoice</label>
              <div className="control">
                {order[3] ? order[3].toString : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Lot ID</label>
              <div className="control">
                {order[4] ? order[4].toString : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">SKU</label>
              <div className="control">
                {order[5] ? order[5].toString : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Amount</label>
              <div className="control">{order[6].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Date</label>
              <div className="control">{Date(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{order[8]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{Date(order[9].toNumber())}</div>
            </div>
          </section>
        </div>
      </div>
    );
  } else if (account === order[1] && order[8] === 1) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{OrderID}</p>
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
              <label className="label">Buyer Address</label>
              <div className="control">{order[0].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Seller Address</label>
              <div className="control">{order[1].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Invoice</label>
              <div className="control">
                {order[3] ? order[3].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Lot ID</label>
              <div className="control">
                {order[4] ? order[4].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">SKU</label>
              <div className="control">
                {order[5] ? order[5].toString() : "None"}
              </div>
            </div>
            <div className="field">
              <label className="label">Amount</label>
              <div className="control">{order[6].toString}</div>
            </div>
            <div className="field">
              <label className="label">Date</label>
              <div className="control">{Date(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{order[8]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{Date(order[9].toNumber())}</div>
            </div>
            <div className="buttons">
              <ShipOrder OD={OrderID} />
            </div>
          </section>
        </div>
      </div>
    );
  }
};
export default Modal;