import { ethers } from "ethers";
import SaleTemplateV1ABI from "lib/constants/abis/SaleTemplateV1.json";
import { CHAIN_NAMES } from "lib/constants";
import { Sale } from "lib/types/Sale";
import useSWR, { SWRResponse } from "swr";

export default function useSWRReceivedLog(
  sale: Sale
): SWRResponse<any[] | undefined, Error> {
  const provider = ethers.getDefaultProvider(
    CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID as string],
    { infura: process.env.NEXT_PUBLIC_INFURA_API_TOKEN }
  );
  const saleContract = new ethers.Contract(
    sale.id as string,
    SaleTemplateV1ABI,
    provider
  );
  const filter = saleContract.filters.Received();

  const getExpectedBlockNumberWithBuffer = (
    fromBlock: number,
    durationInSec: number
  ) => {
    return fromBlock + Math.ceil(durationInSec / 12);
  };

  const toBlock = getExpectedBlockNumberWithBuffer(
    parseInt(sale.blockNumber),
    sale.closingAt - sale.startingAt
  );

  const fetcher = (url: string): Promise<any[] | undefined> =>
    provider
      .getLogs({
        ...filter,
        fromBlock: parseInt(sale.blockNumber),
        toBlock: toBlock,
      })
      .then((log) => log);

  return useSWR<any[] | undefined, Error>(`received:${sale.id}`, fetcher, {});
}
