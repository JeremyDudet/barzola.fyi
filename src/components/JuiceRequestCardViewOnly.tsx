import { Box, Text, Flex, VStack, HStack, Center } from '@chakra-ui/react'
import styled from '@emotion/styled'
import type { User } from '../types'

const StyledSpan = styled.span`
  color: gray;
  font-size: 1.1rem;
  font-style: italic;
`

interface Props {
  id: string
  users: User[] | undefined
  requestedBy: string
  lemonAmount: number
  orangeAmount: number
  grapefruitAmount: number
  notes: string | null
  createdAt: Date
}

export default function JuiceRequestCard(props: Props) {
  const user = props.users?.find(user => user.id === props.requestedBy) // find the user that matches the requestedBy id

  const determineIfPlural = (amount: number) => {
    return amount > 1 ? 's' : ''
  }

  const formatedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: '2-digit',
      month: '2-digit',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  return (
    <>
      <Flex p={38} w="full" alignItems="center" justifyContent="center">
        <Box
          w="md"
          mx="auto"
          py={4}
          px={8}
          bg="white"
          _dark={{
            bg: 'gray.800'
          }}
          shadow="lg"
          rounded="lg"
        >
          <Box mb="4">
            <StyledSpan>{formatedDate(props.createdAt)}</StyledSpan>
          </Box>
          {props.lemonAmount === 0 &&
          props.orangeAmount === 0 &&
          props.grapefruitAmount === 0 ? (
            <>
              <Center>
                <StyledSpan>No juice needed!</StyledSpan>
              </Center>
              <VStack alignItems="flex-end" pr="2rem" py="1.2rem">
                <StyledSpan>{`...thank you. `}</StyledSpan>
                <StyledSpan>{`- ${
                  user?.alias ? user?.alias : user?.firstName
                }`}</StyledSpan>
              </VStack>
              {props.notes ? (
                <Box alignItems="flex-start">
                  <StyledSpan>{`PS: `}</StyledSpan>
                  <StyledSpan>{props.notes}</StyledSpan>
                </Box>
              ) : null}
            </>
          ) : (
            <>
              <Box pb="1.5rem">
                <StyledSpan>May I please have:</StyledSpan>
              </Box>
              <VStack alignItems="center" pb="1.5rem">
                <HStack justifyContent="flex-start">
                  {props.lemonAmount ? (
                    <Text fontWeight="semibold">{`${
                      props.lemonAmount
                    } quart${determineIfPlural(
                      props.lemonAmount
                    )} of lemon juice${props.orangeAmount ? ',' : ''}`}</Text>
                  ) : null}
                </HStack>
                <Box>
                  {props.orangeAmount ? (
                    <Text fontWeight="semibold">{`${
                      props.orangeAmount
                    } quart${determineIfPlural(
                      props.orangeAmount
                    )} of orange juice${
                      props.grapefruitAmount ? ',' : ''
                    }`}</Text>
                  ) : null}
                </Box>
                <Box>
                  {props.grapefruitAmount ? (
                    <Text fontWeight="semibold">{`${
                      props.grapefruitAmount
                    } quart${determineIfPlural(
                      props.grapefruitAmount
                    )} of grapefruit juice`}</Text>
                  ) : null}
                </Box>
              </VStack>
              <VStack alignItems="flex-end" pb="1.5rem">
                <StyledSpan>{`...thank you. `}</StyledSpan>
                <StyledSpan>{`- ${
                  user?.alias ? user?.alias : user?.firstName
                }`}</StyledSpan>
              </VStack>
              {props.notes ? (
                <Box alignItems="flex-start">
                  <StyledSpan>{`PS: `}</StyledSpan>
                  <StyledSpan>{props.notes}</StyledSpan>
                </Box>
              ) : null}
            </>
          )}
        </Box>
      </Flex>
    </>
  )
}
