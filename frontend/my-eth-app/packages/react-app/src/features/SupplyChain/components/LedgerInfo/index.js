import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const LedgerInfo = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="button is-info is-light"
        onClick={() => setOpenModal(true)}
      >
        <span className="icon">
          <i className="fa fa-info" aria-hidden="true"></i>
        </span>
        <span>Info</span>
      </button>
      {openModal && <Modal setOpenModal={setOpenModal} Key={K} />}
    </>
  );
};

export default LedgerInfo;
