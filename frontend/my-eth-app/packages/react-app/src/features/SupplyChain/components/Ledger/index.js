import React, { useState } from "react";
import Modal from "./ModalFormWrapped";
import History from "../History";
import ProductInfo from "../ProductInfo";

const Ledger = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);

  function copyToClipboard(Key) {
    console.log("Trying to copy: ", Key);
    navigator.clipboard.writeText(Key);
    console.log(Key, " copied to clipboard");
  }

  return (
    // <div className="buttons">
    <div className="columns">
      <div className="column is-9">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <button onClick={() => setOpenModal(true)} className="button is-white">
          {K}
        </button>
      </div>
      <div className="column">
        <button className="button is-white">
          <i
            className="fa fa-copy"
            aria-hidden="true"
            onClick={() => {
              copyToClipboard(K);
            }}
          ></i>
        </button>
      </div>
      <div className="column">
        <History K={K} />
      </div>
      <div className="column">
        <ProductInfo K={K} />
      </div>
      {openModal && <Modal setOpenModal={setOpenModal} Key={K} />}
    </div>
  );
};

export default Ledger;
