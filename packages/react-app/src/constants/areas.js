/* eslint-disable import/no-anonymous-default-export */
import contracts from "./contracts.json";

export default [
  {
    id: 3,
    description: "RayTracing6 - New York - Public Polygon",
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
            [40.698860762261035, -74.01729583740236],
            [40.758700379161034, -74.01111602783205],
            [40.883928811599326, -73.92528533935548],
            [40.86731458364796, -73.90537261962892],
            [40.792758888618756, -73.9263153076172],
            [40.70849076720841, -73.97815704345705],
          ],
        ],
      },
    },
    contract: contracts["0xE3A676Fa3087226A5EBDE764fD6536e125273D3D"], // Polygon | 6 Vertex | Public | Emits
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 4,
    description: "RayTracing6 - New York State - Public Polygon",
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
            [42.020732852644294, -71.80114746093751],
            [41.03378713521864, -71.79565429687501],
            [40.413496049701955, -74.03686523437501],
            [42.783307077249624, -73.92700195312501],
            [42.67839711889055, -72.66906738281251],
            [42.577354839557856, -71.93847656250001],
          ],
        ],
      },
    },
    contract: contracts["0xE3A676Fa3087226A5EBDE764fD6536e125273D3D"], // Polygon | 6 Vertex | Public | Emits
    precision: 5,
    protocol: "groth16",
  },
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
