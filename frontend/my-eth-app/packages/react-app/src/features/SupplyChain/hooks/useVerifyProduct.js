import { useState } from "react";
import { useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const supplyChainInterface = new utils.Interface(abis.SupplyChain);
const supplyChainAddress = addresses.supplyChain;
const scContract = new Contract(supplyChainAddress, supplyChainInterface);

const useVerifyProduct = (lotID, sku, manufacturer, expirationDate, key) => {
  const { value, error } =
    useCall({
      contract: scContract,
      method: "verifyProduct",
      args: [lotID, sku, manufacturer, expirationDate, key],
    }) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }

  return value?.[0];
};

export default useVerifyProduct;
