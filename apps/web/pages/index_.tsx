// import { Button } from "ui";
import { Button, useColorMode } from '@chakra-ui/react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  WagmiConfig,
  createClient,
} from 'wagmi';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getDefaultProvider, BigNumber, utils } from 'ethers';
import BulksaleV1ABI from 'ui/constants/abis/BulksaleV1.json';
import Factory from 'ui/constants/abis/BulksaleV1.json';
import useApprove from 'ui/hooks/useApprove';

export default function Web() {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  const { address, isConnected, connector } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()
  const { connect } = useConnect({
    connector: new InjectedConnector({
      chains: [sepolia],
    }),
  })
  const { disconnect } = useDisconnect();
  const { prepareFn, writeFn, waitFn } = useApprove('0xe5eb10386c77e90b7a8fc1ac3f734a6137ffcfa9', address, '0x0d72Cd6C887A9413D00cB4527A56d6D25fEc27B3');
  const abi = new utils.AbiCoder();
  // const contract = new ethers.Contract(
  //   "0x0d72Cd6C887A9413D00cB4527A56d6D25fEc27B3",
  //   BulksaleV1ABI,
  //   ethers.getDefaultProvider()
  // );

  // const client = createClient({
  //   autoConnect: true,
  //   provider: getDefaultProvider('sepolia'),
  // })

  const token = "0xe5eb10386c77e90b7a8fc1ac3f734a6137ffcfa9";
  const startingAt = 1682737392 + 60*60*24*6;
  const eventDuration = 60*60*24*10; //10日間
  const lockDuration = 60*60*24*1;
  const expirationDuration = 60*60*24*90;
  const totalDistributeAmount = 10;
  const minimalProvideAmount = 1;
  const owner = "0x0d72Cd6C887A9413D00cB4527A56d6D25fEc27B3";
  const feeRatePerMil = 10;
  // const auctionParams = abi.encode(
  //   ['address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'uint'],
  //   [token, startingAt, eventDuration, lockDuration, expirationDuration, totalDistributeAmount, minimalProvideAmount, owner, feeRatePerMil]
  // )
  // const encodedParams = utils.hexlify(auctionParams);
  const auctionParams = utils.hexlify(abi.encode(
    ['address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'uint'],
    [token, startingAt, eventDuration, lockDuration, expirationDuration, totalDistributeAmount, minimalProvideAmount, owner, feeRatePerMil]
  ));
  // const args = [token, startingAt, eventDuration, lockDuration, expirationDuration, totalDistributeAmount, minimalProvideAmount, owner, feeRatePerMil]

  const { config } = usePrepareContractWrite({
    address: '0x0d72Cd6C887A9413D00cB4527A56d6D25fEc27B3', //factory
    abi: [
      {
        name: 'deploy',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          {
            "internalType": "string",
            "name": "templateName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "tokenAddr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sellingAmount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "abiArgs",
            "type": "bytes"
          }
        ],
        outputs: [
          {
            "internalType": "address",
            "name": "deployedAddr",
            "type": "address"
          }
        ],
      },
    ],
    functionName: 'deploy',
    args: [
      "BulksaleV1.0.sol",
      "0xe5eb10386c77e90b7a8fc1ac3f734a6137ffcfa9",
      BigNumber.from("1000000"),
      auctionParams as `0x${string}`,
    ],
  })
  // console.log(auctionParams)
  const { data, write } = useContractWrite(config)
 
  const { isLoading: isWaitingTransaction, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  // const write = () => {}

  // console.log(connector)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">

      <>
      {/* {chain && <div>Connected to {chain.name}</div>} */}
 
      {/* {chains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && ' (switching)'}
        </button>
      ))} */}
 
      {/* <div>{error && error.message}</div> */}
      </>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <Button variant="solid" onClick={toggleColorMode}>Test</Button>
        {
          isConnected ? (
            <div>
              Connected to {address}
              <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
            </div>
          )
        : <Button variant="outline" onClick={() => connect()}>Connect Wallet</Button>
        }

        <Button variant="outline" onClick={write}>Deploy</Button>
      </main>
    </div>
  );
}
