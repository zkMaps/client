
import {atom, selector} from 'recoil';
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

// Atoms
export const accountsAtom = atom({
    key: 'accountsAtom',
    default: [],
});

export const chainIdAtom = atom({
    key: 'chainIdAtom',
    default: 1,
});

export const addressAtom = atom({
    key: 'addressAtom', 
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const providerAtom = atom({
    key: 'providerAtom',
    default: null,
    dangerouslyAllowMutability: true,
    // effects_UNSTABLE: [persistAtom],
});

export const injectedProviderAtom = atom({
    key: 'injectedProviderAtom',
    default: undefined,
    dangerouslyAllowMutability: true,
    // effects_UNSTABLE: [persistAtom],
});


// Selectors
// export const ensAddrSelector = selector({
    // key: 'ensAddr', // unique ID (with respect to other atoms/selectors)
    // get: ({get}) => {
    //   const text = get(textState);
  
    //   return text.length;
    // },
// });