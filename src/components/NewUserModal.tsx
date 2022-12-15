/*
    This is a modal that pops up when the user clicks on Add User.
    This modal will contain a form to add a user.

    [x] On submit: 
        the user will be added to the database,
        and trpc will refetch and load users.
        The modal closes.

    [x] On close:
    if the user has entered data into the form, 
        a confirmation modal will pop up. 
            If the user clicks Yes, 
                the modal will close and the data will be lost.
            If the user clicks No,
                the modal will stay open.
    if the user has not entered data into the form,
        the modal will close.
*/

import React, { useEffect } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  VStack,
  FormHelperText,
  Table,
  Tbody,
  Tr,
  Td
} from '@chakra-ui/react'
import type { NewUser } from '../types'

interface Props {
  handleCreateUser: (data: NewUser) => Promise<void>
  isOpen: boolean
  onClose: () => void
}

function NewUserModal({ handleCreateUser, isOpen, onClose }: Props) {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [alias, setAlias] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [authLevel, setAuthLevel] = React.useState('user')
  const [email, setEmail] = React.useState('')
  const [birthDate, setBirthDate] = React.useState(new Date())
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [profileImageId, setProfileImageId] = React.useState('')
  const [isWriting, setIsWriting] = React.useState(false)

  useEffect(() => {
    if (firstName || lastName || alias || password) {
      setIsWriting(true)
    } else {
      setIsWriting(false)
    }
  }, [firstName, lastName, alias, password])

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setAlias('')
    setPassword('')
    setAuthLevel('user')
  }
  const handleClose = () => {
    if (isWriting) {
      const confirmation = window.confirm(
        'Are you sure you want to close this modal? All data will be lost.'
      )
      if (confirmation) {
        clearForm()
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthLevel(e.target.value)
  }

  const handleSubmit = () => {
    // confirm that required fields are filled out
    if (firstName === '' || lastName === '' || password === '') {
      alert('Please fill out all required fields.')
    } else {
      handleCreateUser({
        firstName,
        lastName,
        alias,
        password,
        auth: authLevel,
        email,
        birthDate,
        phoneNumber,
        status,
        profileImageId
      })
      clearForm()
      onClose()
    }
  }

  return (
    <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="25px">
            <FormControl isRequired>
              <FormLabel as="legend">First Name</FormLabel>
              <Input
                placeholder="First Name"
                variant="outline"
                onChange={event => setFirstName(event.target.value)}
                value={firstName}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                variant="outline"
                onChange={event => setLastName(event.target.value)}
                value={lastName}
              />
            </FormControl>
            <FormControl>
              <FormLabel as="legend">Alias or Nickname</FormLabel>
              <Input
                placeholder="Alias"
                variant="outline"
                onChange={event => setAlias(event.target.value)}
                value={alias}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Password</FormLabel>
              <Input
                placeholder="Password"
                variant="outline"
                onChange={event => setPassword(event.target.value)}
                value={password}
              />
              <FormHelperText>
                Use the same password as their Toast POS login
              </FormHelperText>
            </FormControl>
            <FormControl isRequired as="fieldset">
              <FormLabel as="legend">Authorization Level</FormLabel>
              <RadioGroup defaultValue="user">
                <HStack spacing="24px">
                  <Radio
                    value="user"
                    checked={authLevel === 'user'}
                    onChange={handleOptionChange}
                  >
                    User
                  </Radio>
                  <Radio
                    value="bar"
                    checked={authLevel === 'bar'}
                    onChange={handleOptionChange}
                  >
                    Bar
                  </Radio>
                  <Radio
                    value="kitchen"
                    checked={authLevel === 'kitchen'}
                    onChange={handleOptionChange}
                  >
                    Kitchen
                  </Radio>
                  <Radio
                    value="admin"
                    checked={authLevel === 'admin'}
                    onChange={handleOptionChange}
                  >
                    Admin
                  </Radio>
                </HStack>
              </RadioGroup>
              <FormHelperText>
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
              </FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewUserModal
