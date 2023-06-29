import { chakra, Heading, BoxProps, useToken, Tooltip } from "@chakra-ui/react";
import { Circle } from "rc-progress";
import Big from "lib/utils/bignumber";
import {
  getTargetPercetage,
  getFiatConversionAmount,
  etherAmountFormat,
  formatEther,
} from "lib/utils";
import { CHAIN_NAMES } from "lib/constants";
import { TriangleUpIcon } from "@chakra-ui/icons";

type Props = {
  totalRaised: Big;
  minRaisedAmount: Big;
  targetTotalRaised: Big;
  maximumTotalRaised: Big;
  raisedTokenSymbol: string;
  raisedTokenDecimal: number;
  fiatSymbol: string;
  fiatRate: number;
  contractAddress: string;
  started: boolean;
};

export default function StatisticsInCircle({
  totalRaised,
  minRaisedAmount,
  targetTotalRaised,
  maximumTotalRaised,
  raisedTokenSymbol,
  raisedTokenDecimal,
  fiatSymbol,
  fiatRate,
  contractAddress,
  started,
  ...boxProps
}: Props & BoxProps) {
  const chain = CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID as string];

  const [gray600, green400] = useToken("colors", ["gray.600", "green.400"]);

  const progressPercent = getTargetPercetage(totalRaised, maximumTotalRaised);
  const minimumPercent = getTargetPercetage(
    minRaisedAmount,
    maximumTotalRaised
  );
  const targetTotalRaisedPercent = getTargetPercetage(
    targetTotalRaised,
    maximumTotalRaised
  );

  return (
    <chakra.div {...boxProps}>
      <chakra.div position={"relative"}>
        <Tooltip
          hasArrow
          label={
            <chakra.p textAlign={"center"} p={1}>
              Minimum: {etherAmountFormat(minRaisedAmount)}ETH
              {totalRaised.gte(minRaisedAmount) && (
                <>
                  <br /> Achieved 🎉
                </>
              )}
            </chakra.p>
          }
        >
          <TriangleUpIcon
            position={"absolute"}
            zIndex={100}
            transform={`rotate(${(minimumPercent * 360) / 100}deg)`}
            left={`calc(${
              ((Math.sin((minimumPercent / 100) * (2 * Math.PI)) + 1) * 100) / 2
            }% - 8px - ${
              Math.sin((minimumPercent / 100) * (2 * Math.PI)) * 5.1
            }%)`} // 5.1 is used for adjusting position of arrow. TODO: move it to util
            bottom={`calc(${
              ((Math.cos((minimumPercent / 100) * (2 * Math.PI)) + 1) * 100) / 2
            }% - 8px - ${
              Math.cos((minimumPercent / 100) * (2 * Math.PI)) * 5.1
            }%)`}
          />
        </Tooltip>
        <Tooltip
          hasArrow
          label={
            <chakra.p textAlign={"center"} p={1}>
              Target total raised: {etherAmountFormat(targetTotalRaised)}ETH
              {totalRaised.gte(targetTotalRaised) && (
                <>
                  <br /> Achieved 🎉
                </>
              )}
            </chakra.p>
          }
        >
          <TriangleUpIcon
            position={"absolute"}
            zIndex={100}
            transform={`rotate(${(targetTotalRaisedPercent * 360) / 100}deg)`}
            left={`calc(${
              ((Math.sin((targetTotalRaisedPercent / 100) * (2 * Math.PI)) +
                1) *
                100) /
              2
            }% - 8px - ${
              Math.sin((targetTotalRaisedPercent / 100) * (2 * Math.PI)) * 5.1
            }%)`}
            bottom={`calc(${
              ((Math.cos((targetTotalRaisedPercent / 100) * (2 * Math.PI)) +
                1) *
                100) /
              2
            }% - 8px - ${
              Math.cos((targetTotalRaisedPercent / 100) * (2 * Math.PI)) * 5.1
            }%)`}
          />
        </Tooltip>
        <Circle
          percent={progressPercent}
          // percent={[getTargetPercetage(totalRaised, maximumTotalRaised) / 3, getTargetPercetage(totalRaised, maximumTotalRaised) / 3, getTargetPercetage(totalRaised, maximumTotalRaised) / 3]}
          strokeWidth={4}
          trailWidth={4}
          // strokeLinecap="square"
          strokeColor={green400}
          trailColor={gray600}
        />
        <chakra.div
          textAlign={"center"}
          position={"absolute"}
          margin={"auto"}
          top={0}
          bottom={0}
          left={0}
          right={0}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Heading as={"h3"} fontSize={"lg"}>
            Total raised
          </Heading>
          <chakra.div>
            <>
              <chakra.span fontSize={"2xl"}>
                {started ? etherAmountFormat(totalRaised) : "????"}{" "}
              </chakra.span>
              {raisedTokenSymbol.toUpperCase()}
            </>
          </chakra.div>
          <span>
            {
              // TODO Fiat symbol ($, ¥)
              "$"
            }
            {started
              ? "" +
                getFiatConversionAmount(
                  Number(formatEther(totalRaised)),
                  fiatRate
                ).toFixed(2)
              : "????"}
          </span>
          <div>
            {!!targetTotalRaised && (
              <chakra.div textAlign={"center"}>
                Target total raised {etherAmountFormat(targetTotalRaised)}
                {raisedTokenSymbol.toUpperCase()}
                {totalRaised.gte(targetTotalRaised) && started && (
                  <chakra.span textAlign={"center"}> 🎉</chakra.span>
                )}
              </chakra.div>
            )}
            {/* {
            !!maximumTotalRaised && 
              <chakra.div textAlign={'center'}>
                FINAL GOAL {tokenAmountFormat(maximumTotalRaised, 18, 2)}
                {raisedTokenSymbol.toUpperCase()}
                { 
                  totalRaised.gte(maximumTotalRaised) && started && 
                  <chakra.span textAlign={'center'}> 🎉</chakra.span>
                }
              </chakra.div>
            } */}
          </div>
        </chakra.div>
      </chakra.div>
    </chakra.div>
  );
}
