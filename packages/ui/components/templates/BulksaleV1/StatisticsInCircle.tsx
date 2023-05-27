import { chakra, Link, Heading, BoxProps } from "@chakra-ui/react";
import { Circle } from 'rc-progress';
import Big from '../../../utils/bignumber';
import { getTargetPercetage, getFiatConversionAmount, tokenAmountFormat, getEtherscanLink } from "../../../utils";
import { CHAIN_NAMES } from '../../../constants';

type Props = {
  totalProvided: Big;
  interimGoalAmount: Big;
  finalGoalAmount: Big;
  providedTokenSymbol: string;
  providedTokenDecimal: number;
  fiatSymbol: string;
  fiatRate: number;
  contractAddress: string;
  started: boolean;
};

export default function StatisticsInCircle({
  totalProvided,
  interimGoalAmount,
  finalGoalAmount,
  providedTokenSymbol,
  providedTokenDecimal,
  fiatSymbol,
  fiatRate,
  contractAddress,
  started,
  ...boxProps
}: Props & BoxProps) {
  const chain = CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID as string];

  return (
    <chakra.div {...boxProps}>
      <chakra.div position={'relative'}>
        <Link href={getEtherscanLink(chain, contractAddress, 'address')} target={'_blank'}>
          <Circle
            percent={getTargetPercetage(totalProvided, finalGoalAmount)}
            strokeWidth={4}
            strokeColor={'#48BB78'}
          />
          <chakra.div textAlign={'center'} position={'absolute'} margin={'auto'} top={0} bottom={0} left={0} right={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Heading as={'h3'} fontSize={'lg'}>
              Total Provided
            </Heading>
            <chakra.div>
              <>
                <chakra.span fontSize={'2xl'}>{started ? tokenAmountFormat(totalProvided, providedTokenDecimal, 2) : '????'}{' '}</chakra.span>
                {providedTokenSymbol.toUpperCase()}
              </>
            </chakra.div>
            <span>
              {
                // TODO Fiat symbol ($, ¥)
                '$'
              }
              {started
                ? '' +
                  getFiatConversionAmount(Number(tokenAmountFormat(totalProvided, providedTokenDecimal, 2)), fiatRate).toFixed(2)
                : '????'}
            </span>
            <div>
              {!!interimGoalAmount && 
                <chakra.div textAlign={'center'}>
                  Minimum Target {tokenAmountFormat(interimGoalAmount, 18, 2)}
                  {providedTokenSymbol.toUpperCase()}
                  { 
                    totalProvided.gte(interimGoalAmount) && started && 
                    <chakra.span textAlign={'center'}> 🎉</chakra.span>
                  }
                </chakra.div>
              }
              {/* {
              !!finalGoalAmount && 
                <chakra.div textAlign={'center'}>
                  FINAL GOAL {tokenAmountFormat(finalGoalAmount, 18, 2)}
                  {providedTokenSymbol.toUpperCase()}
                  { 
                    totalProvided.gte(finalGoalAmount) && started && 
                    <chakra.span textAlign={'center'}> 🎉</chakra.span>
                  }
                </chakra.div>
              } */}
            </div>
          </chakra.div>
        </Link>
      </chakra.div>
    </chakra.div>
  );
}
