import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { erc20ABI } from "wagmi";
import { ethers } from "ethers";
import { scanMetaData, addMetaData, updateSale } from "lib/dynamodb/metaData";
import SaleTemplateV1ABI from "lib/constants/abis/SaleTemplateV1.json";
import ironOptions from "lib/constants/ironOptions";
import { CHAIN_IDS } from "lib/constants";

const availableNetwork = Object.values(CHAIN_IDS);

const requireContractOwner = (req: NextApiRequest): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.session.siwe) return reject("Unauthorized");
      const metaData = req.body;
      const provider = ethers.getDefaultProvider(req.session.siwe.chainId, {
        infura: process.env.NEXT_PUBLIC_INFURA_API_TOKEN,
      });
      const saleContract = new ethers.Contract(
        metaData.id,
        SaleTemplateV1ABI,
        provider
      );
      const contractOwner = await saleContract.owner();
      if (contractOwner !== req.session.siwe.address)
        reject("You are not the owner of this contract");
      resolve({ metaData, saleContract, provider });
    } catch (error) {
      reject(error.message);
    }
  });
};

const requireAvailableNetwork = (req: NextApiRequest) => {
  if (!availableNetwork.includes(req.session.siwe.chainId))
    throw new Error("Wrong network");
};

const getTokenInfo = async (tokenAddress, provider) => {
  const token = new ethers.Contract(tokenAddress, erc20ABI, provider);
  const result = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
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
          lastEvaluatedKeyCreatedAt as string
        );
        res.json({ metaData });
      } catch (_error) {
        console.log(_error.message);
        res.status(500).end(_error.message);
      }
      break;
    case "POST":
      try {
        const { metaData, saleContract, provider } = await requireContractOwner(
          req
        );
        requireAvailableNetwork(req);
        const tokenAddress = await saleContract.erc20onsale();
        const { tokenName, tokenSymbol, tokenDecimal } = await getTokenInfo(
          tokenAddress,
          provider
        );
        const result = await addMetaData({
          ...metaData,
          tokenName,
          tokenSymbol,
          tokenDecimal,
        });
        res.json({ result });
      } catch (_error) {
        console.log(_error.message);
        res.status(500).end(_error.message);
      }
      break;
    case "PUT":
      try {
        const { metaData, saleContract, provider } = await requireContractOwner(
          req
        );
        requireAvailableNetwork(req);
        const tokenAddress = await saleContract.erc20onsale();
        const { tokenName, tokenSymbol, tokenDecimal } = await getTokenInfo(
          tokenAddress,
          provider
        );
        const result = await updateSale({
          ...metaData,
          tokenName,
          tokenSymbol,
          tokenDecimal,
        });
        res.json({ result });
      } catch (_error) {
        console.log(_error.message);
        res.status(500).end(_error.message);
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
