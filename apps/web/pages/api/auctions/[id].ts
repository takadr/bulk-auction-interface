import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { fetchAuction } from 'lib/utils/auctions';
import ironOptions from 'lib/constants/ironOptions';

const availableNetwork = [1, 11155111]; //Mainnet & Sepolia

const requireAvailableNetwork = (chainId) => {
    if(!availableNetwork.includes(chainId)) throw new Error('Wrong network');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'GET':
        try {
            const { id } = req.query;
            // requireAvailableNetwork(chainId);
            const auction = await fetchAuction(id as string);
            res.json({ auction })
        } catch (_error) {
            console.log(_error.message)
            res.status(500).end(_error.message);
        }
        break
        default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions);