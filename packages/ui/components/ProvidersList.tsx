import { useConnect } from 'wagmi';
import { Button, Stack } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
 
export default function ProvidersList({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
 
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
                    onClick={() => { 
                      connect({ connector }); onClose() 
                    }}
                  >
                    🦊 {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}
                  </Button>
                ))}
          
                {error && <div>{error.message}</div>}
              </Stack>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}