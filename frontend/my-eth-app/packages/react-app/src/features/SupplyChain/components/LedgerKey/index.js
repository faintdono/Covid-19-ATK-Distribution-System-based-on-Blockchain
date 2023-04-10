import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const LedgerKey = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        {K}
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} Key={K} />}
    </div>
  );
};

export default LedgerKey;
