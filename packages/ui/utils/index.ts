import Big from 'big.js';
import { BigNumberValueType, add, divide, multiply } from './bignumber';
// TODO Consider using BigDecimal or libraries
// https://stackoverflow.com/questions/54409854/how-to-divide-two-native-javascript-bigints-and-get-a-decimal-result
// https://stackoverflow.com/questions/16742578/bigdecimal-in-javascript/66939244#66939244
export const getExpectedAmount = (myTotalDonations: BigNumberValueType, inputtingValue: BigNumberValueType, totalProvided: BigNumberValueType, totalDistributeAmount: BigNumberValueType) => {
    // console.log(myTotalDonations, inputtingValue, totalProvided, totalDistributeAmount)
    const donations = add(myTotalDonations, inputtingValue);
    const totalDonations = add(totalProvided, inputtingValue);
    if (totalDonations <= Big(0)) {
        return 0;
    }
    // console.log(Number(donations), Number(totalDonations), Number(totalDistributeAmount))
    return multiply(divide(donations, totalDonations), totalDistributeAmount);
    // return (Number(donations) / Number(totalDonations)) * Number(totalDistributeAmount);
}
export const getTargetPercetage = (totalProvided: BigNumberValueType, finalGoalAmount: BigNumberValueType): number => {
    if (finalGoalAmount <= Big(0)) {
        return 0;
    }
    return multiply(divide(totalProvided, finalGoalAmount), 100).toNumber();
    // return (parseFloat(totalProvided.toString())/parseFloat(finalGoalAmount.toString())) * 100;
}

export const getFiatConversionAmount = (token: number, fiatRate: number) => {
    return token * fiatRate;
}

export const tokenAmountFormat = (amount: BigNumberValueType, decimal: number, precision: number): string => {
    // const adjuster = 10**precision;
    const numerator = Big(10**decimal);
    return divide(amount, numerator).toFixed(precision);
}

export const getEtherscanLink = (
    chain: string,
    hash: string,
    type: 'tx' | 'token' | 'address' | 'block'
): string => {
    return `https://${chain === 'mainnet' ? '' : `${chain}.`}etherscan.io/${type}/${hash}`;
}