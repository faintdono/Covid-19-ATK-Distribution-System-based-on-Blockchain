import { useState } from "react";
import { useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const OrderManInterface = new utils.Interface(abis.OrderManagement);
const OrderManAddress = addresses.OrderManagement;
const omContract = new Contract(OrderManAddress, OrderManInterface);

const useConfirmOrder = () => {
  const { send, state } = useContractFunction(omContract, "confirmOrder", []);

  const [orderID, setOrderID] = useState("");
  const [invoice, setInvoice] = useState("");
  const [lotID, setLotID] = useState("");
  const [sku, setSku] = useState("");

  const confirmOrder = (_orderID, _invoice, _lotID, _sku) => {
    setOrderID(_orderID);
    setInvoice(_invoice);
    setLotID(_lotID);
    setSku(_sku);

    send(orderID, invoice, lotID, sku);
  };

  return { confirmOrder, state };
};

export default useConfirmOrder;
