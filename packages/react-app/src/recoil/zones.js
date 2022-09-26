import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

// Constants
import exernal from "../constants/external";

const { persistAtom } = recoilPersist();

// Atoms
export const zonesAtom = atom({
  key: "zonesAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// Selectors
export const zonesSelector = selector({
  key: "zoneSelector", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const zones = get(zonesAtom);

    const formZones = zones.map(({ id, description, coordinates, network, privacy, qVertex }) => {
      const externalFiles = exernal[network][privacy][qVertex];
      const zone = {
        id,
        description,
        geoJson: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates,
          },
        },
        wasmFile: externalFiles.wasmFile,
        zkeyFile: externalFiles.zkeyFile,
        wtns: externalFiles.wtns,
        contract: externalFiles.contract,
        network,
        privacy,
        precision: 5,
        protocol: "groth16",
      };
      return zone;
    });
    return formZones;
  },
});
