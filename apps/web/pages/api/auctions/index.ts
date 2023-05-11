import { NextApiRequest, NextApiResponse } from 'next';
import { scanAuctions, addAuction } from 'ui/utils/auctions';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'GET':
        try {
            const { lastEvaluatedKeyId, lastEvaluatedKeyCreatedAt } = req.query;
            const auctions = await scanAuctions(lastEvaluatedKeyId as string, lastEvaluatedKeyCreatedAt as string);
            res.json({ auctions })
        } catch (_error) {
            console.log(_error.message)
            res.status(500).end(_error.message);
        }
        break
        case 'POST':
        try {
            const auction = req.body;
            console.log(auction)
            const result = await addAuction(auction);
            res.json({ result })
        } catch (_error) {
            console.log(_error.message)
            res.status(500).end(_error.message);
        }
        break
        default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default handler;