import React from "react";
import { useEthers } from "@usedapp/core";
import useAddProduct from "../../../hooks/useAddProduct";
import useGetUserDetails from "../../../../Registration/hooks/useGetUserDetails";

const Modal = ({ setOpenModal }) => {
  const { account } = useEthers();
  const { send: addProduct } = useAddProduct();
  const userDetails = useGetUserDetails(account);
  console.log(account);
  console.log(userDetails);
  if (account === undefined) {
    return <div>loading</div>;
  }
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Product</p>
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
            <label className="label">Lot ID</label>
            <div className="control has-text-black">
              <input className="input" type="text" id="lotID" />
            </div>
          </div>
          <div className="field">
            <label className="label">SKU</label>
            <div className="control">
              <input className="input" type="text" id="SKU" />
            </div>
          </div>
          <div className="field">
            <label className="label">Manufacturing Date</label>
            <div className="control">
              <input className="input" type="text" id="MFGDT" />
            </div>
          </div>
          <div className="field">
            <label className="label">Expiration Date</label>
            <div className="control">
              <input className="input" type="text" id="EXP" />
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
              addProduct(
                document.getElementById("lotID").value,
                document.getElementById("SKU").value,
                userDetails[2],
                document.getElementById("MFGDT").value,
                document.getElementById("EXP").value,
                document.getElementById("amount").value
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
