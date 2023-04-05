import { useEthers } from "@usedapp/core";
import useGet from "../../hooks/useGetList";
import ShippedOrder from "../ShippedOrder";

const ListShipped = () => {
  const { account } = useEthers();
  const values = useGet("getShippedOrders", account);
  let orderIDs = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    orderIDs = values;
  }

  return (
    <div>
      <ul>
        {orderIDs
          .map((orderID) => (
            <li key={orderIDs.id}>
              <ShippedOrder OD={orderID} />
            </li>
          ))
          .reverse()}
      </ul>
    </div>
  );
};

export default ListShipped;
