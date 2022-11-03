/* eslint-disable import/no-anonymous-default-export */
import contracts from "./contracts.json";

export default {
  polygon: {
    public: {
      4: {
        // qVertex
        contract: contracts["0xc53a2E55031F3BbE8ba9fB136F1b84bB5Af1CDe9"], // Polygon | 4 Vertex | Public | Emits
        wasmFile: "",
        zkeyFile: "",
        // wtns:
      },
      6: {
        // qVertex
        contract: contracts["0xE3A676Fa3087226A5EBDE764fD6536e125273D3D"], // Polygon | 6 Vertex | Public | Emits
        wasmFile: "./files/public/RayTracing6.wasm",
        zkeyFile: "./files/public/RayTracing6_0001.zkey",
        // wtns:
      },
      10: {
        // qVertex
        contract: contracts["0x9d567902eFbceEf419edAC5aa556dDA545A71E68"], // Polygon | 10 Vertex | Public | Emits
        wasmFile: "",
        zkeyFile: "",
        // wtns:
      },
    },
    private: {
      6: {
        // qVertex
        contract: contracts["0x0Eb82353271c162256b15BA540b10303F209F636"], // Polygon | 6 Vertex | Private | Emits
        wasmFile:
          "https://ipfs.io/ipfs/QmeLREkAuCTLMkyc37CqPF44SpL5PStDQeERazCAinjFBQ/RayTracing6Private_js/RayTracing6Private.wasm",
        zkeyFile: "https://ipfs.io/ipfs/QmeLREkAuCTLMkyc37CqPF44SpL5PStDQeERazCAinjFBQ/RayTracing6Private_0001.zkey",
        // wtns:
      },
    },
  },
};
