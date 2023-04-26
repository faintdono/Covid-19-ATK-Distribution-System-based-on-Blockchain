import React from "react";
import useIsManufacturer from "../../../Registration/hooks/useIsManufacturer";
import { useEthers } from "@usedapp/core";
import AddProduct from "../AddProduct";
import SellProduct from "../SellProduct";
import UpdateLedger from "../UpdateLedger";
import ReturnProduct from "../ReturnProduct";

const LeftSideMenu = () => {
  const { account } = useEthers();
  const value = useIsManufacturer(account);

  function waitingForValue() {
    if (value !== undefined) {
      return value;
    }
  }
  const condition = waitingForValue();

  if (condition === true) {
    return (
      <aside class="menu">
        <p class="menu-label">Function</p>
        <ul class="menu-list">
          <li>
            <AddProduct />
          </li>
          <li>
            <SellProduct />
          </li>
        </ul>
      </aside>
    );
  } else {
    return (
      <aside class="menu">
        <p class="menu-label">Function</p>
        <ul class="menu-list">
          <li>
            <SellProduct />
          </li>
          <li>
            <UpdateLedger />
          </li>
          <li>
            <ReturnProduct />
          </li>
        </ul>
      </aside>
    );
  }
};

export default LeftSideMenu;
