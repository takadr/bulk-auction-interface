import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log(process.env);
  console.log(process.env.IRON_SESSION_COOKIE_NAME);
  console.log("---");
  console.log(process.env.__NEXT_PRIVATE_STANDALONE_CONFIG);
  res.status(200).json({ test: "ok" });
}
