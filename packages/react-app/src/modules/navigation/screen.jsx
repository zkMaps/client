import React from "react";

// Components
import NavBar from "../../components/navBar";
import Home from "../home";
import Profile from "../profile";
import Subgraph from "../../views/Subgraph";

const GeneralNavigation = () => {
  return (
    <div style={{ height: "100vh" }}>
      <NavBar />
      <Home path="/" />
      {/* TODO: make available only when testing */}
      <Subgraph path="subgraph" />
    </div>
  );
};

export default GeneralNavigation;
