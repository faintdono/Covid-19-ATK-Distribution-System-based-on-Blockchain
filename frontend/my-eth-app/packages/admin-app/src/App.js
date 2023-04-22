import React, { useEffect, useState } from "react";
import Routing from "./routes";
import { NavBar, Footer } from "./components";

function App() {
  return (
    <>
      <NavBar />
      <Routing />
      <Footer />
    </>
  );
}

export default App;
