import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home, About, Order, Product } from "../pages";

const Routing = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/orders" element={<Order />} />
    <Route path="/product" element={<Product />} />
  </Routes>
);

export default Routing;
