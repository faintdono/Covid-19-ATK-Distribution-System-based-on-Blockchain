import React from "react";
import useGetOrder from "../../../hooks/useGetOrder";

const Modal = ({ setOpenModal, OrderID }) => {
  const order = useGetOrder(OrderID);

  const Status = [
    "Placed",
    "Pending",
    "Rejected",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Onhold",
    "Returned",
  ];

  if (order === undefined) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">loading...</div>
      </div>
    );
  }

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
              {order[3]}
            </div>
          </div>
          <div className="field">
            <label className="label">Lot ID</label>
            <div className="control">
              {order[4] ? order[4].toString : "None"}
              {order[4]}
            </div>
          </div>
          <div className="field">
            <label className="label">SKU</label>
            <div className="control">
              {order[5] ? order[5].toString : "None"}
              {order[5]}
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
            <div className="control">{Status[order[8]]}</div>
          </div>
          <div className="field">
            <label className="label">Last Update</label>
            <div className="control">{Date(order[9].toNumber())}</div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Modal;