import React, { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import { FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
import "antd/dist/antd.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

const ControlTools = ({ map, draw, geoJson = null }) => {
  // Hooks
  const [polygon, setPolygon] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  let _editableFG = null;

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
    polygon.map(coord => {
      console.log("🚀 ~ coord", coord);
    });
    try {
      setIsLoading(true);
      // const res = await axios({
      //   method: "post",
      //   baseURL: baseUrl,
      //   url: "api/generate/boundingbox",
      //   // (${northEastX}, ${northEastY}, ${southWestX}, ${southWestY});
      //   // y = longitude and x = latitude
      //   data: {
      //     geoFenceCoords: [polygon[1].lat, polygon[1].lng, polygon[3].lat, polygon[3].lng],
      //   },
      // });
      // const { tokens } = res.data;
      setIsLoading(false);
      message.success("Zone created");
    } catch (error) {
      console.log("🚀 ~ file: DrawTools.jsx ~ line 131 ~ const_generateContract= ~ error", error.message);
      setIsLoading(false);
      message.error("Error creating new verification zone");
    }
  };

  return (
    <>
      <FeatureGroup
        ref={reactFGref => {
          _onFeatureGroupReady(reactFGref);
        }}
      >
        {/* When we only want to populate, we disable controls */}
        {draw && (
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
        )}
      </FeatureGroup>
      {polygon?.length && (
        <Card
          title="Polygon Coords"
          bordered={true}
          style={{ position: "absolute", width: 300, zIndex: 500, bottom: 10 }}
        >
          {polygon.map((vertex, idx) => {
            return (
              <p key={idx}>
                lat: {vertex.lat} - long: {vertex.lng}
              </p>
            );
          })}
          <Button
            key="generateContract"
            style={{ verticalAlign: "center", marginLeft: 8 }}
            shape="round"
            size="large"
            onClick={_generateZone}
            type="primary"
            loading={isLoading}
          >
            Create Zone
          </Button>
        </Card>
      )}
    </>
  );
};

export default ControlTools;
