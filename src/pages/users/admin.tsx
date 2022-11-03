/*
  This page is the main page for the users manager.
  Here authorized users can add, edit, and delete users.

  [] Users will be sorted alphabetically [First, Last]. 

  [x] We can also search users by their first name, last name, alias or authorization level.
  The search bar is case insensitive. And the filter is applied to all three fields.

  For example, if the search bar is "John Doe", it will search for all users that have
  "John" in their first name, last name, or alias, and then it will search for all users
  that have "Doe" in their first name, last name, or alias.

  [x] This page grabs users from the database and displays a card for each user.
  The cards display the user's image, first name, last name, alias, 
  and buttons to edit or delete the user.

  [x] If the user clicks on Delete, a modal will pop up asking them to confirm.
    If confirmed, the user will be deleted from the database, 
    and the page will refresh.

  [x] If the user clicks on Edit, a modal will pop up with a form to edit the user.
    If the user clicks Save, the user will be updated in the database,
    and the page will refresh.

  [x] If the user clicks on Add User, a modal will pop up with a form to add a user.
    If the user clicks Save, the user will be added to the database,
    and the page will refresh.

*/

import { useState, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import {
  Heading,
  HStack,
  Stack,
  Flex,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  IconButton,
  Table,
  Tbody,
  Td,
  Tr
} from '@chakra-ui/react'
import { FaUserPlus } from 'react-icons/fa'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import SearchBar from '../../components/SearchBar'
import UserCard from '../../components/UserCard'
import LoginForm from '../../components/LoginForm'
import NewUserModal from '../../components/NewUserModal'
import { useAuthContext } from '../../context/AuthContext'
import type { User, NewUser } from '../../types'

export default function Index() {
  const { user } = useAuthContext()
  const utils = trpc.useContext()
  const createUser = trpc.useMutation('users.createUser')
  const getUsers = trpc.useQuery(['users.getUsers'])
  const updateUser = trpc.useMutation('users.updateUser')
  const deleteUser = trpc.useMutation('users.deleteUser')
  const [authFilter, setAuthFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isPopOverOpen,
    onOpen: onPopOverOpen,
    onClose: onPopOverClose
  } = useDisclosure()

  // this updates the UI when the userQuery data is first loaded.
  // useEffect(() => {
  //   if (getUsers.isFetching) setUsers(undefined)
  //   if (getUsers.isFetched) setUsers(getUsers.data)
  // }, [getUsers.data, getUsers.isFetched, getUsers.isFetching])

  const handleUserDelete = useCallback(
    async (uid: string) => {
      await deleteUser.mutateAsync(
        { id: uid },
        {
          onSuccess: () => {
            utils.invalidateQueries(['users.getUsers'])
          }
        }
      )
    },
    [deleteUser, utils]
  )

  const handleUserUpdate = useCallback(
    async (data: User) => {
      await updateUser.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['users.getUsers'])
        }
      })
    },
    [updateUser, utils]
  )

  const handleCreateUser = useCallback(
    async (data: NewUser) => {
      await createUser.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['users.getUsers'])
        }
      })
    },
    [createUser, utils]
  )

  const handleRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthFilter(e.target.value)
  }

  // this filters users by the radio buttons
  const filteredUsers = getUsers.data?.filter(user => {
    if (authFilter === 'all') return true
    return user.auth === authFilter
  })

  // this is the search bar logic
  // it will search for every word in the search bar,
  const liveSearch = () => {
    return filteredUsers?.filter(user => {
      const firstName = user.firstName.toLowerCase()
      const lastName = user.lastName.toLowerCase()
      const alias = user.alias?.toLowerCase()
      const password = user.password.toLowerCase()
      const searchWords = search.toLowerCase().split(' ')
      return searchWords.every(word => {
        return (
          firstName.includes(word) ||
          lastName.includes(word) ||
          alias?.includes(word) ||
          password.includes(word)
        )
      })
    })
  }

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  return (
    <>
      <NewUserModal
        handleCreateUser={handleCreateUser}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Stack gap={3}>
        <Flex justify="space-between">
          <Heading>{'Users'}</Heading>
          <Button
            variant="outline"
            leftIcon={<FaUserPlus />}
            colorScheme="green"
            onClick={onOpen}
          >
            New User
          </Button>
        </Flex>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search by name, alias, or password"
        />
        <FormControl pb={8} rounded="lg">
          <Flex alignItems="center" pb="1">
            <FormLabel as="legend">Filter by Authorization Level:</FormLabel>
            <Popover
              isOpen={isPopOverOpen}
              onOpen={onPopOverOpen}
              onClose={onPopOverClose}
              placement="top-start"
              orientation="horizontal"
            >
              <PopoverTrigger>
                <IconButton
                  aria-label="input password"
                  position="relative"
                  right="7px"
                  bottom="4px"
                  variant="ghost"
                  size="sm"
                  icon={<InfoOutlineIcon />}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">
                  Authorizations:
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Table variant="simple" size="sm">
                    <Tbody>
                      <Tr>
                        <Td>User</Td>
                        <Td>Can only view information</Td>
                      </Tr>
                      <Tr>
                        <Td>Bar</Td>
                        <Td>Can edit bar related information</Td>
                      </Tr>
                      <Tr>
                        <Td>Kitchen</Td>
                        <Td>Can edit kitchen related information</Td>
                      </Tr>
                      <Tr>
                        <Td>Admin</Td>
                        <Td>Can view and edit all information</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
          <RadioGroup defaultValue="all">
            <HStack spacing="12px">
              <Radio
                value="all"
                checked={authFilter === 'all'}
                onChange={handleRadioButtonChange}
              >
                All
              </Radio>
              <Radio
                value="user"
                checked={authFilter === 'user'}
                onChange={handleRadioButtonChange}
              >
                User
              </Radio>
              <Radio
                value="bar"
                checked={authFilter === 'bar'}
                onChange={handleRadioButtonChange}
              >
                Bar
              </Radio>
              <Radio
                value="kitchen"
                checked={authFilter === 'kitchen'}
                onChange={handleRadioButtonChange}
              >
                Kitchen
              </Radio>
              <Radio
                value="admin"
                checked={authFilter === 'admin'}
                onChange={handleRadioButtonChange}
              >
                Admin
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        {getUsers.data &&
          liveSearch()?.map((user: any) => (
            <UserCard
              key={user.id}
              handleUserDelete={handleUserDelete}
              handleUserUpdate={handleUserUpdate}
              uid={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              alias={user.alias}
              password={user.password}
              auth={user.auth}
            />
          ))}
      </Stack>
    </>
  )
}
