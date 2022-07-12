import React, { useState } from "react";
import { Card, Button } from "antd";
import { FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
import "antd/dist/antd.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

const DrawTools = () => {
  // Hooks
  const [polygons, setPolygons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  let _editableFG = null;

  const _onFeatureGroupReady = reactFGref => {
    console.log("🚀 ~ file: DrawTools.jsx ~ line 102 ~ test ~ reactFGref", reactFGref);
    // populate the leaflet FeatureGroup with the geoJson layers
    // TODO: When we have an asset management sysyem, we can load previous drawings with this script
    // let leafletGeoJSON = new L.GeoJSON(getGeoJson());
    // let leafletFG = reactFGref?.leafletElement;

    // leafletGeoJSON.eachLayer(layer => {
    //   leafletFG?.addLayer(layer);
    // });

    // store the ref for future access to content

    _editableFG = reactFGref;
  };

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

    _onChange();
  };

  const _onCreated = e => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === "marker") {
      // Do marker specific actions
      setPolygons(polygons.push(e?.layer?._latlngs));
    } else {
      console.log("_onCreated: something else created:", type, e);
      setPolygons([...polygons, e?.layer?._latlngs]);
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

  const baseUrl = "http://localhost:8000";

  const _generateContract = async () => {
    setIsLoading(true);
    console.log("_generateContract");
    const res = await axios.get(`${baseUrl}`);
    const { tokens } = res.data;
    setIsLoading(false);
  };

  return (
    <>
      <FeatureGroup
        ref={reactFGref => {
          _onFeatureGroupReady(reactFGref);
        }}
      >
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
      </FeatureGroup>
      {polygons?.length && (
        <Card
          title="Polygon Coords"
          bordered={true}
          style={{ position: "absolute", width: 300, zIndex: 500, bottom: 10 }}
        >
          {polygons[0]?.map(polygon => {
            return polygon.map(vertex => (
              <p>
                lat: {vertex.lat} - long: {vertex.lng}
              </p>
            ));
          })}
          <Button
            key="generateContract"
            style={{ verticalAlign: "center", marginLeft: 8 }}
            shape="round"
            size="large"
            onClick={_generateContract}
            type="primary"
            loading={isLoading}
          >
            Generate contract
          </Button>
        </Card>
      )}
    </>
  );
};

export default DrawTools;

// data taken from the example in https://github.com/PaulLeCam/react-leaflet/issues/176

// function getGeoJson() {
//   return {
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "LineString",
//           coordinates: [
//             [-122.47979164123535, 37.830124319877235],
//             [-122.47721672058105, 37.809377088502615],
//           ],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Point",
//           coordinates: [-122.46923446655273, 37.80293476836673],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Point",
//           coordinates: [-122.48399734497069, 37.83466623607849],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Point",
//           coordinates: [-122.47867584228514, 37.81893781173967],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Polygon",
//           coordinates: [
//             [
//               [-122.48069286346434, 37.800637436707525],
//               [-122.48069286346434, 37.803104310307276],
//               [-122.47950196266174, 37.803104310307276],
//               [-122.47950196266174, 37.800637436707525],
//               [-122.48069286346434, 37.800637436707525],
//             ],
//           ],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Polygon",
//           coordinates: [
//             [
//               [-122.48103886842728, 37.833075326166274],
//               [-122.48065531253813, 37.832558431940114],
//               [-122.4799284338951, 37.8322660885204],
//               [-122.47963070869446, 37.83231693093747],
//               [-122.47948586940764, 37.832467339549524],
//               [-122.47945636510849, 37.83273426112019],
//               [-122.47959315776825, 37.83289737938241],
//               [-122.48004108667372, 37.833109220743104],
//               [-122.48058557510376, 37.83328293020496],
//               [-122.48080283403395, 37.83332529830436],
//               [-122.48091548681259, 37.83322785163939],
//               [-122.48103886842728, 37.833075326166274],
//             ],
//           ],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "Polygon",
//           coordinates: [
//             [
//               [-122.48043537139893, 37.82564992009924],
//               [-122.48129367828368, 37.82629397920697],
//               [-122.48240947723389, 37.82544653184479],
//               [-122.48373985290527, 37.82632787689904],
//               [-122.48425483703613, 37.82680244295304],
//               [-122.48605728149415, 37.82639567223645],
//               [-122.4898338317871, 37.82663295542695],
//               [-122.4930953979492, 37.82415839321614],
//               [-122.49700069427489, 37.821887146654376],
//               [-122.4991464614868, 37.82171764783966],
//               [-122.49850273132326, 37.81798857543524],
//               [-122.50923156738281, 37.82090404811055],
//               [-122.51232147216798, 37.823344820392535],
//               [-122.50150680541992, 37.8271414168374],
//               [-122.48743057250977, 37.83093781796035],
//               [-122.48313903808594, 37.82822612280363],
//               [-122.48043537139893, 37.82564992009924],
//             ],
//           ],
//         },
//       },
//     ],
//   };
// }
