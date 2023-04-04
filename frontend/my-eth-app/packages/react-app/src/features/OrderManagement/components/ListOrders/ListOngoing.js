import { useEthers } from "@usedapp/core";
import useGetList from "../../hooks/useGetList";
import OnGoingOrder from "../OnGoingOrder";

const ListOnGoing = () => {
  const { account } = useEthers();
  const values = useGetList("getOngoingOrders", account);
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
          <li key={orderIDs.id}>
            <OnGoingOrder OD={orderID} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOnGoing;
