import Big from 'big.js';
import { BigNumberValueType, add, divide, multiply, getBigNumber } from './bignumber';
// TODO Consider using BigDecimal or libraries
// https://stackoverflow.com/questions/54409854/how-to-divide-two-native-javascript-bigints-and-get-a-decimal-result
// https://stackoverflow.com/questions/16742578/bigdecimal-in-javascript/66939244#66939244

// From SaleTemplateV1
export const calculateAllocation = (us: Big, tp: Big, tda: Big): Big => {
  let al = Big(0);
  if(tda.lt(tp)){
      al = (us.mul(tda)).div(tp);
  } else {
      /* sender's share is very tiny and so calculate tda/tp first */
      al = us.mul(tda.div(tp));
  }
  return al.round(0, 0)
}

export const getExpectedAmount = (myTotalDonations: BigNumberValueType, inputtingValue: BigNumberValueType, totalProvided: BigNumberValueType, distributeAmount: BigNumberValueType): Big => {
    const donations = add(myTotalDonations, inputtingValue);
    const totalDonations = add(totalProvided, inputtingValue);
    if (totalDonations.lte(Big(0))) {
        return Big(0);
    }
    return calculateAllocation(donations, totalDonations, getBigNumber(distributeAmount))
}

export const getTargetPercetage = (totalProvided: BigNumberValueType, finalGoalAmount: BigNumberValueType): number => {
    if (getBigNumber(finalGoalAmount).lte(Big(0))) {
        return 0;
    }
    return Math.min(100, multiply(divide(totalProvided, finalGoalAmount), 100).toNumber());
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

type Countdown = { days: string; hours: string; mins: string; secs: string };

export const getCountdown = (duration: number): Countdown => {
    let restSec = duration;
    const countdown: Countdown = {
        days: '00',
        hours: '00',
        mins: '00',
        secs: '00',
    };
    if (restSec >= 86400) {
      countdown.days = Math.floor(restSec / 86400).toString();
      restSec = restSec % 86400;
    }
    if (restSec >= 3600) {
      countdown.hours = Math.floor(restSec / 3600).toString().padStart(2, '0');
      restSec = restSec % 3600;
    }
    if (restSec >= 60) {
      countdown.mins = Math.floor(restSec / 60).toString().padStart(2, '0');
      restSec = restSec % 60;
    }
    countdown.secs = restSec > 0 ? restSec.toString().padStart(2, '0') : '00';
  
    return countdown;
  }

  export const getDomainFromURL = (url: string) => {
    return new URL(url).hostname;  
  }

  export const ellipsisText = (text: string, maxLength: number, ellipsis="..."): string => {
    return text.length >= maxLength
    ? text.slice(0, maxLength - ellipsis.length) + ellipsis
    : text
  }