export {};
// import React, { useCallback, useEffect, useState } from "react";
// import { Box, Grid,   List, ListItem, ListIcon, } from "@chakra-ui/react"
// import { AddIcon } from '@chakra-ui/icons'

// import WalletConnectProvider from "@walletconnect/web3-provider";
// import "antd/dist/antd.css";
// import ReactJson from "react-json-view";
// import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
// import Web3Modal from "web3modal";
// import "./App.css";
// import { Biconomy } from "@biconomy/mexa";
// import { Account, Address, AddressInput, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
// import { INFURA_ID, NETWORK, NETWORKS } from "../../constants";
// import { Transactor } from "../../helpers";
// import {
//   useBalance,
//   useContractLoader,
//   useContractReader,
//   useEventListener,
//   useExchangePrice,
//   useGasPrice,
//   useOnBlock,
//   useUserSigner,
// } from "../../hooks";

// const { BufferList } = require("bl");
// const sigUtil = require("eth-sig-util");
// // https://www.npmjs.com/package/ipfs-http-client
// const ipfsAPI = require("ipfs-http-client");

// const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

// const { ethers } = require("ethers");

// // Components

// const targetNetwork = NETWORKS.mumbai; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// // helper function to "Get" from IPFS
// // you usually go content.toString() after this...
// const getFromIPFS = async (hashToGet: string) => {
//   for await (const file of ipfs.get(hashToGet)) {
//     console.log(file.path);
//     if (!file.content) continue;
//     const content = new BufferList();
//     for await (const chunk of file.content) {
//       content.append(chunk);
//     }
//     console.log(content);
//     return content;
//   }
// };

// // The transactor wraps transactions and provides notificiations
// const tx = Transactor(userSigner, gasPrice);

// const Markers = (props) => {
//   // Load in your local 📝 contract and read a value from it:
//   const readContracts = useContractLoader(localProvider);

//   // If you want to make 🔐 write transactions to your contracts, use the userSigner:
//   const writeContracts = useContractLoader(userSigner, { chainId: localChainId });

//   // keep track of a variable from the contract in the local React state:
//   const balance = useContractReader(readContracts, "Fraternal", "balanceOf", [address]);
//   console.log("🤗 balance:", balance);

//     // 📟 Listen for broadcast events
//     const transferEvents = useEventListener(readContracts, "Fraternal", "Transfer", localProvider, 1);
//     console.log("📟 Transfer events:", transferEvents);

//   return (
//     <Box textAlign="center" fontSize="xl">
//       <Grid minH="100vh" p={10}>

// <Contract
// name="Fraternal"
// signer={userSigner}
// provider={localProvider}
// blockExplorer={blockExplorer}
// // address={address}
// customContract={undefined} account={undefined} gasPrice={undefined} show={undefined} price={undefined} chainId={undefined}
// />

//       </Grid>
//   </Box>
//   )
// }

// export default Markers;
