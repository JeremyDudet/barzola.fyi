import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  Textarea
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAuthContext } from '../context/AuthContext'
import LoginForm from './LoginForm'
import type { NewJuiceRequest } from '../types'

const StyledSpanStart = styled.div`
  color: gray;
  font-size: 1.1rem;
  font-style: italic;
`
const StyledSpanEnd = styled.div`
  color: gray;
  font-size: 1.1rem;
  font-style: italic;
`

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewJuiceRequest) => void
}

export default function NewJuiceRequestModal({
  isOpen,
  onClose,
  onSubmit
}: Props) {
  const { user } = useAuthContext()
  const [lemonJuice, setLemonJuice] = useState(0)
  const [orangeJuice, setOrangeJuice] = useState(0)
  const [grapefruitJuice, setGrapefruitJuice] = useState(0)
  const [notes, setNotes] = useState<string>('')
  const [isWriting, setIsWriting] = useState(false)
  // const [notes, setNotes] = useState('')

  const HandleColorModeChange = (light: string, dark: string) => {
    return useColorModeValue(light, dark)
  }

  useEffect(() => {
    if (
      lemonJuice !== 0 ||
      orangeJuice !== 0 ||
      grapefruitJuice !== 0 ||
      notes.length > 0
    ) {
      setIsWriting(true)
    } else {
      setIsWriting(false)
    }
  }, [lemonJuice, orangeJuice, grapefruitJuice, notes])

  const clearForm = () => {
    setLemonJuice(0)
    setOrangeJuice(0)
    setGrapefruitJuice(0)
    setNotes('')
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
    console.log('submitting')
    onSubmit({
      requestFromId: user.id,
      lemonAmount: lemonJuice,
      orangeAmount: orangeJuice,
      grapefruitAmount: grapefruitJuice,
      notes
    })
    clearForm()
    onClose()
  }

  if (!user.firstName) {
    return <LoginForm />
  }
  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box pb="1.5rem">
              <StyledSpanStart>Please, may I have...</StyledSpanStart>
            </Box>
            <FormControl>
              <HStack
                borderRadius="lg"
                alignItems="center"
                justify="space-between"
                pb="4"
              >
                <FormLabel
                  color={HandleColorModeChange('yellow.500', 'yellow.300')}
                  m="0"
                  fontWeight="semibold"
                  fontSize="1.15rem"
                >
                  Lemon Juice:
                </FormLabel>
                <HStack>
                  <NumberInput
                    value={lemonJuice}
                    onChange={value => setLemonJuice(Number(value))}
                    maxW="6rem"
                    step={0.25}
                    max={3}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel>quarts</FormLabel>
                </HStack>
              </HStack>
              <HStack alignItems="center" justify="space-between" pb="4">
                <FormLabel
                  color={HandleColorModeChange('orange.500', 'orange.300')}
                  m="0"
                  fontWeight="semibold"
                  fontSize="1.15rem"
                  pr=""
                >
                  Orange Juice:
                </FormLabel>
                <HStack>
                  <NumberInput
                    value={orangeJuice}
                    onChange={value => setOrangeJuice(Number(value))}
                    maxW="6rem"
                    step={0.25}
                    max={3}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel>quarts</FormLabel>
                </HStack>
              </HStack>
              <HStack alignItems="center" justify="space-between" pb="4">
                <FormLabel
                  color={HandleColorModeChange('red.500', 'red.300')}
                  m="0"
                  fontWeight="semibold"
                  fontSize="1.15rem"
                  pr=""
                >
                  Grapefruit Juice:
                </FormLabel>
                <HStack>
                  <NumberInput
                    value={grapefruitJuice}
                    onChange={value => setGrapefruitJuice(Number(value))}
                    maxW="6rem"
                    step={0.25}
                    max={3}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel>quarts</FormLabel>
                </HStack>
              </HStack>
              <VStack alignItems="flex-end" pr="2rem" py="1.2rem">
                <StyledSpanEnd>{`...thank you. `}</StyledSpanEnd>
                <StyledSpanEnd>{`- ${
                  user.alias ? user.alias : user.firstName
                }`}</StyledSpanEnd>
              </VStack>
              <StyledSpanEnd>PS: </StyledSpanEnd>
              <Textarea
                placeholder="Optional notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </FormControl>
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
    </>
  )
}

// export interface NewJuiceRequest {
//   requestFromId: string
//   lemonAmount: number
//   orangeAmount: number
//   grapefruitAmount: number
//   notes: string | null
// }
