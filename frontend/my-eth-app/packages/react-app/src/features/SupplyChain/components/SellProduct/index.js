import React, { useState } from "react";
import Modal from "./ModalFormWrapped";
import ErrorModal from "./ErrorModal";

const SellProduct = () => {
  const [openModal, setOpenModal] = useState(false);
  const [errorOpenModal, setErrorOpenModal] = useState(false);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => setOpenModal(true)} className="navbar-item">
        Sell product
      </a>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          setErrorOpenModal={setErrorOpenModal}
        />
      )}
      {errorOpenModal && <ErrorModal setOpenModal={setErrorOpenModal} />}
    </div>
  );
};
export default SellProduct;
