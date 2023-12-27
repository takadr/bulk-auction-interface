import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(process.env);
  res.status(200).json({ test: "ok" });
}
