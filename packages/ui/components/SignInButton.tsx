import { useState, useEffect, useRef, useContext, memo } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import ProvidersList from './ProvidersList';

function usePrevious(value: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default memo(function SignInButton({
    onSuccess,
    onError,
    ...buttonProps
  }: {
    onSuccess: (args: { address: string }) => void
    onError: (args: { error: Error }) => void
    nonce?: string
  } & ButtonProps) {
    const [state, setState] = useState<{
      loading?: boolean
    }>({})
    const providersListDisclosure = useDisclosure();
    const [continueSignIn, setContinueSignIn] = useState(false);
    const fetchNonce = async () => {
      try {
        const nonceRes = await fetch('/api/nonce')
        const nonce = await nonceRes.text()
        return nonce
      } catch (error) {
        // setState((x) => ({ ...x, error: error as Error }))
      }
    }
    const { address, isConnected } = useAccount({
      onConnect: async ({address, connector}) => {
        console.log('On Connect', address, connector)
      }
    })
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()
   
    // Pre-fetch random nonce when button is rendered
    // to ensure deep linking works for WalletConnect
    // users on iOS when signing the SIWE message
    useEffect(() => {
      // fetchNonce()
    }, [])

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
        // fetchNonce()
      }
    }
   
    return (
      <>
        <Button {...buttonProps} variant={'solid'} colorScheme={'green'} isLoading={state.loading} onClick={signIn}>
          Sign-In with Ethereum
        </Button>
        { !isConnected && <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={() => { 
          setTimeout(() => {
            setContinueSignIn(false);
            providersListDisclosure.onClose()
          }, 200)}} /> }
      </>
      
    )
  }, (prevProps, nextProps) => {
    if(prevProps.nonce === nextProps.nonce) { return true }
    return false
  })