import { useEthers } from "@usedapp/core";
import useGet from "../../hooks/useGetOrder";

const ListFinish = () => {
  const { account } = useEthers();
  const values = useGet("getFinishOrders", account);
  let orderIDs = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    orderIDs = values[0];
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

export default ListFinish;
