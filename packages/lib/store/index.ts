import { atom } from "jotai";

export const nowAtom = atom<number>(Math.floor(Date.now() / 1000));
export const localeAtom = atom<"ja" | "en">("en");
export const continueSignInAtom = atom<boolean>(false);
export const signInTriggerIdAtom = atom<string | undefined>(undefined);
