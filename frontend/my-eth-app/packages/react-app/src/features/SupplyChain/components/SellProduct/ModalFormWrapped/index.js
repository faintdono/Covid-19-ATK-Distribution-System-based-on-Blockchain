import React, { useState } from "react";
import useSellProduct from "../../../hooks/useSellProduct";
import useGetter from "../../../hooks/useGetter";
import { useEthers } from "@usedapp/core";
import { set } from "react-hook-form";

const Modal = ({ setOpenModal, setErrorOpenModal }) => {
  const { account } = useEthers();

  const [LedgerKey, setLedgerKey] = useState("");
  const { send: sellProduct, state } = useSellProduct();
  const values = useGetter("getUserKey", account);
  const info = useGetter("getProduct", LedgerKey);

  let product = [];
  let Keys = [];
  if (values !== undefined) {
    Keys = values;
  }
  if (info === undefined) {
    product = ["None", "None", "None", "None", "None", "None", "None"];
  } else {
    product = info;
  }

  if (state.status === "Exception") {
    setOpenModal(false);
    setErrorOpenModal(true);
  } else if (state.status === "Mining") {
    setOpenModal(false);
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
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Order ID</label>
                <div className="control has-text-black">
                  <input className="input" type="text" id="OrderID" />
                </div>
              </div>
              <div class="field">
                <label className="label">Key</label>
                <div class="control">
                  <div className="select">
                    <select
                      id="Key"
                      onChange={() => {
                        setLedgerKey(document.getElementById("Key").value);
                      }}
                    >
                      <option value="0x">Select a key</option>
                      {Keys.map((key) => (
                        <option value={key}>{key}</option>
                      )).reverse()}
                    </select>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <br />
                  <div className="subtitle is-5 has-text-centered">
                    Product Associate with Selected Key
                  </div>
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
                    <label className="label">Total Amount</label>
                    <div className="control">{product[6].toString()}</div>
                  </div>
                </div>
              </div>
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
