import React from "react";
import { Text, Heading, Stack, Container } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import HomeMap from "../../views/Home";

const Home = props => {
  return (
    <div>
      <Container maxW={"5xl"}>
        <HomeMap />
      </Container>
    </div>
  );
};

export default Home;
