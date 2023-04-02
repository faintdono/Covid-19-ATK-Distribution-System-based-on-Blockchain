import { React } from "react";
import useCreateOrder from "../../../hooks/useCreateOrder";

const Form = ({ OrderID }) => {
  const { send: createOrder, state: createStatus } = useCreateOrder();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { OrderID, address, amount } = e.target.elements;
    createOrder(OrderID, address.value, amount.value);
    console.log(createOrder);
    console.log(createStatus);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">Submit</button>
          </div>
          <div class="control">
            <button class="button is-link is-light">Cancel</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Form;
