import { useContext, useEffect } from "react";
import { chakra, Alert, AlertIcon, useColorMode, useToast } from "@chakra-ui/react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import { getChain } from "lib/utils/chain";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useLocale } from "../../hooks/useLocale";
import Header from "../Header";
import Footer from "../Footer";

export default function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { currentUser, mutate } = useContext(CurrentUserContext);
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const toast = useToast({ position: "top-right", isClosable: true });
  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
    disconnect();
    mutate && mutate();
  };
  const { t } = useLocale();

  // Detect account change and sign out if SIWE user and account does not match
  useEffect(() => {
    if (currentUser && currentUser.address != address) {
      logout();
      !toast.isActive("signout") &&
        !toast.isActive("addressChanged") &&
        toast({
          id: "addressChanged",
          description: "Account change detected. Signed out.",
          status: "info",
          duration: 5000,
        });
    }
  }, [address]);

  // Dark mode only for now
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode === "light") toggleColorMode();
  }, [colorMode]);

  // To avoid hydration issues
  // https://github.com/wagmi-dev/wagmi/issues/542#issuecomment-1144178142
  if (!isMounted) return null;

  console.log(process.env.NEXT_PUBLIC_CHAIN_ID);
  console.log(chain);
  console.log(chain.unsupported);

  return (
    <>
      <Header title={title ? title : "Yamawake"} />
      {chain && chain.unsupported && (
        <chakra.div px={{ base: 0, md: 8 }}>
          <Alert status="warning" mb={4}>
            <AlertIcon />{" "}
            {t("PLEASE_CONNECT_TO", {
              network: getChain(Number(process.env.NEXT_PUBLIC_CHAIN_ID)).name,
            })}
          </Alert>
        </chakra.div>
      )}
      <chakra.div bg={"gray.800"}>{children}</chakra.div>
      <Footer />
    </>
  );
}
