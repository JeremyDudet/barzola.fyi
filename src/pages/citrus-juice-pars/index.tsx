import { useState, useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import LoginForm from '../../components/LoginForm'
import {
  Table,
  Thead,
  Tbody,
  Heading,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Box,
  Divider,
  Center
} from '@chakra-ui/react'
import ViewOnlyJuiceRequestCard from '../../components/JuiceRequestCardViewOnly'
import { trpc } from '../../utils/trpc'
import type { JuiceRequest, User } from '../../types'

export default function CitrusJuicePars() {
  const { user } = useAuthContext()
  const getJuiceRequests = trpc.useQuery(['juiceRequests.getJuiceRequests'])
  const getUsers = trpc.useQuery(['users.getUsers'])
  const [juiceRequests, setJuiceRequests] = useState<
    JuiceRequest[] | undefined
  >()
  const [users, setUsers] = useState<User[] | undefined>()

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

  // grab requests that were made the night before, or the same day before
  // if today's Tuesday, grab all requests from Saturday, Sunday, and Monday
  const filterTimelyRequests = (requests: JuiceRequest[] | undefined) => {
    // if there are no requests, return an empty array
    if (!requests) return []
    const today = new Date() // today's date
    const yesterday = new Date() // yesterday's date
    yesterday.setDate(today.getDate() - 1)

    // if today isn't Tuesday, return all requests from yesterday afternoon and today morning
    if (today.getDay() !== 2) {
      const yesterdayAfternoon = requests.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getHours() > 12 && // after 12pm
          requestDate.getDate() === yesterday.getDate() &&
          requestDate.getMonth() === yesterday.getMonth() &&
          requestDate.getFullYear() === yesterday.getFullYear()
        )
      })
      const todayBeforeNoon = requests?.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getHours() < 12 && // before 12pm
          requestDate.getDate() === today.getDate() &&
          requestDate.getMonth() === today.getMonth() &&
          requestDate.getFullYear() === today.getFullYear()
        )
      })
      return [...yesterdayAfternoon, ...todayBeforeNoon]
    } // else if today is Tuesday,
    // return all requests
    // from Saturday (afternoon),
    // Sunday (all day),
    // Monday (all day),
    // and Tuesday (before noon)
    else if (today.getDay() === 2) {
      const saturday = new Date()
      saturday.setDate(today.getDate() - 2)
      const sunday = new Date()
      sunday.setDate(today.getDate() - 3)
      const monday = new Date()
      monday.setDate(today.getDate() - 1)
      const saturdayRequests = requests.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getHours() > 12 && // after 12pm
          requestDate.getDate() === saturday.getDate() &&
          requestDate.getMonth() === saturday.getMonth() &&
          requestDate.getFullYear() === saturday.getFullYear()
        )
      })
      const sundayRequests = requests.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getDate() === sunday.getDate() &&
          requestDate.getMonth() === sunday.getMonth() &&
          requestDate.getFullYear() === sunday.getFullYear()
        )
      })
      const mondayRequests = requests.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getDate() === monday.getDate() &&
          requestDate.getMonth() === monday.getMonth() &&
          requestDate.getFullYear() === monday.getFullYear()
        )
      })
      const tuesdayBeforeNoon = requests.filter(request => {
        const requestDate = new Date(request.createdAt)
        return (
          requestDate.getHours() < 12 && // before 12pm
          requestDate.getDate() === today.getDate() &&
          requestDate.getMonth() === today.getMonth() &&
          requestDate.getFullYear() === today.getFullYear()
        )
      })
      return [
        ...saturdayRequests,
        ...sundayRequests,
        ...mondayRequests,
        ...tuesdayBeforeNoon
      ]
    }
  }

  const timelyRequests = filterTimelyRequests(juiceRequests)

  const HandleUseColorModeValue = (lightColor: string, darkColor: string) => {
    return useColorModeValue(lightColor, darkColor)
  }

  if (!user.firstName) {
    return <LoginForm />
  }

  return (
    <>
      <Heading mb={8}>Daily Citrus</Heading>
      <Heading size="md" mb={4}>
        Default Pars:
      </Heading>
      <TableContainer pb="1.5rem">
        <Table size="sm" variant="simple">
          <TableCaption>
            **if covers are more than or less than average adjust juice more or
            less acordingly
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Pars (avg covers)</Th>
              <Th>Tue (80-110)</Th>
              <Th>Wed/Thu (90 -125)</Th>
              <Th>Fri/Sat (110 -160)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr bg={HandleUseColorModeValue('green.200', 'green.900')}>
              <Td>Lime</Td>
              <Td>2 (L)</Td>
              <Td>2.75 (L)</Td>
              <Td>3 (L)</Td>
            </Tr>
            <Tr bg={HandleUseColorModeValue('yellow.200', 'yellow.900')}>
              <Td>Lemon</Td>
              <Td>1.5 (L)</Td>
              <Td>2 (L)</Td>
              <Td>2.25 (L)</Td>
            </Tr>
            <Tr bg={HandleUseColorModeValue('orange.200', 'orange.900')}>
              <Td>OJ ** </Td>
              <Td>1.5 (L)</Td>
              <Td>1.5 (L)</Td>
              <Td>1.5 (L)</Td>
            </Tr>
            <Tr bg={HandleUseColorModeValue('red.200', 'red.900')}>
              <Td>GF **</Td>
              <Td>1.5 (L)</Td>
              <Td>1.5 (L)</Td>
              <Td>1.5 (L)</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Divider />
      <Box mt={6}>
        <Heading size="md">{"Kitchen's Citrus Juice Requests:"}</Heading>
        {timelyRequests?.length === 0 && (
          <Center mt={12}>
            <Heading size="sm" color={'gray.500'} fontStyle="italic">
              No requests were made...
            </Heading>
          </Center>
        )}
        {timelyRequests?.map(juiceRequest => (
          <ViewOnlyJuiceRequestCard
            users={users}
            id={juiceRequest.id}
            key={juiceRequest.id}
            requestedBy={juiceRequest.requestFromId}
            lemonAmount={juiceRequest.lemonAmount}
            orangeAmount={juiceRequest.orangeAmount}
            grapefruitAmount={juiceRequest.grapefruitAmount}
            notes={juiceRequest.notes}
            createdAt={juiceRequest.createdAt}
          />
        ))}
      </Box>
    </>
  )
}
