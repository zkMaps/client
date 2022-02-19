import React, { useCallback, useEffect, useState } from "react";
import { Button, Alert, AlertIcon, AlertDescription, AlertTitle, Text, Link, Flex } from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from "recoil";
// import { Link as ReachLink } from "@reach/router"
import WalletConnectProvider from "@walletconnect/web3-provider";
import "antd/dist/antd.css";
import Web3Modal from "web3modal";
import { RouteComponentProps } from "@reach/router";
// import { Biconomy } from "@biconomy/mexa";

import { Account } from "../..";
import { INFURA_ID, NETWORK, NETWORKS } from "../../../constants";
import { useGasPrice, useUserSigner } from "../../../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useContractLoader, useOnBlock } from "eth-hooks";
// import ipfsAPI from "ipfs-http-client";

// Recoil
import { contractAtom } from "../../../recoil/contract";
import { addressAtom, providerAtom, injectedProviderAtom } from "../../../recoil/walletData";

// TODO: Bring list of contracts to set up layer data
// import contractsDetails from './contracts/hardhat_contracts.json'
// const whitelist = ["Fraternal", "YourCollectible"];

const { BufferList } = require("bl");
const sigUtil = require("eth-sig-util");
// https://www.npmjs.com/package/ipfs-http-client
// const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
const { ethers } = require("ethers");

/*
    Code:
    https://github.com/austintgriffith/scaffold-eth
  
    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.mumbai; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

let faucetHint = "";

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
// TODO: Add .env file
const BICONOMY_API_KEY = "iNGTv-9Vu.8622c43f-634e-4d30-8f51-b060cb241f88"; // <------- make sure to use the correct API Key as per the network

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  // for await (const file of ipfs.get(hashToGet)) {
  //   console.log(file.path);
  //   if (!file.content) continue;
  //   const content = new BufferList();
  //   for await (const chunk of file.content) {
  //     content.append(chunk);
  //   }
  //   console.log(content);
  //   return content;
  // }
};

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const _localprovider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  // FIXME: Clear only recoil (this also clears theme preference)
  localStorage.clear(); //for localStorage
  sessionStorage.clear(); //for sessionStorage
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

const Wallet = (props: RouteComponentProps) => {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [biconomy, setBiconomy] = useState();

  // Recoil
  const currentContract: any = useRecoilValue(contractAtom);
  const [address, setAddress]: any = useRecoilState(addressAtom);
  const [localprovider, setProvider]: any = useRecoilState(providerAtom);
  const [injectedProvider, setInjectedProvider] = useRecoilState(injectedProviderAtom);
  const label = currentContract?.label ? currentContract?.label : "";

  // const getBiconomy = (provider, apiKey) => {
  //   return new Biconomy(provider, {
  //     apiKey,
  //     debug: true,
  //   });
  // };

  // useEffect(() => {
  //   if (biconomy) {
  //     biconomy
  //       .onEvent(biconomy.READY, () => {
  //         console.log(biconomy.status);
  //         console.log("Biconomy is READY");
  //       })
  //       .onEvent(biconomy.ERROR, (error, message) => {
  //         console.log("Error while using Biconomy", error);
  //         console.log(message);
  //       });
  //   }
  // }, [biconomy]);

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = 10; // useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // if (!biconomy && _localprovider) {
  //   const bico = getBiconomy(_localprovider, BICONOMY_API_KEY);
  //   setBiconomy(bico);
  // }

  const userSigner: any = useUserSigner(injectedProvider, biconomy);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = _localprovider && _localprovider._network && _localprovider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // Load in your local 📝 contract and read a value from it:
  const readContracts: any = useContractLoader(_localprovider);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, label, "Transfer", _localprovider, 1);

  // Effects
  useEffect(() => {
    setProvider(_localprovider);
  }, [_localprovider]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  // //
  // // 🧫 DEBUG 👨🏻‍🔬
  // //
  // useEffect(() => {
  //   if (
  //     DEBUG &&
  //     mainnetProvider &&
  //     address &&
  //     selectedChainId &&
  //     yourLocalBalance &&
  //     yourMainnetBalance &&
  //     readContracts &&
  //     writeContracts &&
  //     mainnetContracts
  //   ) {
  //     console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
  //     console.log("🌎 mainnetProvider", mainnetProvider);
  //     console.log("🏠 localChainId", localChainId);
  //     console.log("👩‍💼 selected address:", address);
  //     console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
  //     console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
  //     console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
  //     console.log("📝 readContracts", readContracts);
  //     console.log("🌍 DAI contract on mainnet:", mainnetContracts);
  //     console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
  //     console.log("🔐 writeContracts", writeContracts);
  //   }
  // }, [
  //   mainnetProvider,
  //   address,
  //   selectedChainId,
  //   yourLocalBalance,
  //   yourMainnetBalance,
  //   readContracts,
  //   writeContracts,
  //   mainnetContracts,
  // ]);

  let networkDisplay: any = null;
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            closable={false}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wrong Network ID
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
              HardHat.
              <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
            </AlertDescription>
          </Alert>
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            closable={false}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wrong Network
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                {networkLocal && networkLocal.name}.
              </div>
              <Button
                onClick={async () => {
                  const ethereum = window.ethereum;
                  const data = [
                    {
                      chainId: "0x" + targetNetwork.chainId.toString(16),
                      chainName: targetNetwork.name,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer],
                    },
                  ];
                  console.log("data", data);
                  const tx = await ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
                  if (tx) {
                    console.log(tx);
                  }
                }}
              >
                <br />
                <b>Connect to {networkLocal && networkLocal.name}</b>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  } else {
    networkDisplay = <Text fontSize="xs">{targetNetwork.name}</Text>;
  }

  // const loadWeb3Modal = useCallback(async () => {
  //   const provider = await web3Modal.connect();

  //   let _biconomy = getBiconomy(new ethers.providers.Web3Provider(provider), BICONOMY_API_KEY);

  //   setBiconomy(_biconomy);

  //   setInjectedProvider(new ethers.providers.Web3Provider(_biconomy));

  //   provider.on("chainChanged", chainId => {
  //     console.log(`chain changed to ${chainId}! updating providers`);
  //     _biconomy = getBiconomy(new ethers.providers.Web3Provider(provider), BICONOMY_API_KEY);
  //     setBiconomy(_biconomy);
  //     setInjectedProvider(new ethers.providers.Web3Provider(_biconomy));
  //   });

  //   provider.on("accountsChanged", () => {
  //     console.log(`account changed!`);
  //     setInjectedProvider(new ethers.providers.Web3Provider(_biconomy));
  //   });

  //   // Subscribe to session disconnection
  //   provider.on("disconnect", (code, reason) => {
  //     console.log(code, reason);
  //     setBiconomy();
  //     logoutOfWeb3Modal();
  //   });
  // }, [setInjectedProvider]);
  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId: number) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div style={{ alignContent: "center" }}>
      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <Account
        address={address}
        localProvider={_localprovider}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
        minimized={undefined}
      />

      <Flex style={{ alignItems: "center", alignContent: "center", justifyContent: "center" }}>
        {networkDisplay}
        {web3Modal && web3Modal.cachedProvider && (
          <>
            <Text fontSize="xs" mx={2}>
              {" "}
              |{" "}
            </Text>
            <Link onClick={logoutOfWeb3Modal} fontSize="xs">
              disconnect
            </Link>
          </>
        )}
      </Flex>
      {faucetHint}
    </div>
  );
};

export default Wallet;
