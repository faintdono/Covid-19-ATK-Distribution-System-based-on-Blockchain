import { Contract } from "@ethersproject/contracts";
import React, { useEffect, useState } from "react";
import Routing from "./routes";
import { NavBar } from "./components";

function App() {
  return (
    <>
      <NavBar />
      <Routing />
    </>
  );
}

export default App;
