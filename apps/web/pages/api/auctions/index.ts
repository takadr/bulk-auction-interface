import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { erc20ABI } from 'wagmi';
import { ethers } from 'ethers';
import { scanAuctions, addAuction, updateAuction } from 'lib/utils/auctions';
import SaleTemplateV1ABI from 'lib/constants/abis/SaleTemplateV1.json';
import ironOptions from 'lib/constants/ironOptions';
import { CHAIN_IDS } from 'lib/constants';

const availableNetwork = Object.values(CHAIN_IDS);

const requireContractOwner = (req: NextApiRequest): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!req.session.siwe) return reject('Unauthorized');
            const auction = req.body;
            const provider = ethers.getDefaultProvider(req.session.siwe.chainId);
            const auctionContract = new ethers.Contract(auction.id, SaleTemplateV1ABI, provider);
            const contractOwner = await auctionContract.owner()
            if(contractOwner !== req.session.siwe.address) reject('You are not the owner of this contract');
            resolve({auction, auctionContract, provider});
        } catch (error) {
            reject(error.message);
        }
    });
};

const requireAvailableNetwork = (req: NextApiRequest) => {
    if(!availableNetwork.includes(req.session.siwe.chainId)) throw new Error('Wrong network');
}

const getTokenInfo = async (tokenAddress, provider) => {
    const token = new ethers.Contract(tokenAddress, erc20ABI, provider);
    const result = await Promise.all([token.name(), token.symbol(), token.decimals()])
    return { tokenName: result[0], tokenSymbol: result[1], tokenDecimal: result[2] }
}

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
            const { auction, auctionContract, provider } = await requireContractOwner(req);
            requireAvailableNetwork(req);
            const tokenAddress = await auctionContract.erc20onsale()
            const {tokenName, tokenSymbol, tokenDecimal} = await getTokenInfo(tokenAddress, provider);
            const result = await addAuction({...auction, tokenName, tokenSymbol, tokenDecimal});
            res.json({ result })
        } catch (_error) {
            console.log(_error.message)
            res.status(500).end(_error.message);
        }
        break
        case 'PUT':
        try {
            const { auction, auctionContract, provider } = await requireContractOwner(req);
            requireAvailableNetwork(req);
            const tokenAddress = await auctionContract.erc20onsale()
            const {tokenName, tokenSymbol, tokenDecimal} = await getTokenInfo(tokenAddress, provider);
            const result = await updateAuction({...auction, tokenName, tokenSymbol, tokenDecimal});
            res.json({ result })
        } catch (_error) {
            console.log(_error.message)
            res.status(500).end(_error.message);
        }
        break
        default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions);