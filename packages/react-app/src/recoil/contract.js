
import {atom, selector} from 'recoil';
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

// Atoms
export const contractAtom = atom({
    key: 'contractAtom',
    default: null,
    effects_UNSTABLE: [persistAtom],
});

// Selectors
// export const ensAddrSelector = selector({
    // key: 'ensAddr', // unique ID (with respect to other atoms/selectors)
    // get: ({get}) => {
    //   const text = get(textState);
  
    //   return text.length;
    // },
// });