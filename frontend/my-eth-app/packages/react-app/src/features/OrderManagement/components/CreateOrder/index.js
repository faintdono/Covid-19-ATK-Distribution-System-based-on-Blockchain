import React, { useState } from "react";
import Modal from "./Modal";

const CreateOrder = () => {
  const [openModal, setOpenModal] = useState(false);
  console.log(openModal);
  return (
    <div>
      <button onClick={() => setOpenModal(true)}>Create Order</button>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};
export default CreateOrder;
