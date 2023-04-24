import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const History = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="button is-link is-light"
        onClick={() => setOpenModal(true)}
      >
        <span className="icon">
          <i className="fa fa-history" aria-hidden="true"></i>
        </span>
        <span>history</span>
      </button>
      {openModal && <Modal setOpenModal={setOpenModal} UserKey={K} />}
    </>
  );
};

export default History;
