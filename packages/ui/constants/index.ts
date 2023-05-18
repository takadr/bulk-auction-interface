export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

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