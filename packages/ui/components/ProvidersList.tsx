import { useConnect, useDisconnect } from 'wagmi';
import { Button, Stack, Image, Flex, useToast } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import metamaskLogo from '../images/metamask-fox.svg';
import coinbaseLogo from '../images/coinbase-wallet-logo.png';
import walletConnectLogo from '../images/wallet-connect-logo.png';

export default function ProvidersList({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  const toast = useToast({position: 'top-right', isClosable: true,})
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      onSuccess: () => {
        onClose();
      },
      onError: (error: Error) => {
        disconnect();
        toast({
          description: error.message,
          status: 'error',
          duration: 5000,
      })
        // onClose();
      }
    });
  const { disconnect } = useDisconnect();

  const logoMap: {[key: string]: any} = {
    'metaMask': metamaskLogo,
    'coinbaseWallet': coinbaseLogo,
    'walletConnect': walletConnectLogo
  }
 
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
    >
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Connect Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack spacing={4}>
                {connectors.map((connector) => (
                  <Button
                    disabled={!connector.ready}
                    key={connector.id}
                    w={'full'}
                    size={'lg'}
                    onClick={() => { 
                      connect({ connector });
                    }}
                  >
                    <Flex w={'full'} alignItems={'center'} justifyContent={'space-between'}>
                      <>
                      {connector.name}
                      {!connector.ready && ' (unsupported)'}
                      {isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (connecting)'}
                      </>
                      <Image width={'30px'} src={logoMap[connector.id].src} />
                    </Flex>
                  </Button>
                ))}
              </Stack>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}