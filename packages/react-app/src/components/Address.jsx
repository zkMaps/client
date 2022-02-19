import React from "react";
import { useColorMode, Text, Flex, IconButton, useClipboard } from "@chakra-ui/react";
import { Skeleton } from "antd";
import Blockies from "react-blockies";
import { CopyIcon } from "@chakra-ui/icons";
import { useLookupAddress } from "eth-hooks/dapps/ens";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {
  const address = props.value || props.address;

  const { hasCopied, onCopy } = useClipboard(address);

  const ens = useLookupAddress(props.ensProvider, address);

  const { colorMode } = useColorMode();

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = `${address.substr(0, 4)}...${address.substr(-4)}`;

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <a
          style={{ color: colorMode === "light" ? "#222222" : "#ddd" }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <>
        <a
          style={{ color: colorMode === "light" ? "#222222" : "#ddd" }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Text bgGradient="linear(to-l, #ddd, #00D4FC)" bgClip="text" fontWeight="extrabold">
            {displayAddress}
          </Text>
        </a>
        <IconButton aria-label="Copy address" icon={<CopyIcon />} onClick={onCopy} background="transparent" />
      </>
    );
  } else {
    text = (
      <>
        <a
          style={{ color: colorMode === "light" ? "#0021F4" : "#ddd" }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Text bgGradient="linear(to-l, #ddd, #00D4FC)" bgClip="text" fontWeight="extrabold">
            {displayAddress}
          </Text>
        </a>
        <IconButton aria-label="Copy address" icon={<CopyIcon />} onClick={onCopy} background="transparent" />
      </>
    );
  }

  return (
    <>
      {/* <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 18, width: "auto"}}>
        <Blockies seed={address.toLowerCase()} />
      </span> */}
      <Flex style={{ alignSelf: "center" }}>{text}</Flex>
    </>
  );
}
