import { Circle } from 'rc-progress';
import Big from '../../../utils/bignumber';
import { chakra, Spinner, Toast, Link, Heading, BoxProps } from "@chakra-ui/react";
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, tokenAmountFormat, getEtherscanLink } from "../../../utils";

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
  // const { chainId } = useActiveWeb3React();
  // const isDifferentialNetwork = !(targetedChainId === chainId);
  // TODO
  const chain = 'sepolia';
  const isDifferentialNetwork = false;
  const targetedChain = 'sepolia';

  return (
    <chakra.div {...boxProps}>
      <chakra.div position={'relative'}>
        <Link href={getEtherscanLink(chain, contractAddress, 'address')} target={'_blank'}>
          <Circle
            percent={getTargetPercetage(totalProvided, finalGoalAmount)}
            strokeWidth={4}
            strokeColor={'#48BB78'}
          />
          {/* <StarPosition>
            <StarTwoTone />
          </StarPosition> */}
          <chakra.div textAlign={'center'} position={'absolute'} margin={'auto'} top={0} bottom={0} left={0} right={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Heading as={'h3'} fontSize={'lg'}>
              Total Provided
            </Heading>
            <chakra.div>
              <>
                <chakra.span fontSize={'2xl'}>{started && !isDifferentialNetwork ? tokenAmountFormat(totalProvided, providedTokenDecimal, 2) : '????'}{' '}</chakra.span>
                {providedTokenSymbol.toUpperCase()}
              </>
            </chakra.div>
            <span>
              {
                // TODO Fiat symbol ($, ¥)
                '$'
              }
              {started && !isDifferentialNetwork
                ? '' +
                  getFiatConversionAmount(Number(tokenAmountFormat(totalProvided, providedTokenDecimal, 2)), fiatRate)
                : '????'}
            </span>
            <div>
              {!!interimGoalAmount && !isDifferentialNetwork ? (
                <>
                  GOAL {tokenAmountFormat(interimGoalAmount, 18, 2)}
                  {providedTokenSymbol.toUpperCase()}
                  {totalProvided.gte(interimGoalAmount) ? 'Achieved🎉' : ''}
                </>
              ) : (
                <p>
                  Please connect to {targetedChain}
                </p>
              )}
            </div>
          </chakra.div>
        </Link>
      </chakra.div>
    </chakra.div>
  );
}
