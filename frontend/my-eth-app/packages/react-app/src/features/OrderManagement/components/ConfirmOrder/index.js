import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ConfirmOrder = () => {
  const [openModal, setOpenModal] = useState(false);
  console.log(openModal);
  return (
    <div>
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        Confirm Order
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};
export default ConfirmOrder;
