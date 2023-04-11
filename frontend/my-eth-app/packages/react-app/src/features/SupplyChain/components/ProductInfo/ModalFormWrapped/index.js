import React, { useState } from "react";
import useGetter from "../../../hooks/useGetter";

const Modal = ({ setOpenModal, UserKey }) => {
  const product = useGetter("getProduct", UserKey);
  if (product === undefined) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Prdocuct Info</p>
          </header>
          <section class="modal-card-body">loading...</section>
        </div>
      </div>
    );
  } else {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => setOpenModal(false)}
        ></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Product Info</p>
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
              <div className="control">{product[0].toString()}</div>
            </div>
            <div className="field">
              <label className="label">SKU</label>
              <div className="control">{product[1].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Manufacturer Name</label>
              <div className="control">{product[2].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Manufacturer Address</label>
              <div className="control">{product[3].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Manufacturering Date</label>
              <div className="control">{product[4].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Expiration Date</label>
              <div className="control">{product[5].toString()}</div>
            </div>
            <div className="field">
              <label className="label">Totol Amount</label>
              <div className="control">{product[6].toString()}</div>
            </div>
          </section>
        </div>
      </div>
    );
  }
};
export default Modal;
