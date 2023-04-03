import { useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const OrderManInterface = new utils.Interface(abis.OrderManagement);
const OrderManAddress = addresses.orderManagement;
const omContract = new Contract(OrderManAddress, OrderManInterface);

const useManagement = (method) => {
  const { state, send } = useContractFunction(omContract, method, {
    transactionName: "Other Order Managment Function",
  });

  return { state, send };
};

export default useManagement;
