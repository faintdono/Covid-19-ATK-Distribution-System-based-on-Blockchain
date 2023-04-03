import { useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const supplyChainInterface = new utils.Interface(abis.SupplyChain);
const supplyChainAddress = addresses.supplyChain;
const scContract = new Contract(supplyChainAddress, supplyChainInterface);

const useAddProduct = () => {
  const { state, send } = useContractFunction(scContract, "addProduct", {
    transactionName: "Sell Product",
  });

  return { state, send };
};

export default useAddProduct;
