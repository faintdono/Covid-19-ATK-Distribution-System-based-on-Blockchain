import styled from "styled-components";
import {
  shortenAddress,
  useCall,
  useEthers,
  useLookupAddress,
} from "@usedapp/core";
import React, { useEffect, useState } from "react";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const { ens } = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);
  return (
    <div
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </div>
  );
}

export const NavBar = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a
        class="navbar-item"
        href="https://https://github.com/faintdono/Covid-19-ATK-Distribution-System-based-on-Blockchain"
      >
        <img src="./logo-brand.png" alt="" width="112" height="28" />
      </a>
    </div>
    <div className="navbar-menu">
      <div className="navbar-end">
        <a href="/" className="navbar-item">
          Home
        </a>
        <a href="/orders" className="navbar-item">
          Order
        </a>
        <div className="navbar-item has-dropdown is-hoverable">
          <div className="navbar-link">More</div>
          <div className="navbar-dropdown">
            <a href="/projects" className="navbar-item">
              Projects
            </a>
            <a href="/about" className="navbar-item">
              About
            </a>
          </div>
        </div>
        <div className="navbar-item">
          <div className="button is-primary">
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  margin-top: 40px;
`;

export const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  margin: 0px 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
`;

export const Container = styled.div`
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  height: calc(100vh);
`;

export const Header = styled.header`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: 70px;
`;

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 8px;
`;
