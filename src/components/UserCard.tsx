/*
  [x] If the user clicks on Edit, a modal will pop up with a form to edit the user.
    If the user clicks Save, the user will be updated in the database,
    and the page will refresh.

  []  Update User
*/

import React, { useRef } from 'react'
import {
  Flex,
  Box,
  Image,
  Heading,
  Center,
  useDisclosure,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import AlertDeleteModal from './AlertDeleteModal'
import UpdateUserModal from './UpdateUserModal'
import { User } from '../types'

interface Props {
  handleUserDelete: (uid: string) => void
  handleUserUpdate: (data: User) => void
  uid: string
  firstName: string
  lastName: string
  alias: string
  password: string
  auth: string
}

function UserCard({
  handleUserDelete,
  handleUserUpdate,
  uid,
  firstName,
  lastName,
  alias,
  password,
  auth
}: Props) {
  const image = ''
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()
  const cancelRef = useRef(null)

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <>
      <AlertDeleteModal
        handleDelete={handleUserDelete}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        cancelRef={cancelRef}
        id={uid}
        actionDescriptor="Delete User"
      />
      <UpdateUserModal
        handleUserUpdate={handleUserUpdate}
        uid={uid}
        firstName={firstName}
        lastName={lastName}
        alias={alias}
        password={password}
        authLevel={auth}
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
      />
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
          <Flex
            justifyContent={{
              base: 'center',
              md: 'end'
            }}
            mt={-16}
          >
            {image ? (
              <Image
                w={20}
                h={20}
                fit="cover"
                rounded="full"
                borderStyle="solid"
                borderWidth={2}
                color="brand.500"
                _dark={{
                  color: 'brand.400'
                }}
                alt="Testimonial avatar"
                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
              />
            ) : (
              <Center
                w={20}
                h={20}
                rounded="full"
                borderStyle="solid"
                borderWidth={2}
                color="brand.500"
                fontSize="2xl"
                bg="gray.100"
                _dark={{
                  bg: 'gray.700',
                  color: 'brand.400'
                }}
              >
                <Heading>{`${firstName.charAt(0)}${lastName.charAt(
                  0
                )}`}</Heading>
              </Center>
            )}
          </Flex>
          <Center>
            <Heading
              color="gray.800"
              _dark={{
                color: 'white'
              }}
              fontSize={{
                base: '2xl',
                md: '3xl'
              }}
              mt={{
                base: 2,
                md: 0
              }}
              fontWeight="bold"
            >
              {alias ? `${alias}` : `${firstName} ${lastName}`}
            </Heading>
          </Center>
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td>First</Td>
                <Td>{firstName}</Td>
              </Tr>
              <Tr>
                <Td>Last</Td>
                <Td>{lastName}</Td>
              </Tr>
              <Tr>
                <Td>Alias</Td>
                <Td>{alias}</Td>
              </Tr>
              <Tr>
                <Td>Password</Td>
                <Td>{password}</Td>
              </Tr>
              <Tr>
                <Td>Authorization</Td>
                <Td>{capitalize(auth)}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Flex mt={4} justifyContent="flex-end" gap="1rem">
            <IconButton
              variant={'outline'}
              aria-label="update"
              icon={<EditIcon />}
              colorScheme="blue"
              onClick={onUpdateOpen}
            >
              Update
            </IconButton>
            <IconButton
              variant={'outline'}
              aria-label="delete"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={onDeleteOpen}
            >
              Delete
            </IconButton>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default UserCard
