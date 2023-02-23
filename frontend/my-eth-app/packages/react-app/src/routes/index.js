import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Order from "../pages/Order";


const Project = () => <h1>Project</h1>;

const Routing = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/orders" element={<Order />} />
    <Route path="/projects" element={<Project />} />
  </Routes>
);

export default Routing;
