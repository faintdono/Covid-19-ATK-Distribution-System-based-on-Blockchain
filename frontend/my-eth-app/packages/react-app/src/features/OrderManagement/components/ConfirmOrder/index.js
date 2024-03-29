import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ConfirmOrder = ({OD}) => {
  const [openModal, setOpenModal] = useState(false);
  console.log(openModal);
  return (
    <div>
      <button className="button is-success" onClick={() => setOpenModal(true)}>
        Confirm
      </button>
      {openModal && <Modal setOpenModal={setOpenModal} OrderID={OD} />}
    </div>
  );
};
export default ConfirmOrder;
