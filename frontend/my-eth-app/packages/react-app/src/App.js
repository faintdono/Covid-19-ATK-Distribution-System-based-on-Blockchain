import React, { useEffect, useState } from "react";
import Routing from "./routes";
import NavBar from "./components/Navbar";

function App() {
  return (
    <>
      <NavBar />
      <Routing />
    </>
  );
}

export default App;
