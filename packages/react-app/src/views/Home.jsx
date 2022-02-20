import React, { useState, useRef, useEffect } from "react";
import { utils } from "ffjavascript";
import Map, { Marker } from "react-map-gl";
import { Row, Button, Alert, Spin } from "antd";
import Confetti from "react-confetti";
import { useThemeSwitcher } from "react-css-theme-switcher";

import markerLightSM from "./marker-light-sm.png";
import markerBlack from "../logo-black.png";

import groth16ExportSolidityCallData from "../utils/groth16_exportSolidityCallData";

import ModalIntro from "../components/ModalIntro";
const snarkjs = require("snarkjs");
const { unstringifyBigInts } = utils;
const withPrecision = false;

const REACT_APP_MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZnBldHJhIiwiYSI6ImNrdnhia3drdzBncDgyd3BhdGVsazZ4YzMifQ.vMhTAa15x-b6XOx71Wgb0A";
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

// Constants
let wasmFile = "https://zk-maps.vercel.app/InColorado.wasm";
let zkeyFile = "https://zk-maps.vercel.app/InColorado_0001.zkey";
// let verificationKey = "~/circuits/AtEthDenver/verification_key.json";
let publicConstraint = "~/circuits/public.json";

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

function Home({ writeContracts }) {
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
  const [message, setMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const { currentTheme } = useThemeSwitcher();
  // const { colorMode } = useColorMode();

  const { latitude, longitude } = viewState;

  // A circle of 5 mile radius of the Empire State Building
  // const GEOFENCE = turf.circle(newCenter, 5, { units: "miles" });

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

  navigator.geolocation.watchPosition(flyTo);
  // navigator.geolocation.watchPosition(setCoords, error, options);

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
    try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
      return { proof, publicSignals };
    } catch (error) {
      setMessage({ text: "You are outside of the proof zone.", type: "error" });
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
        // latitude: 12973547807205024,
        // longitude: 7500977777251779,
        longitude: withPrecision
          ? Math.trunc((longitude + 180) * 1000)
          : Math.trunc((longitude + 180) * Math.pow(10, 14)),
        latitude: withPrecision ? Math.trunc((latitude + 90) * 1000) : Math.trunc((latitude + 90) * Math.pow(10, 14)),
      };
      // makeProof(proofInput, wasmFile, zkeyFile).then(async ({ proof: _proof, publicSignals: _signals }) => {
      //   setProof(JSON.stringify(_proof, null, 2));
      //   setSignals(JSON.stringify(_signals, null, 2));
      //   _proof.protocol = "groth16";
      //   // setConfetti(true);
      //   // setTimeout(() => {
      //   //   setConfetti(false);
      //   // }, 7000);

      setIsVerifying(true);

      // const callData = await zkeyExportSolidityCalldata(_proof, {});
      //  verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
      //     setIsValid(_isValid);
      //  });
      
      //
      // Couldn't compile call 🥺 when deployied to a static website, will happen! (some js transpiling!)
      //

      callContact();
      async function callContact() {
        const tx = await writeContracts.Verifier.verifyProof(
          [
            "0x1e2cdec01d32f0bd784efed35b3b724eb62e6a05b887e5eaf35af3049d5f850a",
            "0x19445a36d4536a49c4323eff01647ca5cd4db4902b054a5cc5ee5c9383d54b35",
          ],
          [
            [
              "0x1bb8a138b2006f0f59c3bd4c73c9300f40d3e088a7c1c0b4e4f3e122f3c87603",
              "0x1d79c23cfbe3693e50cac552872b37118fd3762c151d434c7d16fa422878bc76",
            ],
            [
              "0x1046db7951e4412da7a15a2c4c9b63977d22657711bdc917df1806a27e203e84",
              "0x1872793bfe4828dac60811ccbfd55fb8b5a3779c3c0a5b783263bae331fd79dd",
            ],
          ],
          [
            "0x3062a537e8d58d314c731118998a2a20c0eed60d7484933f65aaf87ef65ac1d6",
            "0x1d417031d2a40b655b6e35e55b1aedca105fbc4a702b49c7ddd0fc4db90be877",
          ],
          ["0x0000000000000000000000000000000000000000000000000000000000000001"],
        );
        console.log({ tx });

        const recipt = await tx.wait(1);
        console.log("🚀 ~ file: Home.jsx ~ line 193 ~ makeProof ~ recipt", recipt);
        if (recipt?.events?.length > 0) {
          setIsVerifying(false);
          setMessage({ text: "You have verified your location for Colorado", type: "success" });
          setTimeout(() => {
            setMessage(null);
          }, 200000);
        }
        // console.log({ recipt.past});
      }
    } catch (error) {
      setIsVerifying(false);
      console.error(error);
    }
  };

  return (
    <div>
      {message && <Alert message={message.text} type={message.type} style={{ padding: 20 }} />}
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

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
        {console.log(viewState?.longitude)}
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

      {isVerifying && (
        <div style={{ position: "absolute", top: "calc(50vh - 13px)", width: "100vw" }}>
          <Spin />
        </div>
      )}

      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Button
            key="runProofs"
            style={{ verticalAlign: "center", marginLeft: 8 }}
            shape="round"
            size="large"
            onClick={runProofs}
            type="primary"
          >
            ZK prove your location
          </Button>
        </Row>
      </div>
    </div>
  );
}

export default Home;
