import React from "react";

const ErrorModal = ({ setOpenModal }) => {
  return (
    <div className="modal is-active">
      <div
        className="modal-background"
        onClick={() => {
          setOpenModal(false);
        }}
      ></div>
      <div class="modal-card">
        <section className="modal-card-body">
          <div className="title is-4 has-text-centered">
            Insufficient Product
          </div>
          <div className="subtitle is-6 has-text-centered">
            Your product amount is less than the amount you want to sell.
          </div>
          <progress
            className="progress is-small is-danger"
            max="100"
            value="100"
          ></progress>
        </section>
      </div>
    </div>
  );
};

export default ErrorModal;
