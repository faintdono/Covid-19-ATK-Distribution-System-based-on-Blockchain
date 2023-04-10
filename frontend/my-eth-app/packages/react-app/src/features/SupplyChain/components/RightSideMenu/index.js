import React from "react";
import { useEthers } from "@usedapp/core";
import useGetUserKey from "../../hooks/useGetUserKey";
import History from "../History";
const RightSideMenu = () => {
  const { account } = useEthers();
  const values = useGetUserKey(account);
  let Keys = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    Keys = values;
  }
  return (
    <ul>
      {Keys.map((key) => (
        <li key={key.id}>
          <div className="buttons">
            <History />
            <button className="button is-link is-outlined">Mockup</button>
          </div>
        </li>
      )).reverse()}
    </ul>
  );
};

export default RightSideMenu;
