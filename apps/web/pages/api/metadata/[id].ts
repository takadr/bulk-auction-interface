import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { fetchMetaData } from "lib/dynamodb/metaData";
import ironOptions from "lib/constants/ironOptions";
import { CHAIN_IDS } from "lib/constants";

const availableNetwork = Object.values(CHAIN_IDS);

const requireAvailableNetwork = (chainId: number) => {
  if (!availableNetwork.includes(chainId)) throw new Error("Wrong network");
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { id } = req.query;
        // requireAvailableNetwork(chainId);
        const metaData = await fetchMetaData(id as string);
        res.json({ metaData });
      } catch (_error: any) {
        console.log(_error.message);
        res.status(500).end(_error.message);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
