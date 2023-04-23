import WalletButton from "./WalletButton";
import React from "react";

const NavBar = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a
        class="navbar-item"
        href="https://github.com/faintdono/Covid-19-ATK-Distribution-System-based-on-Blockchain"
      >
        <img src="./logo-brand.png" alt="" width="112" height="28" />
      </a>
    </div>
    <div className="navbar-menu">
      <div className="navbar-end">
        <a href="/" className="navbar-item">
          Home
        </a>
        <div className="navbar-item">
          <div className="button is-primary">
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default NavBar;
