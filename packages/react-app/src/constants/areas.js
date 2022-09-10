/* eslint-disable import/no-anonymous-default-export */
import contracts from "./contracts.json";

export default [
  {
    id: 1,
    description: "RayTracing6 - Argentina - Public Polygon",
    wasmFile: "https://ipfs.io/ipfs/QmcBRvjfDUuQPK499b6pbXyAjqy6rLr8i8quPX3DovQUoc/RayTracing6_js/RayTracing6.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmcBRvjfDUuQPK499b6pbXyAjqy6rLr8i8quPX3DovQUoc/RayTracing6_0001.zkey",
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
    contract: contracts["0x0a23af15ce2642689aF312B8A570534731285E83"], // Mumbai | 6 Vertex | Public | Emits
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 2,
    description: "RayTracing6Private - Argentina - Public Polygon",
    wasmFile:
      "https://ipfs.io/ipfs/QmeLREkAuCTLMkyc37CqPF44SpL5PStDQeERazCAinjFBQ/RayTracing6Private_js/RayTracing6Private.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmeLREkAuCTLMkyc37CqPF44SpL5PStDQeERazCAinjFBQ/RayTracing6Private_0001.zkey",
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
    contract: contracts["0xDEc4bD77b257E346F2fa8E52C4B91482C9081e6b"], // Mumbai | 6 Vertex | Public | Emits
    precision: 5,
    protocol: "groth16",
  },
];
