import React from "react";
import useIsManufacturer from "../../../Registration/hooks/useIsManufacturer";
import { useEthers } from "@usedapp/core";

const SideMenu = () => {
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
            <a>Add Product</a>
          </li>
          <li>
            <a>Sell Product</a>
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
            <a>Sell Product</a>
          </li>
          <li>
            <a>Update Ledger Key</a>
          </li>
        </ul>
      </aside>
    );
  }
};

export default SideMenu;
