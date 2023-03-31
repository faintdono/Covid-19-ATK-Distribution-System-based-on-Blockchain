import { useState } from "react";
import { useCall, useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const OrderManInterface = new utils.Interface(abis.OrderManagement);
const OrderManAddress = addresses.orderManagement;
const omContract = new Contract(OrderManAddress, OrderManInterface);

const useCreateOrder = () => {
  const { state, send } = useContractFunction(omContract, "createOrder", {
    transactionName: "Create Order",
  });

  return { state, send };
};

export default useCreateOrder;
