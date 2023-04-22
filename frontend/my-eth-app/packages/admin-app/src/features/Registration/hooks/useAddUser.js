import { useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const RegistrationInterface = new utils.Interface(abis.Registration);
const RegistrationAddress = addresses.registraton;
const rgContract = new Contract(RegistrationAddress, RegistrationInterface);

const useAddUser = () => {
  const { state, send } = useContractFunction(rgContract, "addUser", {
    transactionName: "User Added",
  });

  return { state, send };
};

export default useAddUser;
