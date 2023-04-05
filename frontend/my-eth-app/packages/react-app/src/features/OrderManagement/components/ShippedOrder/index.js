import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ShippedOrder = ({ OD }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        {OD}
      </a>
      {openModal && <Modal setOpenModal={setOpenModal} OrderID={OD} />}
    </div>
  );
};
export default ShippedOrder;
