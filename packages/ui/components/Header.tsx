import {
    Tag,
    TagLabel,
    IconButton,
    Box,
    Flex,
    Container,
    Heading,
    useColorMode,
    useColorModeValue,
    Button,
    HStack,
    Avatar,
    Text,
    VStack,
    useDisclosure,
    useToast,
    Switch,
    Divider,
    Link
} from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { FC, useState, useContext } from 'react';
import { MoonIcon, HamburgerIcon, SunIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAccount, useEnsAvatar, useEnsName, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { FiUser } from "react-icons/fi";
// import { CurrentUserContext } from '../contexts/CurrentUser';

export const Header: FC = (props: any) => {
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast({position: 'top-right', isClosable: true,})
    // const { current_user, mutate, error } = useContext<any>(CurrentUserContext);
    const { address, isConnected, connector } = useAccount();
    const { data: ensAvatar } = useEnsAvatar({ address });
    const { data: ensName } = useEnsName({ address });
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect();

    const nologinMenu = () => {
        return (
            <>
                <Button variant={'primary'} size='sm' display={{base: 'none', md: 'block'}}>
                    Connect wallet
                </Button>
            </>
        )
    }

    const loginMenu = () => {
        return (
            <>
            <Menu>
                <Tag>{connector?.name}</Tag>
                <Tag>{chain?.name}</Tag>
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
                                {ensName ? `${ensName} (${address?.slice(0, 5)}...${address?.slice(-4)})` : `${address?.slice(0, 5)}...${address?.slice(-4)}` }
                            </Text>
                        </VStack>
                        <ChevronDownIcon />
                    </HStack>
                </MenuButton>
                <MenuList zIndex={101}>
                    <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
                    <Divider />
                    <HStack px={4} pt={2}>
                        <MoonIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                        <Switch defaultChecked={colorMode === 'light'} onChange={(e: any) => e.target.checked ? setColorMode('light') : setColorMode('dark')} />
                        <SunIcon color={colorMode === 'light' ? 'gray' : 'white'} />
                    </HStack>
                </MenuList>
            </Menu>
            </>
        )
    }

    return (
        <Box px={{base: 0, md: 4}}>
            <Container maxW="container.2xl" px={{base: 2, md: 4}}>
                <Flex as="header" py="4" justifyContent="space-between" alignItems="center">
                    <Box>
                        { props.toggleSidenav &&
                        <IconButton mr={2} display={{base: 'inline-block', md: 'none'}} aria-label="button" variant={'ghost'} icon={<HamburgerIcon />} onClick={props.toggleSidenav} />
                        }
                        { !props.hideLogo && 
                        <Link href="/">
                            <Heading as='h1' fontSize="xl">
                                DFGC Bulksale Maker
                            </Heading>
                        </Link>
                        }
                    </Box>
                    <HStack>
                        { true ? loginMenu() : nologinMenu() }
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}

export default Header;