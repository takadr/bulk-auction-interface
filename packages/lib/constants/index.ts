export const CHAIN_NAMES: {[key: string]: 'mainnet'|'sepolia'} = {
    '1': 'mainnet',
    '11155111': 'sepolia',
}

export const CHAIN_IDS = {
    'mainnet': 1,
    'sepolia': 11155111,
}

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETHER_DECIMALS_FOR_VIEW = 2

export const SALE_TEMPLATE_V1_NAME = "0x53616c6554656d706c6174655631000000000000000000000000000000000000"

export const LOCK_DURATION: {[key: string]: number} = {
    // SaleTemplateV1 -> 1 day
    [SALE_TEMPLATE_V1_NAME]: 86400
}

export const EXPIRATION_DURATION: {[key: string]: number} = {
    // SaleTemplateV1 -> 30 days
    [SALE_TEMPLATE_V1_NAME]: 2592000
}

export const FEE_RATE_PER_MIL: {[key: string]: number} = {
    // SaleTemplateV1
    [SALE_TEMPLATE_V1_NAME]: 1
}

export const URL_REGEX = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

export const SAMPLE_DISCLAIMERS = `By participating in this token sale event, you acknowledge and agree that the use of this protocol is subject to jurisdictional requirements and is solely at your own risk. 
This protocol is not intended to comply with specific laws and regulations. 
It operates the same way for all users. Furthermore, in the event of any bugs or issues, no party shall be held liable for any defects or malfunctions.
`