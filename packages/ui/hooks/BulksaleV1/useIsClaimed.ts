import { useState } from "react";
import { ethers } from "ethers";
import SaleTemplateV1ABI from '../../constants/abis/SaleTemplateV1.json';
import { CHAIN_NAMES } from "../../constants";
import { Sale } from "../../types/BulksaleV1";
import useSWR, { SWRResponse } from "swr";

export default function useSWRIsClaimed(sale: Sale, address: `0x${string}`|undefined): SWRResponse<boolean|undefined, Error> {
    const provider = ethers.getDefaultProvider(CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID as string])
    const saleContract = new ethers.Contract(sale.id as string, SaleTemplateV1ABI, provider)
    const filter = saleContract.filters.Claimed(address)

    const fetcher = (url: string): Promise<boolean|undefined> => provider.getLogs({...filter, fromBlock: parseInt(sale.blockNumber)}).then(log => log.length > 0)
    return useSWR<boolean|undefined, Error>(`isClaimed:${sale.id}-${address}`, fetcher);
}