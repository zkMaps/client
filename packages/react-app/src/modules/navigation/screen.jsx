import React from "react";

// Components
import NavBar from "../../components/navBar";
import Home from "../home";
// import Transfers from "../transfers";
import Profile from "../profile";
import Subgraph from "../../views/Subgraph";

const GeneralNavigation = () => {
  return (
    <div style={{ height: "100vh" }}>
      <NavBar />
        <Home path="/" />
        {/* <Markers path="markers"/> */}
        {/* <Transfers path="transfers" /> */}
        {/* <Profile path="profile" /> */}
        {/* TODO: make available only when testing */}
        <Subgraph path="subgraph" />
    </div>
  );
};

export default GeneralNavigation;
