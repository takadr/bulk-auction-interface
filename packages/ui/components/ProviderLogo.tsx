
import { Image, ImageProps } from '@chakra-ui/react';
import metamaskLogo from '../images/metamask-fox.svg';
import coinbaseLogo from '../images/coinbase-wallet-logo.png';
import walletConnectLogo from '../images/wallet-connect-logo.png';

const logoMap: {[key: string]: any} = {
    'metaMask': metamaskLogo,
    'coinbaseWallet': coinbaseLogo,
    'walletConnect': walletConnectLogo
}

export default function ProviderLogo({connectorId, ...props}: {connectorId: string} & ImageProps) {
    return <Image {...props} src={logoMap[connectorId].src} />
}