import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import useGetUserKey from "../../hooks/useGetUserKey";

import LedgerKey from "../LedgerKey";
import History from "../History";
const ListUserKey = () => {
  const { account } = useEthers();
  const values = useGetUserKey(account);
  let Keys = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    Keys = values;
  }

  return (
    <div>
      <ul>
        {Keys.map((key) => (
          <li key={key.id}>
            <LedgerKey K={key} />
          </li>
        )).reverse()}
      </ul>
    </div>
  );
};

export default ListUserKey;
