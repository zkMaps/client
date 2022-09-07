// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "a4741b997a2048d08dcda4862a3793fd";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

export const ALCHEMY_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.matic.today",
    faucet: "https://faucet.polygon.technology/",
    blockExplorer: "https://mumbai.polygonscan.com/",
  },
  localArbitrum: {
    name: "localArbitrum",
    color: "#50a0ea",
    chainId: 153869338190755,
    blockExplorer: "",
    rpcUrl: `http://localhost:8547`,
  },
  localArbitrumL1: {
    name: "localArbitrumL1",
    color: "#50a0ea",
    chainId: 44010,
    blockExplorer: "",
    rpcUrl: `http://localhost:7545`,
  },
  rinkebyArbitrum: {
    name: "Arbitrum Testnet",
    color: "#50a0ea",
    chainId: 421611,
    blockExplorer: "https://rinkeby-explorer.arbitrum.io/#/",
    rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
  },
  arbitrum: {
    name: "Arbitrum",
    color: "#50a0ea",
    chainId: 42161,
    blockExplorer: "https://explorer.arbitrum.io/#/",
    rpcUrl: `https://arb1.arbitrum.io/rpc`,
    gasPrice: 0,
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":9545",
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    gasPrice: 0,
  },
  kovanOptimism: {
    name: "kovanOptimism",
    color: "#f01a37",
    chainId: 69,
    blockExplorer: "https://kovan-optimistic.etherscan.io/",
    rpcUrl: `https://kovan.optimism.io`,
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: `https://mainnet.optimism.io`,
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    blockExplorer: "",
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "fujiAvalanche",
    color: "#666666",
    chainId: 43113,
    blockExplorer: "https://cchain.explorer.avax-test.network/",
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "mainnetAvalanche",
    color: "#666666",
    chainId: 43114,
    blockExplorer: "https://cchain.explorer.avax.network/",
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  testnetHarmony: {
    name: "testnetHarmony",
    color: "#00b0ef",
    chainId: 1666700000,
    blockExplorer: "https://explorer.pops.one/",
    rpcUrl: `https://api.s0.b.hmny.io`,
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "mainnetHarmony",
    color: "#00b0ef",
    chainId: 1666600000,
    blockExplorer: "https://explorer.harmony.one/",
    rpcUrl: `https://api.harmony.one`,
    gasPrice: 1000000000,
  },
  fantom: {
    name: "fantom",
    color: "#1969ff",
    chainId: 250,
    blockExplorer: "https://ftmscan.com/",
    rpcUrl: `https://rpcapi.fantom.network`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: "testnetFantom",
    color: "#1969ff",
    chainId: 4002,
    blockExplorer: "https://testnet.ftmscan.com/",
    rpcUrl: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: "https://faucet.fantom.network/",
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const ASSETS = [
  {
    id: 0,
    description: "RayTracing4 (4pts) - Cordoba (Argentina)",
    wasmFile: "https://ipfs.io/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_js/RayTracing4.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.63119506835939, -31.59491312542741],
            [-64.63119506835939, -31.10821276589124],
            [-63.94454956054688, -31.10821276589124],
            [-63.94454956054688, -31.59491312542741],
          ],
        ],
      },
    },
    contractAddr: "0x4f52f8c5fb2c54e04e0044f799dd94484f4e52d5", // Ropsten | 4 Vertex
    precision: 7,
    protocol: "groth16",
  },
  {
    id: 77,
    description: "RayTracing4 (4 pts) - Cordoba (Argentina) - Private Polygon",
    wasmFile:
      "https://ipfs.io/ipfs/QmV9Zs3J4TkWcNdJ7Pz7Y9RJ64J3rgxRjK5DGCBsxvhk4b/RayTracing4_Private_js/RayTracing4_Private.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmV9Zs3J4TkWcNdJ7Pz7Y9RJ64J3rgxRjK5DGCBsxvhk4b/RayTracing4_Private_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.63119506835939, -31.59491312542741],
            [-64.63119506835939, -31.10821276589124],
            [-63.94454956054688, -31.10821276589124],
            [-63.94454956054688, -31.59491312542741],
          ],
        ],
      },
    },
    // TODO: Deploy and update
    contractAddr: "0x511232c89fa08c33e8c975396f90d322e38eb33a", // Ropsten | 4 Vertex | Private
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 100,
    description: "RayTracing6 (6 pts) - Cordoba (Argentina) - Private Polygon",
    wasmFile:
      "https://ipfs.io/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_js/RayTracing6Private.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.18762207031251, -31.54928237735268],
            [-63.92395019531251, -31.4333502624144],
            [-64.08874511718751, -31.20927787746013],
            [-64.42657470703126, -31.19635695773507],
            [-64.58999633789064, -31.3595005198224],
            [-64.35928344726564, -31.70012955398594],
          ],
        ],
      },
    },
    contractAddr: "0xe2bf8e1a7494e37afaa55f85ffc95d4962426ac2", // Ropsten | 6 Vertex
    precision: 5,
    protocol: "groth16",
  },
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
    contractAddr: "0x9a0de892eb30782659ecce379265294167a11eeb", // Ropsten | 6 Vertex | Public
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 66,
    description: "RayTracing6 (6 pts) - Argentina - Public Polygon",
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
    contractAddr: "0x51546624705F15336a2a4275BeCCD041f84143F6", // Ropsten | 6 Vertex | Public
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 101,
    description: "RayTracing6 (6 pts) - Argentina - Private Polygon",
    wasmFile:
      "https://ipfs.io/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_js/RayTracing6Private.wasm",
    zkeyFile: "https://ipfs.io/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_0001.zkey",
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
    contractAddr: "0xe2bf8e1a7494e37afaa55f85ffc95d4962426ac2", // Ropsten | 6 Vertex
    precision: 5,
    protocol: "groth16",
  },
  {
    id: 1,
    description: "RayTracing10 (7 pts) - Cordoba (Argentina)",
    wasmFile:
      "https://gateway.pinata.cloud/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_js/RayTracing6Private.wasm",
    zkeyFile:
      "https://gateway.pinata.cloud/ipfs/QmYJGNotkZ5av26QJt16u4bqBjYpqGZoTDAXFFcinP3gTa/RayTracing6Private_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.18762207031251, -31.54928237735268],
            [-63.92395019531251, -31.4333502624144],
            [-64.08874511718751, -31.20927787746013],
            [-64.42657470703126, -31.19635695773507],
            [-64.58999633789064, -31.3595005198224],
            [-64.57626342773439, -31.56917544907091],
            [-64.35928344726564, -31.70012955398594],
          ],
        ],
      },
    },
    contractAddr: "0x4fa6bbef535f5ce142ef097bcd31decbab224a39", // Ropsten | 10 Vertex
    // contractAddr: "0x4f52f8c5fb2c54e04e0044f799dd94484f4e52d5", // Ropsten | 4 Vertex
    precision: 7,
    protocol: "groth16",
  },
  {
    id: 2,
    description: "RayTracing4 - New Zeland",
    wasmFile:
      "https://gateway.pinata.cloud/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_js/RayTracing4.wasm",
    zkeyFile: "https://gateway.pinata.cloud/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [161.67480468750003, -48.54570549184745],
            [161.67480468750003, -32.69486597787506],
            [184.70214843750003, -32.69486597787506],
            [184.70214843750003, -48.54570549184745],
          ],
        ],
      },
    },
    contractAddr: "0x4fa6bbef535f5ce142ef097bcd31decbab224a39", // Ropsten
    precision: 7,
    protocol: "groth16",
  },
  {
    id: 3,
    description: "RayTracing4 - Israel",
    wasmFile:
      "https://gateway.pinata.cloud/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_js/RayTracing4.wasm",
    zkeyFile: "https://gateway.pinata.cloud/ipfs/QmRNr6MFPLPkAXdrsyKGM1TYJcPesbdLobHTGWehvrN7VU/RayTracing4_0001.zkey",
    publicConstraint: ["1"],
    geoJson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [33.09082031250001, 29.9596938141845],
            [33.09082031250001, 33.5963189611327],
            [36.26037597656251, 33.5963189611327],
            [36.26037597656251, 29.9596938141845],
          ],
        ],
      },
    },
    contractAddr: "0x4fa6bbef535f5ce142ef097bcd31decbab224a39", // Ropsten
    precision: 7,
    protocol: "groth16",
  },
];
