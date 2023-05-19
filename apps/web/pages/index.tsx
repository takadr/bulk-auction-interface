import { useState, useEffect, useContext } from 'react';
import { Box, Button, Link, Spinner, Stack, Container, Flex, Alert, AlertIcon, chakra, useColorMode } from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork, useSignMessage } from 'wagmi';
import { useDisclosure } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { saleClonesAtom, saleTxAtom, waitingTransactionAtom } from 'ui/store';
import SignInButton from 'ui/components/SignInButton';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import { NonceContext } from 'ui/components/providers/NonceProvider';
import Layout from 'ui/components/layouts/layout';

export default function Web() {
  const { currentUser } = useContext(CurrentUserContext);
  const nonce = useContext(NonceContext);
  const { chain } = useNetwork();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const providersListDisclosure = useDisclosure();
  const [saleClones, setSaleClones] = useAtom(saleClonesAtom);
  const [saleTxs, setSaleTxs] = useAtom(saleTxAtom);
  const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);


  const token = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  // const token = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // USDT
  const factory = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

  // if(!isConnected) {
  //   return (
  //     <>
  //       <Header />
  //       <Container textAlign={'center'}>
  //         <Flex minH={'50VH'} justifyContent={'center'} alignItems={'center'}>
  //           <Button onClick={providersListDisclosure.onOpen} variant={'solid'} size={'lg'} colorScheme={'green'}>Connect wallet</Button>
  //         </Flex>
  //         <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={providersListDisclosure.onClose} />
  //       </Container>
  //     </>
  //   )
  // }

  return (
    <Layout>
      {
        !currentUser && <SignInButton
        size={'sm'}
        onSuccess={() => { }}
        onError={(args) => {
            if ('error' in args) {
                const error = args.error;
                console.log(error.message)
            }
        }}
        nonce={nonce}
    />
      }
    </Layout>
  );
}
