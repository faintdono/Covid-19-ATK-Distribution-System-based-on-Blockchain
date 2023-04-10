import React, { useState } from "react";
import Modal from "./ModalFormWrapped";
import History from "../History";

const Ledger = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);

  function copyToClipboard(Key) {
    console.log(Key);
    navigator.clipboard.writeText(Key);
  }

  return (
    <div className="buttons">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <button onClick={() => setOpenModal(true)} className="button is-white">
        {K}
      </button> 
      <button className="button is-white">
        <i className="fa fa-copy" aria-hidden="true" onClick={() => {copyToClipboard(K)}}></i>
      </button>
      <History K={K} />
      {openModal && <Modal setOpenModal={setOpenModal} Key={K} />}
    </div>
  );
};

export default Ledger;
