/*
    This is a modal that pops up when the user clicks 
    on Update in a user's card.

    This modal will contain a form to edit a user's information.

    When the user clicks Update, we will query the database 
    for the user's information and populate the form with it.

    [] On submit: 
        the data in the form will overwrite the user's data in the database,
        and the page will refresh. Closing the modal.

        [] Fix: I don't want the page to refresh. 
        I just want the user's card to update.

    [x] On close:
    if the user has edited the data in the form, 
        a confirmation modal to save changes will pop up. 
            If the user clicks Yes, 
                the modal will close and the edits will be lost.
            If the user clicks No,
                the modal will stay open.
    if the user has not edited the form's data,
        the modal will close.
*/

import React, { useEffect, useState } from 'react'
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
import type { User } from '../types'

interface Props {
  handleUserUpdate: (data: User) => void
  uid: string
  firstName: string
  lastName: string
  alias: string
  password: string
  authLevel: string
  isOpen: boolean
  onClose: () => void
}

function UpdateUserModal({
  handleUserUpdate,
  uid,
  firstName,
  lastName,
  alias,
  password,
  authLevel,
  isOpen,
  onClose
}: Props) {
  const [newFirstName, setNewFirstName] = useState(firstName)
  const [newLastName, setNewLastName] = useState(lastName)
  const [newAlias, setNewAlias] = useState(alias)
  const [newPassword, setNewPassword] = useState(password)
  const [newAuthLevel, setNewAuthLevel] = useState(authLevel)
  const [isWriting, setIsWriting] = useState(false)
  //   const router = useRouter()

  // check to see if the user has edited the form
  useEffect(() => {
    if (
      newFirstName !== firstName ||
      newLastName !== lastName ||
      newAlias !== alias ||
      newPassword !== password ||
      newAuthLevel !== authLevel
    ) {
      setIsWriting(true)
    }
  }, [
    firstName,
    lastName,
    alias,
    password,
    authLevel,
    newFirstName,
    newLastName,
    newAlias,
    newPassword,
    newAuthLevel
  ])

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthLevel(e.target.value)
  }

  const handleClose = () => {
    const resetForm = () => {
      setNewFirstName(firstName)
      setNewLastName(lastName)
      setNewAlias(alias)
      setNewPassword(password)
      setNewAuthLevel(authLevel)
    }
    if (isWriting) {
      const confirmation = window.confirm(
        'Are you sure you want to close this modal? All changes will be lost.'
      )
      if (confirmation) {
        resetForm()
        onClose()
      }
    } else {
      onClose()
    }
  }

  const onUpdate = () => {
    handleUserUpdate({
      id: uid,
      firstName: newFirstName,
      lastName: newLastName,
      alias: newAlias,
      password: newPassword,
      auth: newAuthLevel
    })
    onClose()
  }

  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="25px">
              <FormControl isRequired>
                <FormLabel as="legend">First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  variant="outline"
                  onChange={event => setNewFirstName(event.target.value)}
                  value={newFirstName}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel as="legend">Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  variant="outline"
                  onChange={event => setNewLastName(event.target.value)}
                  value={newLastName}
                />
              </FormControl>
              <FormControl>
                <FormLabel as="legend">Alias or Nickname</FormLabel>
                <Input
                  placeholder="Alias"
                  variant="outline"
                  onChange={event => setNewAlias(event.target.value)}
                  value={newAlias}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel as="legend">Password</FormLabel>
                <Input
                  placeholder="Password"
                  variant="outline"
                  onChange={event => setNewPassword(event.target.value)}
                  value={newPassword}
                />
                <FormHelperText>
                  Use the same password as their Toast POS login
                </FormHelperText>
              </FormControl>
              <FormControl isRequired as="fieldset">
                <FormLabel as="legend">Authorization Level</FormLabel>
                <RadioGroup value={newAuthLevel}>
                  <HStack spacing="24px">
                    <Radio value="user" onChange={handleOptionChange}>
                      User
                    </Radio>
                    <Radio value="bar" onChange={handleOptionChange}>
                      Bar
                    </Radio>
                    <Radio value="kitchen" onChange={handleOptionChange}>
                      Kitchen
                    </Radio>
                    <Radio value="admin" onChange={handleOptionChange}>
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
            <Button variant="outline" colorScheme="blue" onClick={onUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateUserModal
