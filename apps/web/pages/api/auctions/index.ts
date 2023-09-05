import { DocumentNode } from "@apollo/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import ironOptions from "lib/constants/ironOptions";
import client from "lib/apollo/client";
import {
  LIST_ACTIVE_AND_UPCOMING_SALE_QUERY,
  LIST_ACTIVE_SALE_QUERY,
  LIST_UPCOMING_SALE_QUERY,
  LIST_CLOSED_SALE_QUERY,
  LIST_MY_SALE_QUERY,
  LIST_PARTICIPATED_SALE_QUERY,
} from "lib/apollo/query";
import { QueryType } from "lib/apollo/query";

const getQuery = (queryType: QueryType): DocumentNode => {
  switch (queryType) {
    case QueryType.ACTIVE_AND_UPCOMING:
      return LIST_ACTIVE_AND_UPCOMING_SALE_QUERY;
    case QueryType.ACTIVE:
      return LIST_ACTIVE_SALE_QUERY;
    case QueryType.UPCOMING:
      return LIST_UPCOMING_SALE_QUERY;
    case QueryType.CLOSED:
      return LIST_CLOSED_SALE_QUERY;
    case QueryType.MY_SALE_QUERY:
      return LIST_MY_SALE_QUERY;
    case QueryType.PARTICIPATED_SALE_QUERY:
      return LIST_PARTICIPATED_SALE_QUERY;
    default:
      return LIST_ACTIVE_AND_UPCOMING_SALE_QUERY;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { queryTypeIndex, skip, first, now, id } = req.query;
  const queryType = Number(queryTypeIndex) as QueryType;
  switch (method) {
    case "GET":
      const result = await client.query({
        query: getQuery(queryType),
        variables: {
          skip: Number(skip),
          first: Number(first),
          now: Number(now),
          id: id,
        },
      });
      res.send(result);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
