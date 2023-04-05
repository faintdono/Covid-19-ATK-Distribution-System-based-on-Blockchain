import React from "react";
import useConfirmOrder from "../../../hooks/useConfirmOrder";

const Modal = ({ setOpenModal, OrderID }) => {
  const { send: confirmOrder, state: confirmStatus } = useConfirmOrder();

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Order</p>
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
            <label className="label">OrderID</label>
            <div className="control">{OrderID}</div>
          </div>
          <div className="field">
            <label className="label">Invoice</label>
            <div className="control">
              <input className="input" type="text" id="invoice" />
            </div>
          </div>
          <div className="field">
            <label className="label">Lot ID</label>
            <div className="control">
              <input className="input" type="text" id="lotID" />
            </div>
          </div>
          <div className="field">
            <label className="label">SKU</label>
            <div className="control">
              <input className="input" type="text" id="sku" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            onClick={() => {
              confirmOrder(
                OrderID,
                document.getElementsByTagName("input")[0].value,
                document.getElementsByTagName("input")[1].value,
                document.getElementsByTagName("input")[2].value
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
