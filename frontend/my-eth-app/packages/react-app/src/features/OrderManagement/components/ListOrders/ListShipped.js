import { useEthers } from "@usedapp/core";
import useGet from "../../hooks/useGetList";

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
        {orderIDs.map((orderID) => (
          <li key={orderIDs.id}>{orderID}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListShipped;