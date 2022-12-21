/* eslint-disable import/no-anonymous-default-export */
import {
  VerifierRayTracing4,
  VerifierRayTracing6,
  VerifierRayTracing10,
  VerifierRayTracing4Private,
  VerifierRayTracing6Private,
  VerifierRayTracing10Private,
} from "./abis";

export default {
  polygon: {
    public: {
      4: {
        // qVertex
        contract: VerifierRayTracing4, // Polygon | 4 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing4.wasm",
        zkeyFile: "/files/public/RayTracing4_0001.zkey",
        // wtns:
      },
      6: {
        // qVertex
        contract: VerifierRayTracing6, // Polygon | 6 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing6.wasm",
        zkeyFile: "/files/public/RayTracing6_0001.zkey",
        // wtns:
      },
      10: {
        // qVertex
        contract: VerifierRayTracing10, // Polygon | 10 Vertex | Public | Emits
        wasmFile: "/files/public/RayTracing10.wasm",
        zkeyFile: "/files/public/RayTracing10_0001.zkey",
        // wtns:
      },
    },
    private: {
      4: {
        // qVertex
        contract: VerifierRayTracing4Private, // Polygon | 4 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing4Private.wasm",
        zkeyFile: "/files/private/RayTracing4Private_0001.zkey",
        // wtns:
      },
      6: {
        // qVertex
        contract: VerifierRayTracing6Private, // Polygon | 6 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing6Private.wasm",
        zkeyFile: "/files/private/RayTracing6Private_0001.zkey",
        // wtns:
      },
      10: {
        // qVertex
        contract: VerifierRayTracing10Private, // Polygon | 10 Vertex | Private | Emits
        wasmFile: "/files/private/RayTracing10Private.wasm",
        zkeyFile: "/files/private/RayTracing10Private_0001.zkey",
        // wtns:
      },
    },
  },
};
