import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log(process.env);
  console.log(process.env.IRON_SESSION_COOKIE_NAME);
  console.log(process.env.IRON_SESSION_PASSWORD);
  console.log(process.env.AWS_ACCESS_KEY_ID);
  console.log(process.env.AWS_SECRET_ACCESS_KEY);
  console.log(process.env.AWS_REGION);
  console.log(process.env.AWS_DYNAMO_TABLE_NAME);
  console.log(process.env._AWS_ACCESS_KEY_ID);
  console.log(process.env._AWS_SECRET_ACCESS_KEY);
  console.log(process.env._AWS_REGION);
  console.log(process.env._AWS_DYNAMO_TABLE_NAME);
  console.log(process.env.NEXT_PUBLIC_INFURA_API_TOKEN);
  console.log(process.env.NEXT_PUBLIC_CHAIN_ID);
  res.status(200).json({ test: "ok" });
}
