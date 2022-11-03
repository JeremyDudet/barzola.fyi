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
  ModalContent
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAuthContext } from '../context/AuthContext'
import LoginForm from './LoginForm'
import type { JuiceRequestUpdate } from '../types'

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
  id: string
  lemonAmount: number
  orangeAmount: number
  grapefruitAmount: number
  notes: string | null
  isOpen: boolean
  onClose: () => void
  handleUpdateJuiceRequest: (data: JuiceRequestUpdate) => void
}

export default function UpdateJuiceRequestModal({
  id,
  lemonAmount,
  orangeAmount,
  grapefruitAmount,
  notes,
  isOpen,
  onClose,
  handleUpdateJuiceRequest
}: Props) {
  const { user } = useAuthContext()
  const [lemonJuice, setLemonJuice] = useState(lemonAmount)
  const [orangeJuice, setOrangeJuice] = useState(orangeAmount)
  const [grapefruitJuice, setGrapefruitJuice] = useState(grapefruitAmount)
  const [newNotes, setNewNotes] = useState<string | null>(notes)
  const [isWriting, setIsWriting] = useState(false)

  // handle isWriting state
  useEffect(() => {
    if (
      lemonJuice !== lemonAmount ||
      orangeJuice !== orangeAmount ||
      grapefruitJuice !== grapefruitAmount ||
      newNotes !== notes
    ) {
      setIsWriting(true)
    } else {
      setIsWriting(false)
    }
  }, [
    lemonJuice,
    orangeJuice,
    grapefruitJuice,
    newNotes,
    lemonAmount,
    orangeAmount,
    grapefruitAmount,
    notes
  ])

  const HandleColorModeChange = (light: string, dark: string) => {
    return useColorModeValue(light, dark)
  }

  const handleClose = () => {
    const resetForm = () => {
      setLemonJuice(lemonAmount)
      setOrangeJuice(orangeAmount)
      setGrapefruitJuice(grapefruitAmount)
      setNewNotes(notes)
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
    handleUpdateJuiceRequest({
      id,
      lemonAmount: lemonJuice,
      orangeAmount: orangeJuice,
      grapefruitAmount: grapefruitJuice,
      notes: notes
    })
    onClose()
  }

  if (!user.firstName) {
    return <LoginForm />
  }
  return (
    <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box pb="1.5rem">
            <StyledSpanStart>
              Please, for tomorrow may I have...
            </StyledSpanStart>
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
            {/* <Text mb="8px">Notes: </Text>
        <Textarea
          placeholder="Anything else?"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        /> */}
            <VStack alignItems="flex-end" pr="2rem" py="1.2rem">
              <StyledSpanEnd>{`...thank you. `}</StyledSpanEnd>
              <StyledSpanEnd>{`- ${
                user.alias ? user.alias : user.firstName
              }`}</StyledSpanEnd>
            </VStack>
          </FormControl>
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
  )
}

// export interface NewJuiceRequest {
//   requestFromId: string
//   lemonAmount: number
//   orangeAmount: number
//   grapefruitAmount: number
//   notes: string | null
// }
