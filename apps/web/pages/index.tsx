// import { Button } from "ui";
import { Box, Button, Link, Spinner, Stack, chakra, useColorMode } from '@chakra-ui/react';
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
import { connected } from 'process';
import ProvidersList from 'ui/components/ProvidersList';
import TokenFormModal from 'ui/components/TokenFormModal';
import SaleFormModal from 'ui/components/SaleFormModal';
import Header from 'ui/components/Header';
import { useDisclosure } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { saleClonesAtom, saleTxAtom, waitingTransactionAtom } from 'ui/store';

export default function Web() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const providersListDisclosure = useDisclosure();
  const TokenFormModalDisclosure = useDisclosure();
  const SaleFormModalDisclosure = useDisclosure();
  const [saleClones, setSaleClones] = useAtom(saleClonesAtom);
  const [saleTxs, setSaleTxs] = useAtom(saleTxAtom);
  const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);
  const { isLoading } = useWaitForTransaction({
    // chainId: chain?.id,
    hash: waitingTransaction,
    // wait: writeFn.data?.wait
    onSuccess(data) {
      console.log('Success!', data)
      // TODO
      // Modify tx status to confirmed in the store
      const newTxs = [...saleTxs.txs, data];
      setSaleTxs(Object.assign(saleTxs, {txs: newTxs}));
    },
    onError(e: Error) {
        console.log('Error!!!!!!', e.message)
    }
})

  const token = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  // const token = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // USDT
  const factory = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  const { prepareFn, writeFn, waitFn } = useApprove(token, address, factory);

  if(!isConnected) {
    return (
      <>
        <Button onClick={providersListDisclosure.onOpen}>Connect wallet</Button>
        <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={providersListDisclosure.onClose} />
      </>
    )
  } else if(!prepareFn || !prepareFn.isSuccess) {
    return <div>Preparing...</div>
  }

  return (
    <>
      <Header />
      <div className="flex py-20 flex-col items-center justify-center">
        {/* <div>
          {prepareFn.isSuccess &&
            <Button
              onClick={writeFn?.write}
              disabled={writeFn.isLoading || prepareFn.isError}
            >
              Approve
            </Button>
          }
          {writeFn.isLoading && <p>Loading...</p>}
          {writeFn.isSuccess && <p>Tx submitted!</p>}
          {waitFn.isSuccess && <p>Approved!</p>}
        </div> */}

        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <Stack spacing={4}>
            <Box>
              <p>
                TODO: Fetch existing sales contracts from Subgraph...
              </p>
            {
              
              saleClones.map((address) => {
                return <Link href={`/${address}`}>{address}</Link>
              })
              
            }
            </Box>
            {
              isLoading &&
              <Box justifyContent='center' alignItems='center'><Spinner /></Box>
            }
            <chakra.div>
              <Button onClick={TokenFormModalDisclosure.onOpen}>Create new token</Button>
              <TokenFormModal isOpen={TokenFormModalDisclosure.isOpen} onClose={TokenFormModalDisclosure.onClose} />
            </chakra.div>
            <chakra.div>
              <Button onClick={SaleFormModalDisclosure.onOpen}>Create new sale</Button>
              <SaleFormModal isOpen={SaleFormModalDisclosure.isOpen} onClose={SaleFormModalDisclosure.onClose} />
            </chakra.div>
          </Stack>
        </main>
      </div>
    </>
  );
}
