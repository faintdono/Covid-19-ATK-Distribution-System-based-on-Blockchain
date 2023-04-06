import { useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import { addresses, abis } from "@my-app/contracts";

const RegistrationInterface = new utils.Interface(abis.Registration);
const RegistrationAddress = addresses.registraton;
const rgContract = new Contract(RegistrationAddress, RegistrationInterface);

const useIsManufacturer = (func, arg) => {
  const { value, error } =
    useCall({ contract: rgContract, method: func, args: [arg] }) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};

export default useIsManufacturer;
