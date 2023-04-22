import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "../pages";

const Routing = () => (
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
);

export default Routing;
