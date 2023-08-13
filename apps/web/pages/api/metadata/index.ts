import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { erc20ABI } from "wagmi";
import {
  createPublicClient,
  http,
  fallback,
  getContract,
  PublicClient,
  GetContractReturnType,
  Abi,
  Transport,
} from "viem";
import { mainnet, goerli, sepolia, localhost, Chain } from "viem/chains";
import { scanMetaData, addMetaData, updateSale } from "lib/dynamodb/metaData";
import TemplateV1ABI from "lib/constants/abis/TemplateV1.json";
import ironOptions from "lib/constants/ironOptions";
import { CHAIN_IDS, CHAIN_NAMES } from "lib/constants";

// const availableNetwork = Object.values(CHAIN_IDS);
const availableNetwork = [Number(process.env.NEXT_PUBLIC_CHAIN_ID)];

const getViemChain = (chainName: string) => {
  if (chainName === "mainnet") {
    return mainnet;
  } else if (chainName === "goerli") {
    return goerli;
  } else if (chainName === "sepolia") {
    return sepolia;
  } else {
    return localhost;
  }
};

const getViemProvider = (chainId: number) => {
  const chainName = CHAIN_NAMES[chainId];
  // const alchemy = http(`https://eth-${chainName}.g.alchemy.com/v2/${}`)
  const infura = http(
    `https://${chainName}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_TOKEN}`,
  );
  const client = createPublicClient({
    chain: getViemChain(chainName),
    transport: fallback([infura]),
  });
  return client;
};

const requireContractOwner = (
  req: NextApiRequest,
): Promise<{
  metaData: any;
  saleContract: GetContractReturnType<typeof TemplateV1ABI, PublicClient>;
  provider: PublicClient<Transport, Chain>;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.session.siwe) return reject("Unauthorized");
      const metaData = req.body;
      const provider = getViemProvider(req.session.siwe.chainId);
      const saleContract = getContract({
        address: metaData.id,
        abi: TemplateV1ABI,
        publicClient: provider,
      });
      const contractOwner = await saleContract.read.owner();
      if (contractOwner !== req.session.siwe.address)
        reject("You are not the owner of this contract");
      resolve({ metaData, saleContract, provider });
    } catch (error: any) {
      reject(error.message);
    }
  });
};

const requireAvailableNetwork = (req: NextApiRequest) => {
  if (!req.session.siwe) throw new Error("Sign in required");
  if (!availableNetwork.includes(req.session.siwe.chainId))
    throw new Error("Wrong network");
};

const getTokenInfo = async (
  tokenAddress: `0x${string}`,
  provider: PublicClient,
) => {
  const token = getContract({
    address: tokenAddress,
    abi: erc20ABI,
    publicClient: provider,
  });
  const result = await Promise.all([
    token.read.name(),
    token.read.symbol(),
    token.read.decimals(),
  ]);
  return {
    tokenName: result[0],
    tokenSymbol: result[1],
    tokenDecimal: result[2],
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { lastEvaluatedKeyId, lastEvaluatedKeyCreatedAt } = req.query;
        const metaData = await scanMetaData(
          lastEvaluatedKeyId as string,
          lastEvaluatedKeyCreatedAt as string,
        );
        res.json({ metaData });
      } catch (_error: any) {
        console.log(_error);
        res.status(500).end(String(_error));
      }
      break;
    case "POST":
      try {
        requireAvailableNetwork(req);
        const { metaData, saleContract, provider } = await requireContractOwner(
          req,
        );
        const result = await addMetaData(metaData);
        res.json({ result });
      } catch (_error) {
        console.log(_error);
        res.status(500).end(String(_error));
      }
      break;
    case "PUT":
      try {
        requireAvailableNetwork(req);
        const { metaData, saleContract, provider } = await requireContractOwner(
          req,
        );
        const result = await updateSale(metaData);
        res.json({ result });
      } catch (_error: any) {
        console.log(_error);
        res.status(500).end(String(_error));
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
