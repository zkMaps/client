/* eslint-disable import/no-anonymous-default-export */
import contracts from "./contracts.json";

export default [
  {
    id: 55,
    description: "RayTracing6Basic - Argentina - Public Polygon",
    wasmFile: "https://ipfs.io/ipfs/QmcpsZ5pe83WNGDPMuDQrQcDpDQNaPuomyo8AvntzKsTMR/RayTracing6_js/RayTracing6.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmcpsZ5pe83WNGDPMuDQrQcDpDQNaPuomyo8AvntzKsTMR/RayTracing6_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.31347656250001, -31.72816714602391],
            [-65.08300781250001, -28.88315960932351],
            [-55.10742187500001, -35.49645605658411],
            [-61.65527343750001, -37.68382032669381],
            [-63.45703125000001, -35.06597313798411],
            [-66.13769531250001, -35.10193405724601],
          ],
        ],
      },
    },
    contract: contracts["0x51546624705F15336a2a4275BeCCD041f84143F6"], // Ropsten | 6 Vertex | Public
    precision: 5,
    protocol: "groth16",
  },
];
