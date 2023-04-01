import { React } from "react";
import useCreateOrder from "../../../hooks/useCreateOrder";


const generateOrderID = (orderID) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const nonce = orderID.toString();
  const step = nonce.length / 3;
  let finalString = "OD";
  for (var x = 0; x < 3; x++) {
    var start = step * x;
    var end = start + step;
    var part = nonce.substring(start, end);
    finalString += part;
    if (x === 0) {
      finalString += year;
    } else if (x === 1) {
      finalString += month;
    } else if (x === 2) {
      finalString += day;
    }
  }
  return finalString;
};

const Form = () => {
  const { send: createOrder, state: createStatus } = useCreateOrder();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { orderID, address, amount } = e.target.elements;
    createOrder(orderID.value, address.value, amount.value);
    console.log(createOrder);
    console.log(createStatus);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">OrderID</label>
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
