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

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function NewTaskModal({
  //   handleCreateTask,
  isOpen,
  onClose
}: Props) {
  const [taskName, setTaskName] = React.useState('')
  const [isWriting, setIsWriting] = React.useState(false)

  const clearForm = () => {
    return null
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

  const handleSubmit = () => {
    // confirm that required fields are filled out
  }

  return (
    <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="25px">
            <FormControl isRequired>
              <FormLabel as="legend">First Name</FormLabel>
              <Input
                placeholder="Task Name"
                variant="outline"
                onChange={event => setTaskName(event.target.value)}
                value={taskName}
              />
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
