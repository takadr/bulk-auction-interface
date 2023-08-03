import { useState, useEffect, useRef } from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { continueSignInAtom, signInTriggerIdAtom } from "lib/store";
import { useLocale } from "../hooks/useLocale";
import ProvidersList from "./ProvidersList";

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
  const [continueSignIn, setContinueSignIn] = useAtom(continueSignInAtom);
  const [signInTriggerId, setSignInTriggerId] = useAtom(signInTriggerIdAtom);
  const fetchNonce = async () => {
    const nonceRes = await fetch("/api/nonce");
    const nonce = await nonceRes.text();
    return nonce;
  };
  const { address, isConnected } = useAccount({
    onConnect: async ({ address, connector }) => {},
  });
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { t } = useLocale();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!!signInTriggerId && signInTriggerId !== buttonProps.id) return;

    !prevIsConnected && isConnected && continueSignIn && signIn();
  }, [signInTriggerId]);
  const prevIsConnected = usePrevious(isConnected);

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) {
        setContinueSignIn(true);
        return providersListDisclosure.onOpen();
      }
      setSignInTriggerId(buttonProps.id);
      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const _nonce = await fetchNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: buttonProps.title
          ? buttonProps.title
          : t("SIGN_IN_WITH_ETHEREUM"),
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

      setSignInTriggerId(undefined);
      setState((x) => ({ ...x, loading: false }));
      onSuccess({ address: address as `0x${string}` });
    } catch (error) {
      setSignInTriggerId(undefined);
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
        onClick={signIn}
      >
        {text ? text : t("SIGN_IN_WITH_ETHEREUM")}
      </Button>
      {!isConnected && (
        <ProvidersList
          isOpen={providersListDisclosure.isOpen}
          onClose={() => {
            setTimeout(() => {
              setContinueSignIn(false);
              providersListDisclosure.onClose();
            }, 200);
          }}
        />
      )}
    </>
  );
}
