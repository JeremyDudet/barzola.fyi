import React from 'react'
import Image from 'next/image'
import { trpc } from '../utils/trpc'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  // Image,
  VStack,
  ModalBody,
  Flex,
  Box,
  useColorModeValue,
  Stack,
  StackDivider,
  Text,
  Heading,
  Avatar,
  ModalCloseButton,
  SimpleGrid,
  List,
  ListItem
} from '@chakra-ui/react'
import type { Dish, Component, Menu, MenuSection, User } from '../types'

interface Props {
  dish: Dish
  isOpen: boolean
  onClose: () => void
}

const hello = 'name'

// export interface Dish {
//     id: string
//     name: string
//     description: string
//     advertisedDescription: string
//     price: number
//     components?: Component[]
//     menu?: Menu
//     menuSection?: MenuSection
//     allergens?: Allergen[]
//   }

export default function FoodNoteModal(props: Props) {
  // grab user by id
  const getUserById = trpc.useQuery([
    'users.getUser',
    {
      id: props.dish.lastEditedById
    }
  ])
  // const components = props.dish.components
  // const allergens = components?.map(component => component.allergens)
  // const allergenList = allergens?.flat()

  const menuList = () => {
    const menus = props.dish.menu
    let menuString = ''
    menus?.forEach((menu: Menu, index?: number) => {
      // if this is the first one, don't add an & or comma
      if (index === 0) {
        menuString += menu.name
      }
      // if menus.length is longer than 1, and this is the last one, add an & before it
      if (menus.length !== 1 && index === menus.length - 1) {
        menuString += ` & ${menu.name}`
      }
      // if this is neither the first nor last, add a comma
      if (index !== 0 && index !== menus.length - 1) {
        menuString += `, ${menu.name}`
      }
    })
    return (menuString += ' menu')
  }

  const handleDisplayedImage = () => {
    if (props.dish.imageId) {
      return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
    } else {
      return '/images/placeholder.png'
    }
  }

  const handleUserName = (user: User | undefined | null) => {
    if (user?.alias) {
      return user.alias
    } else {
      return `${user?.firstName} ${user?.lastName}`
    }
  }

  const handleDisplayLastEditedDate = (date: Date | undefined) => {
    return new Intl.DateTimeFormat('en-US').format(date)
  }

  const menuSection = (dish: any) => {
    let menuSections = ''
    dish.menuSection?.forEach(
      (section: MenuSection) => (menuSections += section.name)
    )
    return menuSections
  }

  // handle useColorModeValue higher order function
  const HandleUseColorModeValue = (light: string, dark: string) => {
    return useColorModeValue(light, dark)
  }

  const handleAllergens = (dish: Dish) => {
    const allergens: string[] = []
    dish.allergens?.forEach(allergen => {
      allergens.push(allergen.name)
    })
    return allergens.join(', ')
  }

  // if user data is loading, show loading
  if (getUserById.status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={{ base: 'full', md: 'xl' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="lg"
          fontWeight={500}
          textColor="gray.500"
          textTransform="uppercase"
          fontFamily={'heading'}
        >
          {`${menuList()} - ${menuSection(props.dish)}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            display="block"
            mb={6}
            w={'100%'}
            h="auto"
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              src={handleDisplayedImage()}
              layout="responsive"
              width="400px"
              height="283.5px"
              // fit="cover"
              // rounded={'md'}
              // align={'center'}
              alt={'product image'}
              quality="100"
              priority={true}
            />
          </Box>
          <Stack>
            <Box as={'header'}>
              <Heading lineHeight={1.1} fontWeight={600} fontSize={'2xl'}>
                {props.dish.name.toUpperCase()}
              </Heading>
              <Text
                color={HandleUseColorModeValue('gray.900', 'gray.400')}
                fontWeight={300}
                fontSize={'2xl'}
              >{`$${props.dish.price}`}</Text>
            </Box>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction="column"
              divider={
                <StackDivider
                  borderColor={HandleUseColorModeValue('gray.200', 'gray.600')}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={HandleUseColorModeValue('gray.500', 'gray.400')}
                  fontSize={'xl'}
                  fontWeight={'400'}
                >
                  {props.dish.advertisedDescription.toLocaleLowerCase()}
                </Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={HandleUseColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Description
                </Text>
                <Text
                  color={HandleUseColorModeValue('gray.600', 'gray.400')}
                  fontSize={'xl'}
                  fontWeight={'400'}
                >
                  {props.dish.description}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={HandleUseColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Common Allergens
                </Text>
                <Text
                  color={HandleUseColorModeValue('gray.600', 'gray.400')}
                  fontSize={'xl'}
                  fontWeight={'400'}
                >
                  {handleAllergens(props.dish)}
                </Text>
              </Box>
              <Stack direction={'column'} align={'start'}>
                <Flex align={'center'} gap={2}>
                  {/* <Avatar
                    src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                  /> */}
                  <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                    <Stack direction={'row'} spacing={2} fontSize={'sm'}>
                      <Text color={'gray.500'}>Last edited:</Text>
                      <Text>
                        {handleDisplayLastEditedDate(props.dish.lastEdited)}
                      </Text>
                    </Stack>
                    <Stack direction={'row'} spacing={2} fontSize={'sm'}>
                      <Text color={'gray.500'}>By:</Text>
                      <Text fontWeight={600}>
                        {handleUserName(getUserById.data)}
                      </Text>
                    </Stack>
                  </Stack>
                </Flex>
              </Stack>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
