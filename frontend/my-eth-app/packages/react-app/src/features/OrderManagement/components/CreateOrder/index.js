import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const CreateOrder = () => {
  const [openModal, setOpenModal] = useState(false);
  console.log(openModal);
  return (
    <div>
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        Create new order
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};
export default CreateOrder;
