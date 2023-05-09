import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import ironOptions from 'ui/constants/ironOptions';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      req.session.destroy()
      // TODO
      // Before going to production, you likely want to invalidate nonces on logout to prevent replay attacks through session duplication (e.g. store expired nonce and make sure they can't be used again).
      res.send({ ok: true })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withIronSessionApiRoute(handler, ironOptions);