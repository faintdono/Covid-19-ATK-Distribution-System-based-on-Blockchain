import React, { useState } from "react";
import Modal from "./ModalFormWrapped";

const ProductInfo = ({ K }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="button is-info is-inverted "
        onClick={() => setOpenModal(true)}
      >
        <i className="fa fa-info" aria-hidden="true"></i>
        Info
      </button>
      {openModal && <Modal setOpenModal={setOpenModal} UserKey={K} />}
    </>
  );
};

export default ProductInfo;
