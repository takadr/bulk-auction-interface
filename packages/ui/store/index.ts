import { atom } from "jotai";
import { useWaitForTransaction } from "wagmi";

type SessionType = {
  chainId?: number;
  account?: string;
};

type SaleTxType = {
    txs: any[];
}

// type SaleCloneType = {
//     addresses: `0x${string}`[];
// }

export const sessionsAtom = atom<SessionType>({});
export const saleTxAtom = atom<SaleTxType>({txs: []});
export const saleClonesAtom = atom<`0x${string}`[]>([]);
export const waitingTransactionAtom = atom<`0x${string}` | null>(null);