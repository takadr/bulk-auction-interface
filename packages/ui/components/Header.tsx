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
    const { data: ensAvatar } = useEnsAvatar({ address: currentUser ? currentUser.address : address, staleTime: 1000 * 60 * 60 * 1 });
    const { data: ensName } = useEnsName({ address: currentUser ? currentUser.address : address, staleTime: 1000 * 60 * 60 * 1 });
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect();

    const getDisplayAddress = () => {
        const _address = currentUser ? currentUser.address : address;
        return `${_address?.slice(0, 5)}...${_address?.slice(-4)}`;
    }

    const noConnectedMenu = () => {
        return (
            <>
                <Button id="connectButton" onClick={providersListDisclosure.onOpen} variant={'outline'} size={{base: 'xs', md: 'sm'}}>
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
                    { connector?.id && <ProviderLogo display={{ base: 'none', md: 'flex' }} width={'26px'} connectorId={connector.id} /> }
                    <Tag size={'sm'} display={{ base: 'none', md: 'flex' }}>{chain?.unsupported ? 'Unsupported Chain' : chain?.name}</Tag>
                    <MenuButton>
                        <HStack>
                            { ensName && ensAvatar && <Avatar
                            size={'sm'}
                            src={ensAvatar}
                            ml={1}
                            /> }
                            <VStack
                            display={{ base: 'flex', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2">
                                <Text fontSize="sm" id="account">
                                    <chakra.span display={{ base: 'none', md: 'inline' }}>{ currentUser ? 'Signed in as ' : '' }</chakra.span>
                                    {ensName ? `${ensName}` : `${getDisplayAddress()}` }
                                </Text>
                            </VStack>
                            <ChevronDownIcon />
                        </HStack>
                    </MenuButton>
                    <MenuList zIndex={101}>
                        <HStack spacing={1} px={2} display={{ base: 'block', md: 'none' }}>
                            <Tag size={'sm'}>{chain?.unsupported ? 'Unsupported Chain' : chain?.name}</Tag>
                            { currentUser && <Tag size={'sm'}>Signed in</Tag>}
                        </HStack>
                        {
                            isConnected && currentUser && <MenuItem display={{base: 'block', md: 'none'}} onClick={() => Router.push("/dashboard")}>
                                Dashboard
                            </MenuItem>
                        }
                        <MenuItem display={{base: 'block', md: 'none'}} onClick={() => Router.push("/sales")}>
                            Sales
                        </MenuItem>
                        <Divider display={{base: 'block', md: 'none'}} />
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
                        {
                        /* Hide color mode toggle switch for now
                        <Divider />
                        <HStack px={4} pt={2}>
                            <MoonIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                            <Switch isChecked={colorMode === 'light'} onChange={(e: any) => e.target.checked ? setColorMode('light') : setColorMode('dark')} />
                            <SunIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                        </HStack> 
                        */
                        }
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
                    <HStack spacing={{base: 2, md: 4}}>
                        {
                            isConnected && currentUser && <Button display={{base: 'none', md: 'block'}} variant="ghost" size={'md'} onClick={() => Router.push("/dashboard")}>
                                Dashboard
                            </Button>
                        }
                        <Button variant="ghost" display={{base: 'none', md: 'block'}} size={'md'} onClick={() => Router.push("/sales")}>
                            Sales
                        </Button>
                        {
                            !currentUser && <SignInButton
                                size={{base: 'xs', md: 'sm'}}
                                onSuccess={async () => { 
                                    mutate && await mutate()
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