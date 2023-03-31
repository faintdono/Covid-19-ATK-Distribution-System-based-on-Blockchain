import React from "react";
import { useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const OrderManInterface = new utils.Interface(abis.OrderManagement);
const OrderManAddress = addresses.orderManagement;
const omContract = new Contract(OrderManAddress, OrderManInterface);

const useGetNonce = () => {
  const { value, error } = useCall(omContract, "getNonce", []);
  //   const date = new Date();
  //   const day = date.getDate();
  //   const month = date.getMonth() + 1;
  //   const year = date.getFullYear();
  //   const nonce = value.toString();
  //   const step = nonce.length / 3;
  //   let finalString = "OD";
  //   for (var x = 0; x < 3; x++) {
  //     var start = step * x;
  //     var end = start + step;
  //     var part = nonce.substring(start, end);
  //     finalString += part;
  //     if (x === 0) {
  //       finalString += year;
  //     } else if (x === 1) {
  //       finalString += month;
  //     } else if (x === 2) {
  //       finalString += day;
  //     }
  //   }
  return { value, error };
};

export default useGetNonce;
