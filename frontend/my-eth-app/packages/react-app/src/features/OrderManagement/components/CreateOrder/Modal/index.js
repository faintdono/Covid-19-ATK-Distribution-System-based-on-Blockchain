import React from "react";
import Form from "../Form";

const Modal = ({ setOpenModal }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Modal title</p>
          <button
            class="delete"
            aria-label="close"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </header>
        <section class="modal-card-body">
          <Form />
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Submit</button>
          <button
            class="button"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
