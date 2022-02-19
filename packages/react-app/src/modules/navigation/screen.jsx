import React from 'react';
import { Router } from "@reach/router";
import {Box} from "@chakra-ui/react"

  // Components
import NavBar from '../../components/navBar';
import Home from "../home";
// import Markers from "../markers";
// import Transfers from "../transfers";
import Profile from "../profile";
import Subgraph from "../../views/Subgraph";

const GeneralNavigation = () => {

  return (
    <Box textAlign="center" fontSize="xl">
        <NavBar />
        <Router>
          <Home path="/" />
          {/* <Markers path="markers"/> */}
          {/* <Transfers path="transfers" /> */}
          <Profile path="profile" />
          {/* TODO: make available only when testing */}
          <Subgraph path="subgraph" />
        </Router>
    </Box>
  )
}

export default GeneralNavigation;
