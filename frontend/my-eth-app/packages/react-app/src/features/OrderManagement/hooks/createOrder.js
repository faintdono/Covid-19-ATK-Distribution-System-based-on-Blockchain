import { useCall,useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { OrderManagement} from "../../contracts/abis";


const OrderManInterface = new utils.Interface(OrderManagement);
const OrderManAddress = 

const useGetNonce = () => {
    const {value, error } = useCall({
        contract: ,
    })
}
export const useCreateOrder = ()