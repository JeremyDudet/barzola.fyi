// todo
// [x] add logout button
// [x] fix the drawer opening on large screens

/* 
  This is the main layout for the app.

  [x] This layout is used in all pages.

  [x] It contains the header, sidebar, and footer.
  [x] It also contains the drawer for mobile screens.
  [x] Children components are rendered inside the main content area.

  [] Depending on user Authorization: 
      some Admin links are shown in the sidebar.
*/
import Logo from '../Logo'
import NextLink from 'next/link'
import ThemeToggleButton from '../theme-toggle-button'
import { useAuthContext } from '../../context/AuthContext'
import {
  Box,
  Flex,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Link,
  IconButton,
  Text,
  Center
} from '@chakra-ui/react'
import { GiCutLemon, GiManualJuicer } from 'react-icons/gi'
import { BsCheck2Square } from 'react-icons/bs'
import { BiFoodMenu, BiChair, BiEdit } from 'react-icons/bi'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { FaCocktail, FaUsers } from 'react-icons/fa'
import { MdHome, MdLiquor } from 'react-icons/md'
import { ImShuffle } from 'react-icons/im'
import { Router } from 'next/router'
import { IconType } from 'react-icons'
import { IoIosWine, IoIosBeer } from 'react-icons/io'
import AdminAuthOnly from '../AdminAuthOnly'
import KitchenAuthOnly from '../KitchenAuthOnly'
import BarAuthOnly from '../BarAuthOnly'

interface MainProps {
  children: React.ReactNode
  router: Router
}

interface IconProps {
  icon: IconType
}

interface NavItemProps {
  icon: IconType
  children: React.ReactNode
  href: string
  path: string
}

interface ChildrenProps {
  children: React.ReactNode
}

const Main = ({ children, router }: MainProps) => {
  const path = router.asPath
  const { user, logOut } = useAuthContext()
  const sidebar = useDisclosure()
  const color = useColorModeValue('gray.600', 'gray.300')

  const SwitchUser = ({ icon }: IconProps) => {
    const onLogOut = () => {
      // close sidebar
      sidebar.onClose()
      // log out user
      logOut()
    }
    return (
      <Box p={2}>
        <Flex
          justify="flex-start"
          align="center"
          px="4"
          pl="4"
          py="3"
          cursor="pointer"
          color="inherit"
          borderRadius="md"
          _dark={{
            color: 'gray.100'
          }}
          _hover={{
            bg: 'gray.100',
            _dark: {
              bg: 'gray.900'
            },
            color: 'gray.900'
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          onClick={onLogOut}
        >
          {icon && (
            <Icon
              mx="2"
              boxSize="4"
              _groupHover={{
                color: color
              }}
              as={icon}
            />
          )}
          Switch User
        </Flex>
      </Box>
    )
  }

  const NavItem = ({ icon, children, href, path }: NavItemProps) => {
    const active = path === href
    const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
    const activeColor = useColorModeValue('gray800', 'whiteAlpha.900')
    return (
      <Box p="2">
        <NextLink href={href} passHref>
          <Link
            bg={active ? 'glassTeal' : undefined}
            color={active ? activeColor : inactiveColor}
          >
            <Flex
              align="center"
              px="4"
              pl="4"
              py="3"
              cursor="pointer"
              color="inherit"
              borderRadius="md"
              _dark={{
                color: 'gray.300'
              }}
              _hover={{
                bg: 'gray.100',
                _dark: {
                  bg: 'gray.900'
                },
                color: 'gray.900'
              }}
              role="group"
              fontWeight="semibold"
              transition=".15s ease"
              onClick={sidebar.onClose}
            >
              {icon && (
                <Icon
                  mx="2"
                  boxSize="4"
                  _groupHover={{
                    color: color
                  }}
                  as={icon}
                />
              )}
              {children}
            </Flex>
          </Link>
        </NextLink>
      </Box>
    )
  }

  const SidebarHeading = ({ children }: ChildrenProps) => (
    <Text as="h6" size="sm" color="gray.500" pl={6} mt={4} fontStyle="normal">
      {children}
    </Text>
  )

  const SidebarContent = () => (
    <Box
      borderRightWidth={{
        base: '0',
        md: '1px'
      }}
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: 'gray.700'
      }}
      color="gray.100"
      w="60"
    >
      <Flex px="4" py="5" align="center" justify="space-between">
        <Logo onClose={sidebar.onClose} />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome} path={path} href="/">
          Home
        </NavItem>
        <SidebarHeading>Information</SidebarHeading>
        <NavItem icon={BsCheck2Square} path={path} href="/tasks">
          Tasks
        </NavItem>
        <NavItem icon={BiChair} path={path} href="/seating-charts">
          Seating Charts
        </NavItem>
        <NavItem icon={BiFoodMenu} path={path} href="/food-notes">
          Food Notes
        </NavItem>
        <NavItem icon={IoIosWine} path={path} href="/wine-notes">
          Wine
        </NavItem>
        <NavItem icon={FaCocktail} path={path} href="/cocktail-notes">
          Cocktails
        </NavItem>
        <NavItem icon={IoIosBeer} path={path} href="/beer-notes">
          Beer
        </NavItem>
        <NavItem icon={MdLiquor} path={path} href="/spirits-notes">
          {'Spirits & Liqueurs'}
        </NavItem>
        <BarAuthOnly user={user}>
          <SidebarHeading>Bar</SidebarHeading>
          <NavItem icon={GiCutLemon} path={path} href="/citrus-juice-pars">
            Daily Juice Pars
          </NavItem>
        </BarAuthOnly>
        <KitchenAuthOnly user={user}>
          <SidebarHeading>Kitchen</SidebarHeading>
          <NavItem
            icon={GiManualJuicer}
            path={path}
            href="/request-citrus-juice"
          >
            Request Citrus Juice
          </NavItem>
        </KitchenAuthOnly>
        <AdminAuthOnly user={user}>
          <SidebarHeading>Admin</SidebarHeading>
          <NavItem icon={FaUsers} path={path} href="/users/admin">
            Users
          </NavItem>
          <NavItem icon={BiEdit} path={path} href="/roles/admin">
            Roles
          </NavItem>
        </AdminAuthOnly>
        <SidebarHeading>{`Settings: ${
          user.alias ? user.alias : user.firstName
        }`}</SidebarHeading>
        <SwitchUser icon={ImShuffle} />
      </Flex>
    </Box>
  )

  // check if there is a logged in user
  // if not, hide the sidebar

  if (!user.firstName) return <Center pt={8}>{children}</Center>

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700'
      }}
      minH="100vh"
    >
      <Box display={{ base: 'none', md: 'unset' }} w="60">
        <SidebarContent />
      </Box>
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: 'gray.700'
          }}
          borderBottomWidth="1px"
          color="inherit"
          h="14"
        >
          <Box>
            <Box
              display={{
                base: 'block',
                md: 'none'
              }}
            >
              <Logo onClose={sidebar.onClose} />
            </Box>
          </Box>
          <Flex align="center" gap={2}>
            {/* <Icon color="gray.500" as={FaBell} cursor="pointer" /> */}
            <ThemeToggleButton />
            <IconButton
              aria-label="Open Menu"
              display={{ base: 'inline-flex', md: 'none' }}
              icon={<HamburgerIcon boxSize={5} />}
              onClick={
                sidebar.isOpen === true ? sidebar.onClose : sidebar.onOpen
              }
            />
          </Flex>
        </Flex>
        <Box as="main" mx="auto" p="4" maxW="container.lg">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Main
