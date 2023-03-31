import { React } from "react";
import useCreateOrder from "../hooks/useCreateOrder";
import useGetNonce from "../hooks/useGetNonce"; // this hook is not working

const CreateOrderForm = () => {
  const { send: createOrder, state: createStatus } = useCreateOrder();
  // const { value: orderID, error } = useGetNonce();
  // console.log(error);
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
          <div className="control">
            <input className="input" type="text" id="orderID" />
          </div>
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

export default CreateOrderForm;
