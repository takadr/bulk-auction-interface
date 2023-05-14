import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { fetchAuction } from 'ui/utils/auctions';
import ironOptions from 'ui/constants/ironOptions';

const availableNetwork = [1, 11155111]; //Mainnet & Sepolia

const requireAvailableNetwork = (req: NextApiRequest) => {
    if(!availableNetwork.includes(req.session.siwe.chainId)) throw new Error('Wrong network');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'GET':
        try {
            requireAvailableNetwork(req);
            const { id } = req.query;
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