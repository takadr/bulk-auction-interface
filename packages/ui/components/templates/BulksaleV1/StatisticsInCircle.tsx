import { Circle } from 'rc-progress';
import { chakra, Spinner, Toast, Link } from "@chakra-ui/react";
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, getEtherscanLink } from "../../../utils";

type Props = {
  totalProvided: bigint;
  interimGoalAmount: bigint;
  finalGoalAmount: bigint;
  providedTokenSymbol: string;
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
  fiatSymbol,
  fiatRate,
  contractAddress,
  started,
}: Props) {
  // const { chainId } = useActiveWeb3React();
  // const isDifferentialNetwork = !(targetedChainId === chainId);
  // TODO
  const chain = 'sepolia';
  const isDifferentialNetwork = false;
  const targetedChain = 'sepolia';

  return (
    <chakra.div>
      <Link href={getEtherscanLink(chain, contractAddress, 'address')}>
        <Circle
          percent={getTargetPercetage(totalProvided, finalGoalAmount)}
          strokeWidth={4}
          strokeColor="#D3D3D3"
        />
        {/* <StarPosition>
          <StarTwoTone />
        </StarPosition> */}
        <chakra.div>
          <h3
            style={{
              fontSize: '2rem',
            }}
          >
            Total Provided
          </h3>
          <div
            style={{
              fontSize: '3rem',
              lineHeight: '3.5rem',
            }}
          >
            {started && !isDifferentialNetwork ? totalProvided : '????'}{' '}
            {providedTokenSymbol.toUpperCase()}
          </div>
          <span
            style={{
              fontSize: '2rem',
            }}
          >
            { // TODO
            }
            ¥
            {started && !isDifferentialNetwork
              ? '' +
                getFiatConversionAmount(parseInt(totalProvided.toString()), fiatRate)
              : '????'}
          </span>
          <div
            style={{
              textAlign: 'center',
              fontSize: '1rem',
              marginTop: '10px',
            }}
          >
            {!!interimGoalAmount && !isDifferentialNetwork ? (
              <>
                目標 {interimGoalAmount}
                {providedTokenSymbol.toUpperCase()} {' 以上'}
                {totalProvided >= interimGoalAmount ? 'を達成しました🎉' : ''}
              </>
            ) : (
              <p
                style={{
                  color: 'black',
                }}
              >
                {targetedChain}に接続してください。
              </p>
            )}
          </div>
        </chakra.div>
      </Link>
    </chakra.div>
  );
}
