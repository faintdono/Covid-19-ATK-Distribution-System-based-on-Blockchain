import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ReturnProduct = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        Return Product
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};
export default ReturnProduct;
