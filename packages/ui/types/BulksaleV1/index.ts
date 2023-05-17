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
    title: string;
    description: string;
    terms: string;
    projectURL: string;
    logoURL: string;
    otherURLs: string[];
    interimGoalAmount: number;
    finalGoalAmount: number;
    tokenName?: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
    templateName?: string;
    createdAt?: number;
}