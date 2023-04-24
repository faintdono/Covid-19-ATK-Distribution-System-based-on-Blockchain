import React from "react";
import { useEthers } from "@usedapp/core";
import useGetter from "../../hooks/useGetter";
import Ledger from "../Ledger";

const UserKey = () => {
  const { account } = useEthers();
  const values = useGetter("getUserKey", account);
  let Keys = [];
  if (values === undefined) {
    return <div>loading...</div>;
  } else {
    Keys = values;
  }
  return (
    <div>
      <div className="column">
        <article className="menu">
          <div className="menu-label">Keys</div>
          <div class="menu-list">
            {Keys.map((key) => (
              <ul>
                <li key={key.id}>
                  <Ledger K={key} />
                </li>
              </ul>
            )).reverse()}
          </div>
        </article>
      </div>
    </div>
  );
};
export default UserKey;
