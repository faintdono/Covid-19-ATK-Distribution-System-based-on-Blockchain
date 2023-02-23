import { Contract } from "@ethersproject/contracts";
import React, { useEffect, useState } from "react";
import Routing from "./routes";
import { NavBar } from "./components";


const About = () => <h1>About</h1>;
const Post = () => <h1>Post</h1>;
const Project = () => <h1>Project</h1>;

function App() {
  return (
    <>
      <NavBar />
      <Routing/>
    </>
  );
}

export default App;
