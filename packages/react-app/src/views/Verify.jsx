import React, { useState, useEffect } from "react";
import { utils } from "ffjavascript";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, message } from "antd";
import { icon } from "leaflet";
import { useRecoilValue, useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import "leaflet/dist/leaflet.css";

// Hooks
import useFlyTo from "../hooks/FlyTo";

// Recoil
import { zonesAtom, zonesSelector } from "../recoil/zones";

// Components
import ModalIntro from "../components/ModalIntro";
import LayerSwitch from "../components/LayerSwitch";
import MapZone from "../components/MapZone";

// Constants
import marker from "../logo-black.png";
var customMarkerIcon = icon({
  iconUrl: marker,
  iconSize: [30, 60], // size of the icon// point from which the popup should open relative to the iconAnchor
});

const { ethers } = require("ethers");

const { unstringifyBigInts } = utils;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

function Verify({ address, userSigner, selectedNetwork }) {
  // you can also use hooks locally in your component of choice

  // Recoil
  const [zones, setZones] = useRecoilState(zonesAtom);
  const zonesFormatted = useRecoilValue(zonesSelector);

  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [selectedOption, setSelectedOption] = useState(zonesFormatted[0]);
  const [map, setMap] = useState(null);

  // custom hooks
  let location = useLocation();
  useFlyTo(map, setViewState, 13);

  useEffect(() => {
    let parsed = queryString.parse(location?.search);
    if (parsed?.coordinates) {
      const coords = parsed.coordinates.split(",");
      const coordinates = [];
      for (let index = 0; index < coords.length; index = index + 2) {
        const current = [parseFloat(coords[index]), parseFloat(coords[index + 1])];
        coordinates.push(current);
      }
      parsed.coordinates = [coordinates];
      const isSaved = zones.find(zone => (zone.id === parsed.id ? true : false));
      if (!isSaved) {
        setZones(z => [...z, parsed]);
      }
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  // Handlers
  const _setSelectedOption = option => {
    forgetProofs();
    setSelectedOption(option);
  };

  const zkeyExportSolidityCalldata = async (_proof, options, _publicConstraint) => {
    const pub = unstringifyBigInts(_publicConstraint);
    const proof = unstringifyBigInts(_proof);
    let res;
    if (proof.protocol === "groth16") {
      res = await window.snarkjs.groth16.exportSolidityCallData(proof, pub);
    } else if (proof.protocol === "plonk") {
      res = await window.snarkjs.plonk.exportSolidityCallData(proof, pub);
    } else {
      throw new Error("Invalid Protocol");
    }
    return res;
  };

  const makeProof = async (_proofInput, _wasm, _zkey, _wtns = null) => {
    try {
      if (selectedOption.protocol === "groth16") {
        const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
        return { proof, publicSignals };
      } else if (selectedOption.protocol === "plonk") {
        const { proof, publicSignals } = await window.snarkjs.plonk.prove(_zkey, _wtns);
        return { proof, publicSignals };
      } else {
        throw new Error("Error creating proof");
      }
    } catch (error) {
      if (error.code === 404) {
        message.error("YThere was a problem connecting with the server.");
      }
      message.error("You are outside of the proof zone.");
      throw error;
    }
  };

  const onChainVerification = async (_proof, pub, _signal) => {
    try {
      const callData = await zkeyExportSolidityCalldata(_proof, {}, pub);
      const callDataFormatted = JSON.parse("[" + callData.replace(/}{/g, "},{") + "]");

      let iface = new ethers.utils.Interface(selectedOption?.contract.abi);
      let verifier = new ethers.Contract(selectedOption?.contract.address, iface, userSigner);
      console.log("🚀 ~ file: Verify.jsx ~ line 115 ~ onChainVerification ~ verifier", verifier);
      let decodeOutput = await verifier.verifyProof(...callDataFormatted);
      setIsVerifying(false);
      setIsGeneratingProof(false);
      if (decodeOutput) {
        setIsValid(true);
        message.success("You have verified your location!");
      } else {
        message.error("Your location doesn't meet the requirements. Try again.");
        forgetProofs();
      }
    } catch (error) {
      console.error(error);
      setIsVerifying(false);
      setIsGeneratingProof(false);
    }
  };

  const _normalizedZoneTenPoints = normalizedZone => {
    let normalizedZoneTen = normalizedZone;
    let normalizedZoneLength = normalizedZone.length;
    let totalPoints = 4;
    if (normalizedZoneLength == 6) {
      totalPoints = 6;
    } else if (normalizedZoneLength > 4) {
      totalPoints = 10;
    } else if (normalizedZoneLength < 3 || normalizedZoneLength > 10) {
      message.error("There was an error with the zone you're trying to verify.");
      throw new Error("There was an error with the zone.");
    }
    let remaining = totalPoints - normalizedZoneLength;
    while (remaining > 0) {
      remaining--;
      const newZone = [normalizedZoneTen[0][0] + remaining, normalizedZoneTen[0][1]];
      // TODO: Check if order (pushing at the end of array) still works with rayTracing
      normalizedZoneTen.push(newZone);
    }
    return normalizedZoneTen;
  };

  const runProofs = async () => {
    try {
      if (!address) {
        message.error("You need to connect your account.");
        return;
      }
      if (!selectedOption) {
        message.error("You need to select or create a new zone.");
        return;
      }

      setIsGeneratingProof(true);

      const precision = selectedOption?.precision;

      const normalizedZone = selectedOption?.geoJson?.geometry?.coordinates[0].map(coords => {
        return coords.map((coord, index) => {
          const normalization = index === 0 ? 180 : 90;
          return Math.trunc((coord + normalization) * Math.pow(10, precision));
        });
      });

      const normalizedZoneTenPoints = _normalizedZoneTenPoints(normalizedZone);
      const proofInput = {
        point: [
          Math.trunc((viewState?.longitude + 180) * Math.pow(10, precision)),
          Math.trunc((viewState?.latitude + 90) * Math.pow(10, precision)),
        ],
        polygon: normalizedZoneTenPoints,
      };
      console.log("proofInput", proofInput);
      const startTime = new Date();
      const { proof: _proof, publicSignals: _public } = await makeProof(
        proofInput,
        selectedOption?.wasmFile,
        selectedOption?.zkeyFile,
        selectedOption?.wtns,
      );
      console.log("_public", _public);
      console.log("_proof", _proof);
      const endTime = new Date();
      const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
      console.log("timeDiff", timeDiff);
      setIsGeneratingProof(false);
      setIsVerifying(true);
      _proof.protocol = "groth16";
      setSignals(JSON.stringify(_public, null, 2));

      await onChainVerification(_proof, _public, signals);
      return;
    } catch (error) {
      console.log({ error });
      setIsVerifying(false);
      setIsGeneratingProof(false);
      forgetProofs();
      console.error(error);
    }
  };

  const forgetProofs = async () => {
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
      {zonesFormatted && (
        <div>
          <ModalIntro />
          <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translate(-50%)", zIndex: 10 }}>
            <LayerSwitch
              layerOptions={zonesFormatted}
              selectedOption={selectedOption}
              setSelectedOption={_setSelectedOption}
            />
          </div>
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
          loading={isGeneratingProof || isVerifying}
          onMouseEnter={hoverCTA}
          onMouseLeave={unhoverCTA}
        >
          {isCtaHovered && isValid
            ? "Forget proof"
            : isValid
            ? "Verified"
            : isGeneratingProof
            ? "generating proof"
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
        dragging={false}
      >
        {selectedOption && <MapZone map={map} selectedOption={selectedOption} selectedNetwork={selectedNetwork} />}
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
