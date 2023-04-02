import React from "react";
import useCreateOrder from "../../../hooks/useCreateOrder";
import useGetNonce from "../../../hooks/useGetNonce";
import GenerateOrderID from "../../../utils/GenerateOrderID";

const Modal = ({ setOpenModal }) => {
  const { send: createOrder, state: createStatus } = useCreateOrder();
  const value = useGetNonce();
  let OrderID = "";
  if (value !== undefined) {
    OrderID = GenerateOrderID(value);
  }

  const handleSubmit = (e) => {
    const listInput = document.getElementsByTagName("input");
    console.log(listInput[0].value);
    // createOrder(OrderID, listInput[0].value, listInput[1].value);
    // console.log(createOrder);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Order</p>
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
          <div className="field">
            <label className="label">OrderID</label>
            <div className="control">{OrderID}</div>
          </div>
          <div className="field">
            <label className="label">Address</label>
            <div className="control">
              <input className="input" type="text" id="address" />
            </div>
          </div>
          <div className="field">
            <label className="label">Amount</label>
            <div className="control">
              <input className="input" type="number" id="amount" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            onClick={() => {
              createOrder(
                OrderID,
                document.getElementsByTagName("input")[0].value,
                document.getElementsByTagName("input")[1].value
              );
            }}
          >
            Submit
          </button>
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
