import { useState, useEffect, useRef, memo } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Button, ButtonProps, useDisclosure, chakra } from '@chakra-ui/react';
import ProvidersList from './ProvidersList';

function usePrevious(value: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function SignInButton({
    onSuccess,
    onError,
    ...buttonProps
  }: {
    onSuccess: (args: { address: string }) => void
    onError: (args: { error: Error }) => void
  } & ButtonProps) {
    const [state, setState] = useState<{
      loading?: boolean
    }>({})
    const providersListDisclosure = useDisclosure();
    const [continueSignIn, setContinueSignIn] = useState(false);
    const fetchNonce = async () => {
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
      return nonce
    }
    const { address, isConnected } = useAccount({
      onConnect: async ({address, connector}) => {
      }
    })
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()

    useEffect(() => {
      !prevIsConnected && isConnected && continueSignIn && signIn()
    }, [isConnected])
    const prevIsConnected = usePrevious(isConnected);
   
    const signIn = async () => {
      try {
        const chainId = chain?.id
        if (!address || !chainId) {
          setContinueSignIn(true);
          return providersListDisclosure.onOpen();
        }
   
        setState((x) => ({ ...x, loading: true }))
        // Create SIWE message with pre-fetched nonce and sign with wallet
        const _nonce = await fetchNonce();
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: 'Sign in with Ethereum',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce: _nonce
        })
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        })
   
        // Verify signature
        const verifyRes = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, signature }),
        })
        if (!verifyRes.ok) throw new Error('Error verifying message')
   
        setState((x) => ({ ...x, loading: false }))
        onSuccess({ address: address as `0x${string}` })
      } catch (error) {
        setState((x) => ({ ...x, loading: false }))
        onError({ error: error as Error })
      }
    }
   
    return (
      <>
        <Button {...buttonProps} variant={'solid'} colorScheme={'green'} isLoading={state.loading} onClick={signIn}>
          Sign In
          <chakra.span display={{base: 'none', md: 'inline'}} ml={1}> with Ethereum</chakra.span>
        </Button>
        { !isConnected && <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={() => { 
          setTimeout(() => {
            setContinueSignIn(false);
            providersListDisclosure.onClose()
          }, 200)}} /> }
      </>
      
    )
  }