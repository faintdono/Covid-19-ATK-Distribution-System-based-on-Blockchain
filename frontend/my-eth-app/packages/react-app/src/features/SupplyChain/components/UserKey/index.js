import React from "react";
import { useEthers } from "@usedapp/core";
import useGetUserKey from "../../hooks/useGetUserKey";
import Ledger from "../Ledger";

const MiddleAndRight = () => {
  const { account } = useEthers();
  const values = useGetUserKey(account);
  let Keys = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    Keys = values;
  }
  return (
    <>
      {Keys.map((key) => (
        <>
          <div className="column">
            <ul>
              <li key={key.id}>
                <Ledger K={key} />
                
              </li>
            </ul>
          </div>
          <div className="column is-one-fifth">
            <div className="buttons">
              <ul>
                <li key={key.id}>
                  {/* <History K={key}/> */}
                </li>
              </ul>
            </div>
          </div>
        </>
      )).reverse()}
    </>
  );
};
export default MiddleAndRight;
