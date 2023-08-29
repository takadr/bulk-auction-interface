import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import ironOptions from "lib/constants/ironOptions";
import { LIST_TEMPLATE_QUERY } from "lib/apollo/query";
import client from "lib/apollo/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const result = await client.query({
        query: LIST_TEMPLATE_QUERY,
      });
      res.send(result);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
