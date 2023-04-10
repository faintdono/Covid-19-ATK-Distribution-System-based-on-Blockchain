import React from "react";
import useSellProduct from "../../../hooks/useSellProduct";

const Modal = ({ setOpenModal }) => {
  const { send: sellProduct } = useSellProduct();

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
          <p class="modal-card-title">Sell Product</p>
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
            <label className="label">Order ID</label>
            <div className="control has-text-black">
              <input className="input" type="text" id="OrderID" />
            </div>
          </div>
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
              sellProduct(
                document.getElementById("OrderID").value,
                document.getElementById("Key").value
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
