import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Alert } from "antd";
import "leaflet/dist/leaflet.css";

// Components
import DrawTools from "../components/DrawTools";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved

function Polygons({ writeContracts, address, injectedProvider, readContracts, userSigner }) {
  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [message, setMessage] = useState(null);
  const [map, setMap] = useState(null);

  // Handlers
  // TODO: Convert into hook
  const flyTo = async inputs => {
    setViewState({
      latitude: inputs.coords.latitude,
      longitude: inputs.coords.longitude,
      zoom: 18,
    });
    if (map) map.flyTo([inputs.coords.latitude, inputs.coords.longitude], 18);
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
            // setMessage({ text: "You need to enable geolocation to use this app.", type: "error" });
            // setTimeout(() => {
            //   setMessage(null);
            // }, 5000);
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
      }
    })();
  }, []);

  navigator.geolocation.watchPosition(flyTo);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div>
      {message && <Alert message={message.text} type={message.type} style={{ padding: 20 }} />}
      <MapContainer
        ref={setMap}
        style={{ width: "100%", height: "100vh", zIndex: 0 }}
        center={[viewState?.latitude, viewState?.longitude]}
        zoom={viewState.zoom}
        scrollWheelZoom={false}
      >
        <TileLayer attribution="" url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png" />
        <DrawTools />
      </MapContainer>
      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      ></div>
    </div>
  );
}

export default Polygons;
