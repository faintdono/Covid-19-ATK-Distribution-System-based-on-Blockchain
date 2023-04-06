import React from "react";
import useVerifyProduct from "../../../hooks/useVerifyProduct";

const Result = ({
  LotID,
  SKU,
  Manufacturer,
  ExpirationDate,
  Key,
  setModalOpen,
}) => {
  const value = useVerifyProduct(LotID, SKU, Manufacturer, ExpirationDate, Key);
  if (value === undefined) {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => {
            setModalOpen(false);
          }}
        ></div>
        <div class="modal-card">
          <section className="modal-card-body">
            <div className="title is-4 has-text-centered">loading...</div>
            <progress
              className="progress is-small is-dark"
              max="100"
            ></progress>
          </section>
        </div>
      </div>
    );
  } else if (value === true) {
    return (
      <div className="modal is-active">
        <div
          class="modal-background"
          onClick={() => {
            setModalOpen(false);
          }}
        ></div>
        <div class="modal-card">
          <section className="modal-card-body">
            <div className="title is-4 has-text-centered">Product is valid</div>
            <div className="subtitle is-6 has-text-centered">
              The product information matches the the product associated with
              this ledger key.
            </div>
            <progress
              className="progress is-small is-primary"
              max="100"
            ></progress>
          </section>
        </div>
      </div>
    );
  } else if (value === false) {
    return (
      <div className="modal is-active">
        <div
          class="modal-background"
          onClick={() => {
            setModalOpen(false);
          }}
        ></div>
        <div class="modal-card">
          <section className="modal-card-body">
            <div className="title is-4 has-text-centered">
              Failed to validate product
            </div>
            <div className="subtitle is-6 has-text-centered">
              There is a mismatch between the product information and the
              product associated with this ledger key
            </div>
            <progress
              className="progress is-small is-danger"
              max="100"
              value="100"
            >
              100%
            </progress>
          </section>
        </div>
      </div>
    );
  }
};

export default Result;
