import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const History = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="button is-info is-inverted "
        onClick={() => setOpenModal(true)}
      >
        <i className="fa fa-history" aria-hidden="true"></i>
        history
      </button>
      {openModal && <Modal setOpenModal={setOpenModal} UserKey={K} />}
    </>
  );
};

export default History;
