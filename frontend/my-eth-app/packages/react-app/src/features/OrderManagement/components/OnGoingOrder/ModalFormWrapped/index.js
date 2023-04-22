import React from "react";
import { useEthers } from "@usedapp/core";
import useGetOrder from "../../../hooks/useGetOrder";
import ConfirmOrder from "../../ConfirmOrder";
import RejectOrder from "../../RejectOrder";
import ShipOrder from "../../ShipOrder";
import CancelOrder from "../../CancelOrder";

const Modal = ({ setOpenModal, OrderID }) => {
  const { account } = useEthers();
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

  const DateTime = (timestamp) => {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var formattedTime =
      hours +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2) +
      " " +
      day.substr(-2) +
      "/" +
      month.substr(-2) +
      "/" +
      year;

    return formattedTime;
  };

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
              <div className="control">{DateTime(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{Status[order[8]]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{DateTime(order[9].toNumber())}</div>
            </div>
            <div className="buttons">
              <ConfirmOrder OD={OrderID} />
              <RejectOrder OD={OrderID} />
            </div>
          </section>
        </div>
      </div>
    );
  } else if (account === order[1] && order[8] === 1) {
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
              <div className="control">{DateTime(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{Status[order[8]]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{DateTime(order[9].toNumber())}</div>
            </div>
            <div className="buttons" data-dismiss="modal">
              <ShipOrder OD={OrderID} />
            </div>
          </section>
        </div>
      </div>
    );
  } else if (account === order[0]) {
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
              <div className="control">{order[3]}</div>
            </div>
            <div className="field">
              <label className="label">Lot ID</label>
              <div className="control">{order[4]}</div>
            </div>
            <div className="field">
              <label className="label">SKU</label>
              <div className="control">{order[5]}</div>
            </div>
            <div className="field">
              <label className="label">Amount</label>
              <div className="control">{order[6].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Date</label>
              <div className="control">{DateTime(order[7].toNumber())}</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">{Status[order[8]]}</div>
            </div>
            <div className="field">
              <label className="label">Last Update</label>
              <div className="control">{DateTime(order[9].toNumber())}</div>
            </div>
            <div className="buttons" data-dismiss="modal">
              <CancelOrder OD={OrderID} />
            </div>
          </section>
        </div>
      </div>
    );
  }
};
export default Modal;
