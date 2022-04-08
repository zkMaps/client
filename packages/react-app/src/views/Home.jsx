import React, { useState, useRef, useEffect } from "react";
import { utils } from "ffjavascript";
import Map, { Marker } from "react-map-gl";
import { Row, Button, Alert } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
// added the following 6 lines.
import mapboxgl from "mapbox-gl";
// import { groth16, plonk } from "snarkjs";

// Constants
import markerLightSM from "./marker-light-sm.png";
// import markerBlack from "../logo-black.png";

// Utils
import groth16ExportSolidityCallData from "../utils/groth16_exportSolidityCallData";

// Components
import ModalIntro from "../components/ModalIntro";

const { unstringifyBigInts } = utils;
const withPrecision = false;

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const REACT_APP_MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

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

/* AtEthDenver */
// let wasmFile =
//   "https://gateway.pinata.cloud/ipfs/QmPyAbDi2EwesWSNWyYSresj4ZwRLsVoQXagoD7eDQbBDv?filename=AtEthDenver.wasm";
// let zkeyFile =
//   "https://gateway.pinata.cloud/ipfs/QmPyfF2k7wTKGibSKnh6eW3ibVhZDYoTUS1GdqcxVoZ3GX?filename=AtEthDenver_0001.zkey";
// let publicConstraint = "https://gateway.pinata.cloud/ipfs/QmdCe5TJW3nAcXYbnXqLf9JGyodSgek6mKwSK9mxzn6ejx";

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

function Home({ writeContracts, address }) {
  // you can also use hooks locally in your component of choice

  // Refs
  const mapRef = useRef();

  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 37.7751,
    longitude: -122.4193,
    zoom: 30,
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

  const { currentTheme } = useThemeSwitcher();
  // const { colorMode } = useColorMode();

  const { latitude, longitude } = viewState;

  // Handlers
  const flyTo = async inputs => {
    // console.log("🚀 ~ file: Home.jsx ~ line 81 ~ Home ~ flyTo", inputs);
    await mapRef.current?.flyTo({
      center: [inputs.coords.longitude, inputs.coords.latitude],
      zoom: 18,
      duration: 2000,
    });
    setViewState({
      latitude: inputs.coords.latitude,
      longitude: inputs.coords.longitude,
      zoom: 18,
    });
  };

  useEffect(() => {
    (async () => {
      if (navigator.geolocation) {
        await navigator.permissions.query({ name: "geolocation" }).then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(flyTo);
            // } else if (result.state === "prompt") {
            //   navigator.geolocation.getCurrentPosition(setViewState, null, null);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
            setMessage({ text: "You need to enable geolocation to use this app.", type: "error" });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
      }
    })();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  navigator.geolocation.watchPosition(flyTo);
  // navigator.geolocation.watchPosition(setCoords, error, options);

  const zkeyExportSolidityCalldata = async (_proof, options) => {
    const pub = unstringifyBigInts(publicConstraint);
    const proof = unstringifyBigInts(_proof);

    let res;
    if (proof.protocol === "groth16") {
      res = await groth16ExportSolidityCallData(proof, pub);
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
      const proofInput = { a: 2, b: 11 };
      // const proofInput = {
      //   latitude: 12973547807205024,
      //   longitude: 7500977777251779,
      //   // longitude: withPrecision
      //   //   ? Math.trunc((longitude + 180) * 1000)
      //   //   : Math.trunc((longitude + 180) * Math.pow(10, 14)),
      //   // latitude: withPrecision ? Math.trunc((latitude + 90) * 1000) : Math.trunc((latitude + 90) * Math.pow(10, 14)),
      // };
      const { proof: _proof, publicSignals: _signals } = await makeProof(proofInput, wasmFile, zkeyFile);

      setIsVerifying(true);

      _proof.protocol = "groth16";
      setProof(JSON.stringify(_proof, null, 2));
      setSignals(JSON.stringify(_signals, null, 2));
      const pf = JSON.stringify(_proof, null, 2);

      const vkey = await fetch(verification_key).then(res => {
        return res.json();
      });
      console.log("🚀 ~ file: Home.jsx ~ line 217 ~ runProofs ~ _proof", _proof);
      const localVerification = await window.snarkjs.groth16.verify(vkey, _signals, pf);
      console.log("localVerification====>", localVerification, proofInput);

      const callData = await zkeyExportSolidityCalldata(_proof, {});
      const tx = await writeContracts.Verifier.verifyProof(...JSON.parse(callData));
      console.log({ tx });

      const recipt = await tx.wait(1);
      console.log("🚀 ~ file: Home.jsx ~ line 193 ~ makeProof ~ recipt", recipt);
      if (recipt?.events?.length > 0 && localVerification) {
        setIsVerifying(false);
        setIsValid(true);
        setMessage({ text: "You have verified your location for Colorado", type: "success" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        forgetProofs();
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
      <Map
        ref={mapRef}
        mapboxAccessToken={REACT_APP_MAPBOX_ACCESS_TOKEN}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={
          currentTheme === "light"
            ? "mapbox://styles/mapbox/streets-v9"
            : "mapbox://styles/fpetra/ckvxbmc8b4lwx14s3zewfbr3d"
        }
        {...settings}
        // {...viewState}
        // onMove={e => onMove(e)}
        attributionControl={false}
      >
        {/* {Math.abs(longitude) && Math.abs(latitude) && (
          // <Marker longitude={viewState?.longitude} latitude={viewState?.latitude}>
          //   <img src={currentTheme === "light" ? markerBlack : markerLightSM} alt="you are here" />
          // </Marker>
        )} */}
      </Map>
      <img
        src={markerLightSM}
        alt={"you are somewhere 🤷"}
        style={{ position: "absolute", top: "calc(50% - 50px)", left: "calc(50% - 50px)" }}
      />

      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Button
            key="runProofs"
            style={{ verticalAlign: "center", marginLeft: 8, backgroundColor: isValid ? "green" : "null" }}
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
    </div>
  );
}

export default Home;
