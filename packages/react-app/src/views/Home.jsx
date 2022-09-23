import React, { useState, useEffect } from "react";
import { utils } from "ffjavascript";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Row, Button, Alert } from "antd";
import { icon } from "leaflet";

import "leaflet/dist/leaflet.css";

// Hooks
import useFlyTo from "../hooks/FlyTo";

// Components
import CornerButtons from "../components/CornerButtons";
import ModalIntro from "../components/ModalIntro";

// Constants
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

// Constants

/* Circon multiplier example */
let wasmFile =
  "https://gateway.pinata.cloud/ipfs/QmdBE3yZahaVbVXmHJHQnHvGQL8JtevJToTP1g6WkJ1hQP?filename=multiplier2.wasm";
let zkeyFile =
  "https://gateway.pinata.cloud/ipfs/Qmb4KF1F6UjYFH2c9ehvqiM4q5jMdCB8FmGUDjztRYLa8Z?filename=multiplier2_0001.zkey";
let publicConstraint =
  "https://gateway.pinata.cloud/ipfs/QmdrjaYAXtW59WMLEDoi6fGRDoQWNgMJzxGcs8N4Y6efvG?filename=public.json";
let verification_key =
  "https://gateway.pinata.cloud/ipfs/QmNtP68qhqvDNLMdSFkfNi5D3LYfWSyyUb8XPUPqdWuSA4?filename=verification_key.json";
const proofInput = { a: 3, b: 11 };

/* AtEthDenver */
// let wasmFile =
//   "https://gateway.pinata.cloud/ipfs/QmPyAbDi2EwesWSNWyYSresj4ZwRLsVoQXagoD7eDQbBDv?filename=AtEthDenver.wasm";
// let zkeyFile =
//   "https://gateway.pinata.cloud/ipfs/QmPyfF2k7wTKGibSKnh6eW3ibVhZDYoTUS1GdqcxVoZ3GX?filename=AtEthDenver_0001.zkey";
// let publicConstraint = "https://gateway.pinata.cloud/ipfs/QmdCe5TJW3nAcXYbnXqLf9JGyodSgek6mKwSK9mxzn6ejx";
// const proofInput = {
//     latitude: 12973547807205024,
//     longitude: 7500977777251779,
//  };

/* AtColorado */
// let wasmFile =
//   "https://gateway.pinata.cloud/ipfs/QmaKTiHhWWGLhgX3s8rjqy8TQT7i34Cz6f9voG8H7YdUrJ?filename=InColorado.wasm";
// let zkeyFile =
//   "https://gateway.pinata.cloud/ipfs/QmRDFEoFJbp9VuFbiVacF5B1PPVmDaJiczTcy43t4HX9ep?filename=InColorado_0001.zkey";
// let publicConstraint =
//   "https://gateway.pinata.cloud/ipfs/QmVhhVZj2wT2ZhFr8JPqM69ZPEM8AqaSEdgGNCKsXP6GS2?filename=InColoradoPublic.json";

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

function Home({ address, userSigner }) {
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

  const runProofs = async () => {
    try {
      if (!address) {
        setMessage({ text: "You need to connect your account.", type: "error" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        return;
      }
      // const proofInput = {
      //   // longitude: withPrecision
      //   //   ? Math.trunc((longitude + 180) * 1000)
      //   //   : Math.trunc((longitude + 180) * Math.pow(10, 14)),
      //   // latitude: withPrecision ? Math.trunc((latitude + 90) * 1000) : Math.trunc((latitude + 90) * Math.pow(10, 14)),
      // };
      const { proof: _proof, publicSignals: _public } = await makeProof(proofInput, wasmFile, zkeyFile);

      setIsVerifying(true);

      _proof.protocol = "groth16";
      console.log("🚀 ~ file: Home.jsx ~ line 257 ~ runProofs ~ _proof", _proof);
      setProof(JSON.stringify(_proof, null, 2));
      setSignals(JSON.stringify(_public, null, 2));

      const vkey = await fetch(verification_key).then(res => {
        return res.json();
      });

      // const pub = ["33"];
      const pub = await fetch(publicConstraint).then(res => {
        return res.json();
      });

      // TODO: Test what happens with AtEthDenver and InColorado
      const localVerification = await window.snarkjs.groth16.verify(vkey, pub, _proof);

      if (localVerification) {
        const callData = await zkeyExportSolidityCalldata(_proof, {}, pub);
        const callDataFormatted = JSON.parse("[" + callData.replace(/}{/g, "},{") + "]");

        // const tx = await readContracts.Verifier.verifyProof(...callDataFormatted);
        // const recipt = await tx?.wait(2);
        // const decodeOutput = ethers.utils.defaultAbiCoder.decode(["bool"], ethers.utils.hexDataSlice(tx.data, 4));

        let iface = new ethers.utils.Interface(Verifier);
        let verifier = new ethers.Contract("0xffdb60e666ae25fe5d79ff66680c828902de90cc", iface, userSigner);
        let decodeOutput = await verifier.verifyProof(...callDataFormatted);

        if (decodeOutput[0] && localVerification) {
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
      } else {
        setMessage({ text: "Your location doesn't meet the requirements. Try again.", type: "error" });
        setIsVerifying(false);
      }
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
      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Button
            key="runProofs"
            style={{
              verticalAlign: "center",
              marginLeft: 8,
              backgroundColor: isCtaHovered && isValid ? "red" : isValid ? "green" : "transparent",
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
        </Row>
      </div>
      <CornerButtons />
    </div>
  );
}

export default Home;
