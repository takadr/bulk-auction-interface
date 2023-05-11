export type Sale = {
    token: `0x${string}` | null;
    startingAt: number; //Timestamp
    eventDuration: number; //In sec
    lockDuration: number; //In sec
    expirationDuration: number; //In sec
    totalDistributeAmount: number;
    minimalProvideAmount: number;
    owner?: `0x${string}`;
    feeRatePerMil: number;
}