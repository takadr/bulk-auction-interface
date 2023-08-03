import { useState, useEffect, useRef } from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useLocale } from "../hooks/useLocale";
import ProvidersList from "./ProvidersList";

export default function SignInButton({
  onSuccess,
  onError,
  text,
  ...buttonProps
}: {
  onSuccess: (args: { address: string }) => void;
  onError: (args: { error: Error }) => void;
  text?: string;
} & ButtonProps) {
  const [state, setState] = useState<{
    loading?: boolean;
  }>({});
  const providersListDisclosure = useDisclosure();
  const { address, isConnected } = useAccount({
    onConnect: async ({ address, connector }) => {},
  });
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { t } = useLocale();
  
  const fetchNonce = async () => {
    const nonceRes = await fetch("/api/nonce");
    const nonce = await nonceRes.text();
    return nonce;
  };

  const signIn = async ({title, address, chainId}:{
    title?:string, 
    address?:string, 
    chainId?:number
  }) => {
    try {
      const chainId = chain?.id;
      setState((x) => ({ ...x, loading: true }));

      // Create SIWE message with pre-fetched nonce and sign with wallet
      const _nonce = await fetchNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: title,
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: _nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      setState((x) => ({ ...x, loading: false }));
      onSuccess({ address: address as `0x${string}` });
    } catch (error) {
      setState((x) => ({ ...x, loading: false }));
      onError({ error: error as Error });
    }
  };

  return (
    <>
      <Button
        {...buttonProps}
        variant={"solid"}
        colorScheme={"green"}
        isLoading={state.loading}
        onClick={
          !address || !chain?.id ? () => {
            providersListDisclosure.onOpen();
          } : () => { 
            signIn({
              title: buttonProps.title
                ? buttonProps.title
                : t("SIGN_IN_WITH_ETHEREUM"),
              address,
              chainId: chain?.id
            })
          }
        }
      >
        {text ? text : t("SIGN_IN_WITH_ETHEREUM")}
      </Button>
      {!isConnected && (
        <ProvidersList
          isOpen={providersListDisclosure.isOpen}
          onClose={providersListDisclosure.onClose}
          onConnectSuccess={async({address, chainId}:{address: `0x${string}`, chainId: number}) => {
            await signIn({
              title: buttonProps.title
                ? buttonProps.title
                : t("SIGN_IN_WITH_ETHEREUM"),
              address,
              chainId
            });
            providersListDisclosure.onClose();
          }}
        />
      )}
    </>
  );
}
