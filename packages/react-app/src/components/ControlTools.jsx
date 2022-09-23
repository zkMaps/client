import React, { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import { FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
import "antd/dist/antd.css";

// Recoil
import { zonesAtom } from "../recoil/zones.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

const ControlTools = ({ map, draw, geoJson = null, selectedNetwork }) => {
  // Hooks
  const [polygon, setPolygon] = useState([]);
  const [lastCreated, setLastCreated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  let history = useHistory();

  // Recoil
  const [zones, setZones] = useRecoilState(zonesAtom);

  let _editableFG = null;

  const _onFeatureGroupReady = reactFGref => {
    // store the ref for future access to content
    _editableFG = reactFGref;
  };

  useEffect(() => {
    draw && message.info("Draw an area to create a verification zone");
  }, []);

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

  const _onChange = props => {
    // _editableFG contains the edited geometry, which can be manipulated through the leaflet API

    if (!_editableFG || !props.onChange) {
      return;
    }

    const geojsonData = _editableFG.leafletElement.toGeoJSON();
    props.onChange(geojsonData);
  };

  // Action handlers!
  const _onEdited = e => {
    let numEdited = 0;
    e.layers.eachLayer(layer => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);
    // FIXME: update coordinates when user edits drawing
    // setPolygon(e?.target?._latlngs[0]);
    _onChange();
  };

  const _onCreated = e => {
    let type = e.layerType;
    if (type === "marker") {
      // Do marker specific actions
      setPolygon([...polygon, e?.layer?._latlngs]);
    } else {
      console.log("_onCreated: something else created:", type, e);
      console.log("=========:", e?.layer?.getLatLngs());
      setPolygon(e?.layer?._latlngs[0]);
    }
    // Do whatever else you need to. (save to db; etc)
    _onChange();
  };

  const _onDeleted = e => {
    let numDeleted = 0;
    e.layers.eachLayer(layer => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);

    _onChange();
  };

  const _onMounted = drawControl => {
    console.log("_onMounted", drawControl);
  };

  const _onDrawVertex = vertex => {
    console.log("vertex:", vertex);
  };

  const _onEditStart = e => {
    console.log("_onEditStart", e);
  };

  const _onEditStop = e => {
    console.log("_onEditStop", e);
  };

  const _onDeleteStart = e => {
    console.log("_onDeleteStart", e);
  };

  const _onDeleteStop = e => {
    console.log("_onDeleteStop", e);
  };

  const _generateZone = async () => {
    try {
      setIsLoading(true);
      const inverted = polygon.map(coord => [coord.lng, coord.lat]);
      const id = uuidv4();
      const newZone = {
        id,
        description: `Zone ${id}`,
        coordinates: [inverted],
        privacy: "public", //"private"
        qVertex: inverted.length,
        network: selectedNetwork,
      };
      setZones(z => [...z, newZone]);
      setLastCreated(newZone);
      setIsLoading(false);
      // TODO: add Share zone
      message.success("Zone created");
    } catch (error) {
      console.log("🚀 ~ file: DrawTools.jsx ~ line 131 ~ const_generateContract= ~ error", error.message);
      setIsLoading(false);
      message.error("Error creating new verification zone");
    }
  };

  const _copyLink = async () => {
    try {
      const link = queryString.stringifyUrl({
        url: "https://zkmaps.vercel.app/",
        query: lastCreated,
      });
      navigator.clipboard.writeText(link);
      message.success("Link copied to clipboard");
    } catch (error) {
      message.error("Error creating copying link");
    }
  };

  const _goToNewZone = async () => {
    try {
      const link = queryString.stringify(lastCreated);
      history.push(`/?${link}`);
    } catch (error) {
      message.error("Error navigating to new zone");
    }
  };

  const CreateButton = () => {
    return (
      <Button
        key="generatecreateButtonContract"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_generateZone}
        type="primary"
        loading={isLoading}
      >
        Create Zone
      </Button>
    );
  };

  const ShareButon = () => {
    return (
      <Button
        key="shareButton"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_copyLink}
        type="ghost"
        loading={isLoading}
      >
        Share Zone
      </Button>
    );
  };

  const GoToVerify = () => {
    return (
      <Button
        key="shareButton"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_goToNewZone}
        type="ghost"
        loading={isLoading}
      >
        Go to Verify Zone
      </Button>
    );
  };

  return (
    <>
      <FeatureGroup
        ref={reactFGref => {
          _onFeatureGroupReady(reactFGref);
        }}
      >
        {/* When we only want to populate, we disable controls */}
        {draw ? (
          <EditControl
            position="topleft"
            onEdited={_onEdited}
            onCreated={_onCreated}
            onDeleted={_onDeleted}
            onMounted={_onMounted}
            onDrawVertex={_onDrawVertex}
            onEditStart={_onEditStart}
            onEditStop={_onEditStop}
            onDeleteStart={_onDeleteStart}
            onDeleteStop={_onDeleteStop}
            draw={{
              polyline: false,
              rectangle: true,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
          />
        ) : (
          <ShareButon />
        )}
        {/* TODO: Add Description Privacy QVertices */}
      </FeatureGroup>
      {lastCreated !== null ? (
        <Card
          title={lastCreated?.description}
          bordered={true}
          style={{ position: "absolute", width: 300, zIndex: 500, bottom: 10 }}
        >
          <p>
            Network: {lastCreated?.network}
            <br />
            Privacy: {lastCreated?.privacy}
            <br />
          </p>
          <ShareButon />
          <GoToVerify />
          <CreateButton />
        </Card>
      ) : (
        polygon?.length && <CreateButton />
      )}
    </>
  );
};

export default ControlTools;
