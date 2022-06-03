import React, { useState, useRef, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { Alert } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
import "leaflet/dist/leaflet.css";

// Components
import ModalIntro from "../components/ModalIntro";
import DrawTools from "../components/DrawTools";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved

// Constants
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

function Polygons({ writeContracts, address, injectedProvider, readContracts, userSigner }) {
  // you can also use hooks locally in your component of choice

  // Refs
  const mapRef = useRef();

  // Hooks
  const [viewState, setViewState] = useState({
    latitude: 37.8915444,
    longitude: -4.7844853,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [message, setMessage] = useState(null);

  const { currentTheme } = useThemeSwitcher();
  // const { colorMode } = useColorMode();

  const { latitude, longitude } = viewState;

  // Handlers
  const flyTo = async inputs => {
    // console.log("🚀 ~ file: Home.jsx ~ line 81 ~ Home ~ flyTo", inputs);
    // await mapRef.current?.flyTo({
    //   center: [inputs.coords.longitude, inputs.coords.latitude],
    //   zoom: 18,
    //   duration: 2000,
    // });
    // setViewState({
    //   latitude: inputs.coords.latitude,
    //   longitude: inputs.coords.longitude,
    //   zoom: 18,
    // });
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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div>
      {message && <Alert message={message.text} type={message.type} style={{ padding: 20 }} />}

      <ModalIntro />
      {/* <Map
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
      > */}
      <MapContainer
        ref={mapRef}
        style={{ width: "100%", height: "100vh", zIndex: 0 }}
        center={[viewState?.latitude, viewState?.longitude]}
        zoom={viewState.zoom}
        scrollWheelZoom={false}
      >
        <DrawTools />
      </MapContainer>
      {/* {Math.abs(longitude) && Math.abs(latitude) && (
          // <Marker longitude={viewState?.longitude} latitude={viewState?.latitude}>
          //   <img src={currentTheme === "light" ? markerBlack : markerLightSM} alt="you are here" />
          // </Marker>
        )} */}
      <div
        style={{ position: "fixed", textAlign: "center", alignItems: "center", bottom: 20, padding: 10, width: "100%" }}
      ></div>
    </div>
  );
}

export default Polygons;
