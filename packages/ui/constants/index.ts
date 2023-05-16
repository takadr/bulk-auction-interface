export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

export const LOCK_DURATION: {[key: string]: number} = {
    // SaleTemplateV1 -> 1 day
    "0x53616c6554656d706c6174655631000000000000000000000000000000000000": 86400
}

export const EXPIRATION_DURATION: {[key: string]: number} = {
    // SaleTemplateV1 -> 30 days
    "0x53616c6554656d706c6174655631000000000000000000000000000000000000": 2592000
}

export const FEE_RATE_PER_MIL: {[key: string]: number} = {
    // SaleTemplateV1
    "0x53616c6554656d706c6174655631000000000000000000000000000000000000": 1
}