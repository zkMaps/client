/* eslint-disable import/no-anonymous-default-export */
import contracts from "./contracts.json";

export default {
  polygon: {
    public: {
      4: {
        // qVertex
        contract: contracts["0x8B39C811c9E768fa382D5e008054A9217121a9B3"], // Polygon | 4 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing4.wasm",
        zkeyFile: "/files/public/RayTracing4_0001.zkey",
        // wtns:
      },
      6: {
        // qVertex
        contract: contracts["0xe51A23ECf62CE27c3a3CEAd5C1F0D74d26D1c0A0"], // Polygon | 6 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing6.wasm",
        zkeyFile: "/files/public/RayTracing6_0001.zkey",
        // wtns:
      },
      10: {
        // qVertex
        contract: contracts["0x30b347D381D349792A5F6f55Eb912Ae0B4C017b4"], // Polygon | 10 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing10.wasm",
        zkeyFile: "/files/public/RayTracing10_0001.zkey",
        // wtns:
      },
    },
    private: {
      4: {
        // qVertex
        contract: contracts["0xBA635a7134599D4d36aBe206b15c7dA0D86F31F9"], // Polygon | 4 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing4Private.wasm",
        zkeyFile: "/files/private/RayTracing4Private_0001.zkey",
        // wtns:
      },
      6: {
        // qVertex
        contract: contracts["0x202014D63C9608aE9f2E4598621f5B5E175E5443"], // Polygon | 6 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing6Private.wasm",
        zkeyFile: "/files/private/RayTracing6Private_0001.zkey",
        // wtns:
      },
      10: {
        // qVertex
        contract: contracts["0x97144d0411C39550CB5207261eeC7F9e9c57dD3b"], // Polygon | 10 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing10Private.wasm",
        zkeyFile: "/files/private/RayTracing10Private_0001.zkey",
        // wtns:
      },
    },
  },
};
