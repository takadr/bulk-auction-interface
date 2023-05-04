import { Circle } from 'rc-progress';
import { chakra, Spinner, Toast, Link, Heading, BoxProps } from "@chakra-ui/react";
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, tokenAmountFormat, getEtherscanLink } from "../../../utils";

type Props = {
  totalProvided: bigint;
  interimGoalAmount: bigint;
  finalGoalAmount: bigint;
  providedTokenSymbol: string;
  providedTokenDecimal: number;
  fiatSymbol: string;
  fiatRate: number;
  contractAddress: string;
  started: boolean;
};

// const LeftCirclePosition = styled.div`
//   position: relative;
//   min-width: 500px;

//   @media (max-width: 600px) {
//     width: 100%;
//     min-width: 0;
//   }
// `;

// const InnerPosition = styled.span`
//   display: inline-block;
//   position: absolute;
//   top: 150px;
//   left: 0;
//   font-size: 2rem;
//   text-align: center;
//   width: 100%;
//   z-index: 100;

//   @media (max-width: 600px) {
//     top: 20%;
//     left: 0;
//   }
// `;

// const StarPosition = styled.span`
//   display: inline-block;
//   position: absolute;
//   top: 58%;
//   right: 1%;
//   font-size: 2.5rem;
//   z-index: 100;
// `;

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
        <Link href={getEtherscanLink(chain, contractAddress, 'address')}>
          <Circle
            percent={getTargetPercetage(totalProvided, finalGoalAmount)}
            strokeWidth={4}
            strokeColor="#D3D3D3"
          />
          {/* <StarPosition>
            <StarTwoTone />
          </StarPosition> */}
          <chakra.div textAlign={'center'} position={'absolute'} margin={'auto'} top={0} bottom={0} left={0} right={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Heading as={'h3'}>
              Total Provided
            </Heading>
            <chakra.div>
              <>
                {started && !isDifferentialNetwork ? tokenAmountFormat(totalProvided, providedTokenDecimal, 2) : '????'}{' '}
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
                  {totalProvided >= interimGoalAmount ? 'Achieved🎉' : ''}
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
