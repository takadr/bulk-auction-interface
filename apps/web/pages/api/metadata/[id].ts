import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { fetchMetaData } from "lib/dynamodb/metaData";
import ironOptions from "lib/constants/ironOptions";

const availableNetwork = [Number(process.env.NEXT_PUBLIC_CHAIN_ID)];

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
