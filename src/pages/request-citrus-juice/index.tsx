/*
  Requests will show up in Citrus Juice Pars page 
  if they're ordered the night before or ordered the same day before 12pm.
*/

import { useState, useEffect, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import {
  HStack,
  Button,
  Heading,
  useDisclosure,
  Divider,
  Box,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { useAuthContext } from '../../context/AuthContext'
import LoginForm from '../../components/LoginForm'
import NewJuiceRequestModal from '../../components/NewJuiceRequestModal'
import JuiceRequestCard from '../../components/JuiceRequestCard'
import type {
  JuiceRequest,
  NewJuiceRequest,
  JuiceRequestUpdate,
  User
} from '../../types'

export default function Index() {
  const HandleColorModeChange = useColorModeValue('gray.600', 'gray.400')
  const utils = trpc.useContext()
  const getUsers = trpc.useQuery(['users.getUsers'])
  const getJuiceRequests = trpc.useQuery(['juiceRequests.getJuiceRequests'])
  const updateJuiceRequest = trpc.useMutation(
    'juiceRequests.updateJuiceRequest'
  )
  const deleteJuiceRequest = trpc.useMutation(
    'juiceRequests.deleteJuiceRequest'
  )
  const createNewJuiceRequest = trpc.useMutation(
    'juiceRequests.createJuiceRequest'
  )
  const [juiceRequests, setJuiceRequests] = useState<
    JuiceRequest[] | undefined
  >()
  const [users, setUsers] = useState<User[] | undefined>()
  const { user } = useAuthContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // this updates the UI when the userQuery data is first loaded.
  useEffect(() => {
    if (getJuiceRequests.isFetching) setJuiceRequests(undefined)
    if (getJuiceRequests.isFetched) setJuiceRequests(getJuiceRequests.data)
  }, [
    getJuiceRequests.data,
    getJuiceRequests.isFetched,
    getJuiceRequests.isFetching
  ])

  useEffect(() => {
    if (getUsers.isFetching) setUsers(undefined)
    if (getUsers.isFetched) setUsers(getUsers.data)
  }, [getUsers.data, getUsers.isFetched, getUsers.isFetching])

  const handleClose = () => {
    onClose()
  }

  const handleCreateJuiceRequest = useCallback(
    async (data: NewJuiceRequest) => {
      await createNewJuiceRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['juiceRequests.getJuiceRequests'])
        }
      })
    },
    [createNewJuiceRequest, utils]
  )

  const handleDeleteJuiceRequest = useCallback(
    async (id: string) => {
      await deleteJuiceRequest.mutateAsync(
        { id },
        {
          onSuccess: () => {
            utils.invalidateQueries(['juiceRequests.getJuiceRequests'])
          }
        }
      )
    },
    [deleteJuiceRequest, utils]
  )

  const handleUpdateJuiceRequest = useCallback(
    async (data: JuiceRequestUpdate) => {
      await updateJuiceRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['juiceRequests.getJuiceRequests'])
        }
      })
    },
    [updateJuiceRequest, utils]
  )

  const filterTodaysRequests = (requests: JuiceRequest[] | undefined) => {
    const today = new Date()
    const todaysRequests = requests?.filter(request => {
      const requestDate = new Date(request.createdAt)
      return (
        requestDate.getDate() === today.getDate() &&
        requestDate.getMonth() === today.getMonth() &&
        requestDate.getFullYear() === today.getFullYear()
      )
    })
    return todaysRequests
  }

  const filterPastRequests = (requests: JuiceRequest[] | undefined) => {
    const today = new Date()
    const pastRequests = requests?.filter(request => {
      const requestDate = new Date(request.createdAt)
      return (
        requestDate.getDate() < today.getDate() ||
        requestDate.getMonth() < today.getMonth() ||
        requestDate.getFullYear() < today.getFullYear()
      )
    })
    return pastRequests
  }

  if (!user.firstName) {
    return <LoginForm />
  }

  return (
    <>
      <NewJuiceRequestModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleCreateJuiceRequest}
      />
      <HStack justify="space-between" mb={4}>
        <Heading>Juice Orders</Heading>
        <Button
          leftIcon={<BiMessageRoundedAdd />}
          variant="outline"
          colorScheme="green"
          onClick={onOpen}
        >
          New Request
        </Button>
      </HStack>
      <Text fontSize="sm" color={HandleColorModeChange} mb={8}>
        Input your order the night before or before 12 pm on the day of.
      </Text>
      <Heading size="md" mt="4">
        {"Today's Requests"}
      </Heading>
      <Text fontSize="sm" color="gray.500">
        {juiceRequests?.length} request(s)
      </Text>
      <Box mb={4}>
        {filterTodaysRequests(juiceRequests)?.map(juiceRequest => (
          <JuiceRequestCard
            users={users}
            id={juiceRequest.id}
            key={juiceRequest.id}
            requestedBy={juiceRequest.requestFromId}
            lemonAmount={juiceRequest.lemonAmount}
            orangeAmount={juiceRequest.orangeAmount}
            grapefruitAmount={juiceRequest.grapefruitAmount}
            notes={juiceRequest.notes}
            createdAt={juiceRequest.createdAt}
            onDelete={handleDeleteJuiceRequest}
            handleUpdateJuiceRequest={handleUpdateJuiceRequest}
          />
        ))}
      </Box>
      <Divider />
      <Heading size="md" mt="4">
        {'Past Requests'}
      </Heading>
      {filterPastRequests(juiceRequests)?.map(juiceRequest => (
        <JuiceRequestCard
          users={users}
          id={juiceRequest.id}
          key={juiceRequest.id}
          requestedBy={juiceRequest.requestFromId}
          lemonAmount={juiceRequest.lemonAmount}
          orangeAmount={juiceRequest.orangeAmount}
          grapefruitAmount={juiceRequest.grapefruitAmount}
          notes={juiceRequest.notes}
          createdAt={juiceRequest.createdAt}
          onDelete={handleDeleteJuiceRequest}
          handleUpdateJuiceRequest={handleUpdateJuiceRequest}
        />
      ))}
    </>
  )
}
