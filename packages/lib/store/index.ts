import { atom } from "jotai";

export const nowAtom = atom<number>(Math.floor(Date.now() / 1000));
export const localeAtom = atom<"ja" | "en">("en");
export const creatingAuctionAtom = atom<any>({});
export const waitingCreationTxAtom = atom<`0x${string}` | undefined>(undefined);
