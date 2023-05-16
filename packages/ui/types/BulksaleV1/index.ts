export type Sale = {
    token: `0x${string}` | null;
    owner?: `0x${string}`;
    distributeAmount: number;
    startingAt: number; //Timestamp
    eventDuration: number; //In sec
    minimalProvideAmount: number;
    lockDuration?: number; //In sec
    expirationDuration?: number; //In sec
    feeRatePerMil?: number;
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