import React, { useState, useEffect } from "react";
import { utils } from "ffjavascript";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, Alert } from "antd";
import { icon } from "leaflet";

import "leaflet/dist/leaflet.css";

// Hooks
import useFlyTo from "../hooks/FlyTo";

// Components
import ModalIntro from "../components/ModalIntro";
import LayerSwitch from "../components/LayerSwitch";

// Constants
import { ASSETS } from "../constants";
import marker from "../logo-black.png";
var customMarkerIcon = icon({
  iconUrl: marker,
  iconSize: [30, 60], // size of the icon// point from which the popup should open relative to the iconAnchor
});

const { ethers } = require("ethers");

// Original: 0xB5217d3E37F12F89138113534953E1b9583e4F3B
// https://mumbai.polygonscan.com/address/0xffdb60e666ae25fe5d79ff66680c828902de90cc
const Verifier = [
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "a",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[2][2]",
        name: "b",
        type: "uint256[2][2]",
      },
      {
        internalType: "uint256[2]",
        name: "c",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[1]",
        name: "input",
        type: "uint256[1]",
      },
    ],
    name: "verifyProof",
    outputs: [
      {
        internalType: "bool",
        name: "r",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const { unstringifyBigInts } = utils;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

const settings = {
  // scrollZoom: true,
  boxZoom: false,
  dragRotate: false,
  dragPan: false,
  doubleClickZoom: false,
  // keyboard: true,
  // touchZoomRotate: true,
  // touchPitch: true,
  // minZoom: 0,
  // maxZoom: 20,
  // minPitch: 0,
  // maxPitch: 85
  showCompass: true,
};

function Verify({ writeContracts, address, injectedProvider, readContracts, userSigner }) {
  // you can also use hooks locally in your component of choice

  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [message, setMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(ASSETS[0]);
  const [map, setMap] = useState(null);

  // custom hooks
  useFlyTo(map, setViewState, 13);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  // Handlers
  const zkeyExportSolidityCalldata = async (_proof, options, _publicConstraint) => {
    const pub = unstringifyBigInts(_publicConstraint);
    const proof = unstringifyBigInts(_proof);

    let res;
    if (proof.protocol === "groth16") {
      // res = await groth16ExportSolidityCallData(proof, pub);
      res = await window.snarkjs.groth16.exportSolidityCallData(proof, pub);
    } else if (proof.protocol === "plonk") {
      res = await window.snarkjs.plonk.exportSolidityCallData(proof, pub);
    } else {
      throw new Error("Invalid Protocol");
    }
    return res;
  };

  const makeProof = async (_proofInput, _wasm, _zkey) => {
    try {
      const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
      return { proof, publicSignals };
    } catch (error) {
      setMessage({ text: "You are outside of the proof zone.", type: "error" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      throw error;
    }
  };

  const onChainVerification = async (_proof, pub) => {
    try {
      const callData = await zkeyExportSolidityCalldata(_proof, {}, pub);
      const callDataFormatted = JSON.parse("[" + callData.replace(/}{/g, "},{") + "]");

      // const tx = await readContracts.Verifier.verifyProof(...callDataFormatted);
      // const recipt = await tx?.wait(2);
      // const decodeOutput = ethers.utils.defaultAbiCoder.decode(["bool"], ethers.utils.hexDataSlice(tx.data, 4));

      let iface = new ethers.utils.Interface(Verifier);
      let verifier = new ethers.Contract(selectedOption?.contractAddr, iface, userSigner);
      let decodeOutput = await verifier.verifyProof(...callDataFormatted);

      if (decodeOutput[0]) {
        setIsVerifying(false);
        setIsValid(true);
        setMessage({ text: "You have verified your location!", type: "success" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        setIsVerifying(false);
        setMessage({ text: "Your location doesn't meet the requirements. Try again.", type: "error" });
        forgetProofs();
      }
    } catch (error) {
      console.error(error);
      setIsVerifying(false);
    }
  };

  const runProofs = async () => {
    try {
      if (!address) {
        setMessage({ text: "You need to connect your account.", type: "error" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        return;
      }
      setIsVerifying(true);
      const proofInput = {
        point: [11, 14],
        polygon: [
          [10, 10],
          [10, 15],
          [15, 15],
          [15, 10],
        ],
      };
      // {
      //   point: [148536797790103940, 25584533691406236],
      //   polygon: [
      //     [148236797790103940, 25084533691406236],
      //     [149008262954913280, 25084533691406236],
      //     [149008262954913280, 26427612304687492],
      //     [148236797790103940, 26427612304687492],
      //   ],
      // };

      // {
      //   point: [
      //     Math.trunc((viewState?.latitude + 180) * Math.pow(10, 15)),
      //     Math.trunc((viewState?.longitude + 90) * Math.pow(10, 15)),
      //   ],
      //   polygon: selectedOption?.zone,
      // };
      // console.log("🚀 ~ file: Verify.jsx ~ line 200 ~ runProofs ~ proofInput", JSON.stringify(proofInput));
      const { proof: _proof, publicSignals: _public } = await makeProof(
        proofInput,
        selectedOption?.wasmFile,
        selectedOption?.zkeyFile,
      );

      _proof.protocol = "groth16";
      setProof(JSON.stringify(_proof, null, 2));
      setSignals(JSON.stringify(_public, null, 2));

      // const vkey = await fetch(selectedOption?.verification_key).then(res => {
      //   return res.json();
      // });

      // const pub = ["33"];
      const pub = await fetch(selectedOption?.publicConstraint).then(res => {
        return res.json();
      });

      // TODO: Check if we end up checking proof locally
      await onChainVerification(_proof, pub);
      return;

      // TODO: Test what happens with AtEthDenver and InColorado
      // const localVerification = await window.snarkjs.groth16.verify(vkey, pub, _proof);

      // if (localVerification) {
      //   onChainVerification(_proof, pub);
      // } else {
      //   setMessage({ text: "Your location doesn't meet the requirements. Try again.", type: "error" });
      //   setIsVerifying(false);
      // }
      // console.log({ recipt.past});
    } catch (error) {
      setIsVerifying(false);
      forgetProofs();
      console.error(error);
    }
  };

  const forgetProofs = async () => {
    setProof(null);
    setSignals(null);
    setIsValid(false);
  };

  const hoverCTA = () => {
    setIsCtaHovered(true);
  };

  const unhoverCTA = () => {
    setIsCtaHovered(false);
  };

  return (
    <div>
      {message && <Alert message={message.text} type={message.type} style={{ padding: 20 }} />}

      <ModalIntro />

      {ASSETS && (
        <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translate(-50%)", zIndex: 10 }}>
          <LayerSwitch layerOptions={ASSETS} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        </div>
      )}

      <div style={{ position: "absolute", top: "60%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
        <Button
          key="runProofs"
          style={{
            backgroundColor: isCtaHovered && isValid ? "red" : isValid ? "green" : "#222222",
          }}
          shape="round"
          size="large"
          onClick={() => {
            isCtaHovered && isValid ? forgetProofs() : runProofs();
          }}
          type="primary"
          loading={isVerifying}
          onMouseEnter={hoverCTA}
          onMouseLeave={unhoverCTA}
        >
          {isCtaHovered && isValid
            ? "Forget proof"
            : isValid
            ? "Verified"
            : isVerifying
            ? "verifying proof"
            : `ZK prove your location`}
        </Button>
      </div>

      <MapContainer
        ref={setMap}
        style={{ width: "100%", height: "100vh", zIndex: 0 }}
        center={[viewState?.latitude, viewState?.longitude]}
        zoom={viewState.zoom}
        scrollWheelZoom={false}
      >
        {/* https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png */}
        <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[viewState?.latitude, viewState?.longitude]} icon={customMarkerIcon}>
          <Popup>
            You are here. <br /> Press "zk Proof your location" button to verify where you are maintaining your privacy.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Verify;
