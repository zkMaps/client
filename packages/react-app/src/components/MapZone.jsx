import React, { useState, useEffect } from "react";
import { Card, Button, message, Tag } from "antd";
import { FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
import "antd/dist/antd.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

const MapZone = ({ map, selectedOption = null }) => {
  // Hooks
  let history = useHistory();
  let _editableFG = null;

  const { geoJson, id, description, privacy, qVertex, network } = selectedOption;

  const currentZone = {
    id,
    description,
    coordinates: geoJson?.geometry?.coordinates,
    privacy,
    qVertex,
    network,
  };

  const _onFeatureGroupReady = reactFGref => {
    // store the ref for future access to content
    _editableFG = reactFGref;
  };

  useEffect(() => {
    if (_editableFG && geoJson && map) {
      console.log("🚀 ~ geoJson", geoJson);
      // populate the leaflet FeatureGroup with the geoJson layers
      // TODO: Clean up map after switching to new layer
      let leafletGeoJSON = new L.GeoJSON(geoJson).addTo(map);
      let leafletFG = _editableFG?.leafletElement;

      leafletGeoJSON.eachLayer(layer => {
        leafletFG?.addLayer(layer);
      });
    }
  }, [geoJson, _editableFG, map]);

  const _copyLink = async () => {
    try {
      const link = queryString.stringifyUrl({
        url: window.location.origin + "/",
        query: currentZone,
      });
      navigator.clipboard.writeText(link);
      message.success("Link copied to clipboard");
    } catch (error) {
      message.error("Error creating copying link");
    }
  };

  const _goToNewZone = async () => {
    try {
      const link = queryString.stringify(currentZone);
      history.push(`/?${link}`);
    } catch (error) {
      message.error("Error navigating to new zone");
    }
  };

  // TODO: Componentisize
  const ShareButon = () => {
    return (
      <Button
        key="shareButton"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_copyLink}
        type="ghost"
      >
        Share Zone
      </Button>
    );
  };

  // TODO: Componentisize
  const GoToVerify = () => {
    return (
      <Button
        key="shareButton"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_goToNewZone}
        type="ghost"
      >
        Go to verify Zone
      </Button>
    );
  };

  return (
    <>
      <FeatureGroup
        ref={reactFGref => {
          _onFeatureGroupReady(reactFGref);
        }}
      />
      <Card
        title={description}
        bordered={true}
        style={{ position: "absolute", width: 300, zIndex: 500, bottom: 10, left: 10 }}
      >
        <p>
          Network: <Tag color="#8247e5">{network}</Tag>
        </p>
        <p>
          Privacy: <Tag color={privacy === "private" ? "#f50" : "#87d068"}>{privacy}</Tag>
          <br />
        </p>
        <ShareButon />
        <GoToVerify />
      </Card>
    </>
  );
};

export default MapZone;
