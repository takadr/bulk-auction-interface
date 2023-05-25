import {
    chakra,
    Tag,
    Box,
    Flex,
    Container,
    Heading,
    useColorMode,
    Button,
    HStack,
    Avatar,
    Text,
    VStack,
    useDisclosure,
    useToast,
    Switch,
    Divider,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { FC, useState, useContext } from 'react';
import Router from 'next/router';
import { MoonIcon, HamburgerIcon, SunIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAccount, useEnsAvatar, useEnsName, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import ProvidersList from './ProvidersList';
import { CurrentUserContext } from './providers/CurrentUserProvider';
import SignInButton from './SignInButton';
import ProviderLogo from './ProviderLogo';

type HeaderProps = {
    title?: string;
};

export const Header: FC<HeaderProps> = ({title}: {title?: string}) => {
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const providersListDisclosure = useDisclosure();
    const toast = useToast({position: 'top-right', isClosable: true,})
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const { address, isConnected, connector } = useAccount();
    const { data: ensAvatar } = useEnsAvatar({ address: currentUser ? currentUser.address : address });
    const { data: ensName } = useEnsName({ address: currentUser ? currentUser.address : address });
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect();

    const getDisplayAddress = () => {
        const _address = currentUser ? currentUser.address : address;
        return `${_address?.slice(0, 5)}...${_address?.slice(-4)}`;
    }

    const noConnectedMenu = () => {
        return (
            <>
                <Button onClick={providersListDisclosure.onOpen} variant={'outline'} size='sm'>
                    Connect wallet
                </Button>
                <ProvidersList isOpen={providersListDisclosure.isOpen} onClose={providersListDisclosure.onClose} />
            </>
        )
    }

    const connectedMenu = () => {
        return (
            <>
            <Menu>
                <HStack spacing={1}>
                    { connector?.id && <ProviderLogo width={'26px'} connectorId={connector.id} /> }
                    <Tag size={'sm'}>{chain?.unsupported ? 'Unsupported Chain' : chain?.name}</Tag>
                    <MenuButton>
                        <HStack>
                            { ensName && <Avatar
                            size={'sm'}
                            src={ensAvatar ? ensAvatar : ''}
                            /> }
                            <VStack
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2">
                                <Text fontSize="sm">
                                    { currentUser ? 'Signed in as ' : '' }
                                    {ensName ? `${ensName} (${getDisplayAddress()})` : `${getDisplayAddress()}` }
                                </Text>
                            </VStack>
                            <ChevronDownIcon />
                        </HStack>
                    </MenuButton>
                    <MenuList zIndex={101}>
                        {
                            currentUser ? <MenuItem onClick={async() => { 
                                await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
                                toast({
                                    id: 'signout',
                                    title: "Signed out.",
                                    status: 'info',
                                    duration: 5000,
                                })
                                disconnect();
                                mutate && mutate()
                            }}>Sign out and Disconnect</MenuItem>
                            : <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
                        }
                        <Divider />
                        <HStack px={4} pt={2}>
                            <MoonIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                            <Switch isChecked={colorMode === 'light'} onChange={(e: any) => e.target.checked ? setColorMode('light') : setColorMode('dark')} />
                            <SunIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                        </HStack>
                    </MenuList>
                </HStack>
            </Menu>
            </>
        )
    }

    return (
        <Box px={{base: 0, md: 4}}  position={'sticky'} top={'0'} zIndex={100} bg={'chakra-body-bg'} opacity={0.975}>
            <Container maxW="container.2xl" px={{base: 2, md: 4}}>
                <Flex as="header" py="4" justifyContent="space-between" alignItems="center">
                    <HStack>
                        <Link href="/" textDecoration={'none'} _hover={{textDecoration: 'none'}}>
                            <Heading as='h1' fontSize="xl">
                                <Text
                                    bgGradient='linear(to-l, #7928CA, #FF0080)'
                                    bgClip='text'
                                    fontSize='xl'
                                    fontWeight='extrabold'
                                    >
                                    { title ? title : 'DFGC Bulksale Maker (仮)' }
                                </Text>
                            </Heading>
                        </Link>
                    </HStack>
                    <HStack spacing={4}>
                        {
                            isConnected && currentUser && <Button variant="ghost" size={'md'} onClick={() => Router.push("/dashboard")}>
                                Dashboard
                            </Button>
                        }
                        <Button variant="ghost" size={'md'} onClick={() => Router.push("/sales")}>
                            Sales
                        </Button>
                        {
                            !currentUser && <SignInButton
                                size={'sm'}
                                onSuccess={() => { 
                                    mutate && mutate()
                                    Router.push('/dashboard')
                                }}
                                onError={(args) => {
                                    if ('error' in args) {
                                        const error = args.error;
                                        toast({
                                            description: error.message,
                                            status: 'error',
                                            duration: 5000,
                                        })
                                    }
                                }}
                                // nonce={nonce}
                            />
                        }
                        { isConnected ? connectedMenu() : noConnectedMenu() }
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}

export default Header;