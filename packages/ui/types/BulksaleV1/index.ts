import { URL_REGEX } from "../../constants";

export type Sale = {
    id?: string;
    token: `0x${string}` | null;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimals: number;
    owner?: `0x${string}`;
    distributeAmount: number;
    startingAt: number; //Timestamp
    closingAt: number; //Timestamp
    minimalProvideAmount: number;
    lockDuration?: number; //In sec
    expirationDuration?: number; //In sec
    feeRatePerMil?: number;
    totalProvided: number;
    blockNumber: string; // Deployed block number
}

export type SaleForm = {
    token: `0x${string}` | null;
    owner: `0x${string}`;
    distributeAmount: number;
    startingAt: number; //Timestamp
    eventDuration: number; //Timestamp
    minimalProvideAmount: number;
}

export type MetaData = {
    id?: string;
    title?: string;
    description?: string;
    terms?: string;
    projectURL?: string;
    logoURL?: string;
    otherURL?: string;
    interimGoalAmount?: number;
    finalGoalAmount?: number;
    tokenName?: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
    templateName?: string;
    createdAt?: number;
}

export const validateMetaData = (metaData: MetaData) => {
    const errors: any = {};
    if(!metaData.id) {
        errors.id = 'Contract address is required';
    }
    if(metaData.title && metaData.title.length > 100) {
        errors.title = 'Max length is 100';
    }
    if(metaData.description && metaData.description.length > 1000) {
        errors.description = 'Max length is 1000';
    }
    if(metaData.terms && metaData.terms.length > 1000) {
        errors.terms = 'Max length is 1000';
    }
    if(metaData.interimGoalAmount && metaData.finalGoalAmount && metaData.interimGoalAmount > metaData.finalGoalAmount) {
        errors.finalGoalAmount = 'Final Goal Amount must be bigger than Interim Goal Amount';
    }
    if(metaData.projectURL && !URL_REGEX.test(metaData.projectURL)){
        errors.projectURL = 'Invalid URL format'
    }
    if(metaData.logoURL && !URL_REGEX.test(metaData.logoURL)){
        errors.logoURL = 'Invalid URL format'
    }
    if(metaData.otherURL && !URL_REGEX.test(metaData.otherURL)){
        errors.otherURL = 'Invalid URL format'
    }
    return errors;
};