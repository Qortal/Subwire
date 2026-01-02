import { atom } from 'jotai';

// Atom to store the list of user's registered names
export const userNamesAtom = atom<string[]>([]);

// Atom to track if names are currently being loaded
export const isLoadingUserNamesAtom = atom<boolean>(false);

