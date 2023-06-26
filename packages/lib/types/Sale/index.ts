import { URL_REGEX } from "../../constants";
import Big from "../../utils/bignumber";

export type Sale = {
    id?: string;
    templateName: string;
    token: `0x${string}` | null;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimals: number;
    owner?: `0x${string}`;
    distributeAmount: Big;
    startingAt: number; //Timestamp
    closingAt: number; //Timestamp
    minimalProvideAmount: Big;
    lockDuration?: number; //In sec
    expirationDuration?: number; //In sec
    feeRatePerMil?: number;
    totalProvided: Big;
    blockNumber: string; // Deployed block number
}

export type SaleForm = {
    templateName: string;
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

export type Template = {
    id: string;
    templateName: `0x${string}`;
    addedAt: Big; //Timestamp
}

export const validateMetaData = (metaData: MetaData, minimumProvided?: number) => {
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
    if(metaData.interimGoalAmount && metaData.finalGoalAmount && Number(metaData.interimGoalAmount) > Number(metaData.finalGoalAmount)) {
        errors.finalGoalAmount = 'Maximum total raised must be bigger than Target total raised';
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
    if(minimumProvided && metaData.interimGoalAmount && Number(minimumProvided) > Number(metaData.interimGoalAmount)) {
        errors.interimGoalAmount = `Target total raised must be bigger than or equal to Minimum total raised (${minimumProvided} ETH)`
    }
    return errors;
};