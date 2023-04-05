import React from "react";
import useCreateOrder from "../../../hooks/useCreateOrder";
import useGetNonce from "../../../hooks/useGetNonce";
import GenerateOrderID from "../../../utils/GenerateOrderID";

const Modal = ({ setOpenModal }) => {
  const { send: createOrder } = useCreateOrder();
  const value = useGetNonce();
  let OrderID = "";
  if (value !== undefined) {
    OrderID = GenerateOrderID(value);
  }

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Order</p>
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
            <label className="label">OrderID</label>
            <div className="control has-text-black">{OrderID}</div>
          </div>
          <div className="field">
            <label className="label">Address</label>
            <div className="control">
              <input className="input" type="text" id="address" />
            </div>
          </div>
          <div className="field">
            <label className="label">Amount</label>
            <div className="control">
              <input className="input" type="number" id="amount" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            onClick={() => {
              createOrder(
                OrderID,
                document.getElementsByTagName("input")[0].value,
                document.getElementsByTagName("input")[1].value
              );
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
