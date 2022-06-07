import { useCallback, useState, useEffect } from "react";

export default function useFlyTo(map, setViewState) {
  // TODO: Convert into hook
  const flyTo = async inputs => {
    setViewState({
      latitude: inputs.coords.latitude,
      longitude: inputs.coords.longitude,
      zoom: 13,
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
}
