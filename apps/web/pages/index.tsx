// import { Button } from "ui";
import { Box, Button, Link, Spinner, Stack, Container, Flex, Alert, AlertIcon, chakra, useColorMode } from '@chakra-ui/react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  WagmiConfig,
  createClient,
} from 'wagmi';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import ProvidersList from 'ui/components/ProvidersList';
import TokenFormModal from 'ui/components/TokenFormModal';
import SaleFormModal from 'ui/components/SaleFormModal';
import Header from 'ui/components/Header';
import { useDisclosure } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { saleClonesAtom, saleTxAtom, waitingTransactionAtom } from 'ui/store';

export default function Web() {
  const { chain } = useNetwork();
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
    hash: waitingTransaction as `0x${string}`,
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

  if(!isConnected) {
    return (
      <>
        <Header />
        <Container textAlign={'center'}>
          <Flex minH={'50VH'} justifyContent={'center'} alignItems={'center'}>
            <Button onClick={providersListDisclosure.onOpen} variant={'solid'} size={'lg'} colorScheme={'green'}>Connect wallet</Button>
          </Flex>
          <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={providersListDisclosure.onClose} />
        </Container>
      </>
    )
  }

  return (
    <>
      <Header />
      {
          chain && chain.unsupported && 
          <chakra.div px={8}>
              <Alert status='warning' mb={4}>
                  <AlertIcon /> Please connect to Sepolia
              </Alert>
          </chakra.div>
      }
      <div className="flex py-20 flex-col items-center justify-center">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <Stack spacing={4}>
            <Box>
              <p>
                TODO: Fetch existing sales contracts from Subgraph...
              </p>
            <ul>{
              
              saleClones.map((address) => {
                return <li key={address}><Link href={`/${address}`} target={'_blank'}>{address}</Link></li>
              })
              
            }</ul>
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
