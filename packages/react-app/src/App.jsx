import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RecoilRoot, useSetRecoilState } from "recoil";

// Recoil
import { localProviderAtom } from "./recoil/hardhat";

// Components
import GeneralNavigation from "./modules/navigation/screen";

// helper
// import useSetProvider from './hooks/useSetProvider';

const theme = extendTheme({
  colors: {
    brand: {
      100: "#afcfff",
      200: "#7db0ff",
      300: "#4b90ff",
      400: "#1a70ff",
      500: "#0057e6",
      600: "#0043b4",
      700: "#003082",
      800: "#001d51",
      900: "#000a21",
    },
  },
});

const App = () => (
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <AppWithProviders />
    </ChakraProvider>
  </RecoilRoot>
);

export default App;

const AppWithProviders = () => {
  const setLocalProviderAtom = useSetRecoilState(localProviderAtom);
  // const localProvider = useSetProvider()
  // setLocalProviderAtom(localProvider);

  // General checks
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
  //     console.log("💵 yourLocalBalance", yourLocalBalance ? utils.formatEther(yourLocalBalance) : "...");
  //     console.log("💵 yourMainnetBalance", yourMainnetBalance ? utils.formatEther(yourMainnetBalance) : "...");
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

  // let networkDisplay = "";
  // if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
  //   const networkSelected = NETWORK(selectedChainId);
  //   const networkLocal = NETWORK(localChainId);
  //   if (selectedChainId === 1337 && localChainId === 31337) {
  //     networkDisplay = (
  //       <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
  //         <Alert
  //           message="⚠️ Wrong Network ID"
  //           description={
  //             <div>
  //               You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
  //               HardHat.
  //               <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
  //             </div>
  //           }
  //           type="error"
  //           closable={false}
  //         />
  //       </div>
  //     );
  //   } else {
  //     networkDisplay = (
  //       <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
  //         <Alert
  //           message="⚠️ Wrong Network"
  //           description={
  //             <div>
  //               You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
  //               <Button
  //                 onClick={async () => {
  //                   const ethereum = window.ethereum;
  //                   const data = [
  //                     {
  //                       chainId: "0x" + targetNetwork.chainId.toString(16),
  //                       chainName: targetNetwork.name,
  //                       nativeCurrency: targetNetwork.nativeCurrency,
  //                       rpcUrls: [targetNetwork.rpcUrl],
  //                       blockExplorerUrls: [targetNetwork.blockExplorer],
  //                     },
  //                   ];
  //                   console.log("data", data);
  //                   const tx = await ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
  //                   if (tx) {
  //                     console.log(tx);
  //                   }
  //                 }}
  //               >
  //                 <b>{networkLocal && networkLocal.name}</b>
  //               </Button>
  //               .
  //             </div>
  //           }
  //           type="error"
  //           closable={false}
  //         />
  //       </div>
  //     );
  //   }
  // } else {
  //   networkDisplay = (
  //     <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
  //       {targetNetwork.name}
  //     </div>
  //   );
  // }

  return <GeneralNavigation />;
};
