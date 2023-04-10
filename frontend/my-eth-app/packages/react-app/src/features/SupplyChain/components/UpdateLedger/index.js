import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const UpdateLedger = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        Update Ledger Key
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};
export default UpdateLedger;
