import React, { useEffect } from "react";
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
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof screen?.orientation !== "undefined") {
      // Set message to let users know that this is better used in mobile
    }
  }, []);

  return <GeneralNavigation />;
};
