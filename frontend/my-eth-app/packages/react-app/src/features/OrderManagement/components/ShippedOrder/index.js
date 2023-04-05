import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ShippedOrder = ({ OD }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        {OD}
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} OrderID={OD} />}
    </div>
  );
};
export default ShippedOrder;
