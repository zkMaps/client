import React, { useState } from "react";
import { useColorMode, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useContractReader } from "eth-hooks";
import { utils } from "ffjavascript";
import Map from "react-map-gl";
import { Row } from "antd";
import { CheckCircleIcon } from "@chakra-ui/icons";

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

function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

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
  const [message, setMessage] = useState(null);

  const { colorMode } = useColorMode();

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
      res = await snarkjs.groth16.exportSolidityCallData(proof, pub);
    } else if (proof.protocol === "plonk") {
      res = await snarkjs.plonk.exportSolidityCallData(proof, pub);
    } else {
      throw new Error("Invalid Protocol");
    }
    return res;
  };

  const makeProof = async (_proofInput, _wasm, _zkey) => {
    try {
      console.log("🚀 ~ file: Home.jsx ~ line 76 ~ makeProof ~ _proofInput", _proofInput);
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
      console.log("🚀 ~ file: Home.jsx ~ line 75 ~ makeProof ~ proof", proof);
      return { proof, publicSignals };
    } catch (error) {
      // console.error("=====>", error);
      setMessage("You are outside of the proof zone.");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      throw error;
    }
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
        // latitude: 12973547807205024 / 2,
        // longitude: 7500977777251779 / 2,
        longitude: withPrecision
          ? Math.trunc((longitude + 180) * 1000)
          : Math.trunc((longitude + 180) * Math.pow(10, 14)),
        latitude: withPrecision ? Math.trunc((latitude + 90) * 1000) : Math.trunc((latitude + 90) * Math.pow(10, 14)),
      };
      makeProof(proofInput, wasmFile, zkeyFile).then(async ({ proof: _proof, publicSignals: _signals }) => {
        setProof(JSON.stringify(_proof, null, 2));
        setSignals(JSON.stringify(_signals, null, 2));
        _proof.protocol = "groth16";

        const callData = await zkeyExportSolidityCalldata(_proof, {});
        console.log(callData);
        //  verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
        //     setIsValid(_isValid);
        //  });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {message && (
        <Alert status="error">
          <AlertIcon />
          {message}
        </Alert>
      )}
      <Map
        attributionControl={false}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={
          colorMode === "light"
            ? "mapbox://styles/mapbox/streets-v9"
            : "mapbox://styles/fpetra/ckvxbmc8b4lwx14s3zewfbr3d"
        }
        {...viewState}
        onMove={e => onMove(e)}
      />

      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Button
            aria-label="Mint"
            icon={<CheckCircleIcon />}
            onClick={runProofs}
            // background="transparent"
          >
            Mint
          </Button>
        </Row>
      </div>
    </div>
  );
}

export default Home;
