/* 
Summary: This is the main component for the authentication process.

This is the authentication component that users get redirected to when:
1. They first open the website, and they are not logged in.
    (aka, they don't have a localstorage token)
2. They click "Switch Users" in the navbar. (aka logout)

----------------------------------------
  
When this component mounts, it grabs users from the database.
The inputed password will be compared to the passwords in the database.
If the passwords match, the user will be logged in, and
and then the client-side will render the original page they were on.

----------------------------------------

This is a custom implementation of the Chakra UI PinInput component.
The PinInput component is a component that allows users to input a 4-digit pin.
The PinInput component from Chakra UI was actually a bit buggy, so I had to
implement my own version of it.

*/

import { useEffect, useState, useRef } from 'react'
import { trpc } from '../utils/trpc'
import { ArrowRightIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Text,
  Heading,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  PopoverCloseButton,
  PopoverBody,
  Image,
  HStack,
  Input,
  useToast
} from '@chakra-ui/react'
import { useAuthContext } from '../context/AuthContext'
import { User } from '../types'

export default function LoginForm() {
  // fetch array of user objects from database
  const userQuery = trpc.useQuery(['users.getUsers'])
  const toast = useToast() // for toast notifications
  const { onOpen, onClose, isOpen } = useDisclosure() // for popover
  const { changeUser } = useAuthContext() // change user context
  const firstPinInput = useRef<HTMLInputElement>(null)
  const secondPinInput = useRef<HTMLInputElement>(null)
  const thirdPinInput = useRef<HTMLInputElement>(null)
  const fourthPinInput = useRef<HTMLInputElement>(null)
  const [firstPin, setFirstPin] = useState<string>('')
  const [secondPin, setSecondPin] = useState<string>('')
  const [thirdPin, setThirdPin] = useState<string>('')
  const [fourthPin, setFourthPin] = useState<string>('')

  const password = firstPin + secondPin + thirdPin + fourthPin

  const clearInputs = () => {
    setFirstPin('')
    setSecondPin('')
    setThirdPin('')
    setFourthPin('')
  }

  // use this to check if password matches a user's password
  function handleSubmit(password: string) {
    let matched = false
    // loop through users array
    userQuery?.data?.forEach((user: User) => {
      if (password === user.password) {
        console.log('password matched')
        matched = true
        clearInputs() // reset password input
        changeUser(user) // login user
      }
    })

    if (!matched) {
      // show error message
      clearInputs()
      console.log('Error: no such password')
      if (firstPinInput.current) {
        firstPinInput.current?.focus() // focus on password input
      }
      return toast({
        // send error message toast
        position: 'top',
        title: 'Password not found.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  // if backspace is pressed, delete previous input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      // remove the last character from the password
      console.log('backspace pressed')
      if (fourthPin) {
        setFourthPin('')
        return thirdPinInput.current?.focus()
      }
      if (thirdPin) {
        setThirdPin('')
        return secondPinInput.current?.focus()
      }
      if (secondPin) {
        setSecondPin('')
        return firstPinInput.current?.focus()
      }
      if (firstPin) {
        setFirstPin('')
      }
    }
  }

  // focus on first input when component mounts
  useEffect(() => {
    firstPinInput.current?.focus()
  }, [])

  const handleFocus = (password: string) => {
    if (password.length === 0) return firstPinInput.current?.focus()
    if (password.length === 1) return secondPinInput.current?.focus()
    if (password.length === 2) return thirdPinInput.current?.focus()
    if (password.length === 3) return fourthPinInput.current?.focus()
  }
  // here we are controlling the focus of the input
  useEffect(() => {
    // if password length is 1, focus on second input
    handleFocus(password)
    console.log('password: ' + password)
  }, [password])

  return (
    <Flex paddingTop="1rem" direction="column" gap={10}>
      <Flex justify="center">
        <Heading>ENTER PASSWORD</Heading>
        <Popover
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          placement="top-start"
          orientation="horizontal"
        >
          <PopoverTrigger>
            <IconButton
              aria-label="input password"
              position="relative"
              left="3px"
              top="5px"
              variant="ghost"
              size="sm"
              icon={<InfoOutlineIcon />}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Hint</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <Text alignItems="center">
                Use the same password you were given to access Toast
                <Image
                  display="inline"
                  position="relative"
                  top="3px"
                  borderRadius="full"
                  boxSize="15px"
                  src="/toast_favicon.png"
                  alt="Toast Logo"
                />
              </Text>
            </PopoverBody>
            <PopoverFooter>
              <Text>{"If your password doesn't work, let me know. 🙏"}</Text>
              <Text float="right">- Jeremy</Text>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Flex>
      <HStack justifyContent="center">
        <Input
          maxW="45px"
          maxLength={1}
          size="lg"
          pattern="\d*" // only allow numbers
          as="input"
          ref={firstPinInput}
          value={firstPin}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus(password)}
          onChange={e => setFirstPin(e.target.value)}
        />
        <Input
          pattern="\d*" // only allow numbers
          maxW="45px"
          size="lg"
          maxLength={1}
          ref={secondPinInput}
          value={secondPin}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus(password)}
          onChange={e => setSecondPin(e.target.value)}
        />
        <Input
          pattern="\d*" // only allow numbers
          maxW="45px"
          size="lg"
          maxLength={1}
          ref={thirdPinInput}
          value={thirdPin}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus(password)}
          onChange={e => setThirdPin(e.target.value)}
        />
        <Input
          pattern="\d*" // only allow numbers
          maxW="45px"
          size="lg"
          maxLength={1}
          ref={fourthPinInput}
          value={fourthPin}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus(password)}
          onChange={e => setFourthPin(e.target.value)}
        />
      </HStack>
      <Flex justify="center">
        <Button
          as={Button}
          size="lg"
          rightIcon={<ArrowRightIcon />}
          width="6rem"
          onClick={() => handleSubmit(password)}
        >
          GO
        </Button>
      </Flex>
    </Flex>
  )
}
