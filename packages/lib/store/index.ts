import { atom } from "jotai";

export const nowAtom = atom<number>(Math.floor(Date.now() / 1000));