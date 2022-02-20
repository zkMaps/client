import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { utils } from "ffjavascript";
import Map from "react-map-gl";
import { Row, Button } from "antd";
import { ethers } from "ethers";
import groth16ExportSolidityCallData from "../utils/groth16_exportSolidityCallData"
const snarkjs = require("snarkjs");
const { unstringifyBigInts } = utils;
const withPrecision = false;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

// Constants
// let wasmFile = "~/circuits/AtEthDenver/AtEthDenver.wasm";
let wasmFile = "https://zk-maps.vercel.app/AtEthDenver.wasm";
let zkeyFile = "https://zk-maps.vercel.app/AtEthDenver_0001.zkey";
// let verificationKey = "~/circuits/AtEthDenver/verification_key.json";
let publicConstraint = "~/circuits/AtEthDenver/public.json";

function Home({ yourLocalBalance, writeContracts }) {
  // you can also use hooks locally in your component of choice

  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 39.691566166669446,
    longitude: -104.96286823094337,
    zoom: 18,
    // bearing: 0,
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
    // pitch: 0,
  });
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);

  const { latitude, longitude } = viewState;

  // A circle of 5 mile radius of the Empire State Building
  // const GEOFENCE = turf.circle(newCenter, 5, { units: "miles" });

  // Handlers
  const onMove = React.useCallback(current => {
    // Only update the view state if the center is inside the geofence
    // if (turf.booleanPointInPolygon(newCenter, GEOFENCE)) {
    setViewState(current);
    // }
  }, []);

  const zkeyExportSolidityCalldata = async (_proof, options) => {
    const pub = unstringifyBigInts(publicConstraint);
    const proof = unstringifyBigInts(_proof);

    let res;
    if (proof.protocol === "groth16") {
      res = await groth16ExportSolidityCallData(proof, pub);
    } else if (proof.protocol === "plonk") {
      res = await snarkjs.plonk.exportSolidityCallData(proof, pub);
    } else {
      throw new Error("Invalid Protocol");
    }
    return res;
  };

  const makeProof = async (_proofInput, _wasm, _zkey) => {
    console.log("🚀 ~ file: Home.jsx ~ line 76 ~ makeProof ~ _proofInput", _proofInput);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
    console.log("🚀 ~ file: Home.jsx ~ line 75 ~ makeProof ~ proof", proof);
    return { proof, publicSignals };
  };

  //  const verifyProof = async (_verificationkey, signals, proof) => {
  //     const vkey = await fetch(_verificationkey).then(function (res) {
  //        return res.json();
  //     });
  //     console.log({ vkey });
  //     console.log({ signals });
  //     console.log({ proof });
  //     const res = await snarkjs.groth16.verify(vkey, signals, proof);
  //     return res;
  //  };

  // debugger;
  const runProofs = () => {
    // TODO: Check apps
    // console.log(longitude.length);
    // if (latitude.length == 0 || longitude.length == 0) {
    //   return;
    // }

    try {
      const proofInput = {
        latitude: 12973547807205024,
        longitude: 7500977777251779,
        // longitude: withPrecision
        //   ? Math.trunc((longitude + 180) * 1000)
        //   : Math.trunc((longitude + 180) * Math.pow(10, 14)),
        // latitude: withPrecision ? Math.trunc((latitude + 90) * 1000) : Math.trunc((latitude + 90) * Math.pow(10, 14)),
      };
      makeProof(proofInput, wasmFile, zkeyFile).then(async ({ proof: _proof, publicSignals: _signals }) => {
        setProof(JSON.stringify(_proof, null, 2));
        setSignals(JSON.stringify(_signals, null, 2));
        _proof.protocol = "groth16";

        const callData = await zkeyExportSolidityCalldata(_proof, {});
        //  verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
        //     setIsValid(_isValid);
        //  });

        const tx = await writeContracts.Verifier.verifyProof(...JSON.parse(callData));
        console.log({ tx });

        const recipt = await tx.wait(1);
        console.log({ recipt });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Map
        attributionControl={false}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        style={{ width: "100%", height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        {...viewState}
        onMove={e => onMove(e)}
      />

      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Button onClick={runProofs} size="large" shape="round">
            <span style={{ marginRight: 8 }} role="img" aria-label="support"></span>
            ZK proove your location
          </Button>
        </Row>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        This Is Your App Home. You can start editing it in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/react-app/src/views/Home.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>✏️</span>
        Edit your smart contract{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          YourContract.sol
        </span>{" "}
        in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/hardhat/contracts
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤖</span>
        An example prop of your balance{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span> was
        passed into the
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          Home.jsx
        </span>{" "}
        component from
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          App.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💭</span>
        Check out the <Link to="/hints">"Hints"</Link> tab for more tips.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛠</span>
        Tinker with your smart contract using the <Link to="/debug">"Debug Contract"</Link> tab.
      </div>
    </div>
  );
}

export default Home;
