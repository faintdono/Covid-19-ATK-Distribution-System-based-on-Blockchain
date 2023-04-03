import { useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const OrderManInterface = new utils.Interface(abis.OrderManagement);
const OrderManAddress = addresses.orderManagement;
const omContract = new Contract(OrderManAddress, OrderManInterface);

const useGetNonce = () => {
  const { value, error } =
    useCall({ contract: omContract, method: "getNonce", args: [] }) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};

export default useGetNonce;
