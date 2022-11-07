import React from 'react'
import Image from 'next/image'
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
import type { Dish, Component, Menu, MenuSection } from '../types'

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
  const components = props.dish.components
  const allergens = components?.map(component => component.allergens)
  const allergenList = allergens?.flat()

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

  const menuSection = () => {
    let menuSections = ''
    props.dish.menuSection?.forEach(
      (section: MenuSection) => (menuSections += section.name)
    )
    return menuSections
  }

  const Component = ({ component }: { component: Component }) => {
    return (
      <List>
        <ListItem fontWeight="bold">{component.name}</ListItem>
        <ListItem>{component.description}</ListItem>{' '}
      </List>
    )
  }

  const Allergen = ({ allergenName }: { allergenName: string }) => {
    return <ListItem>{allergenName}</ListItem>
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
          {`${menuList()} - ${menuSection()}`}
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
                color={useColorModeValue('gray.900', 'gray.400')}
                fontWeight={300}
                fontSize={'2xl'}
              >{`$${props.dish.price}`}</Text>
            </Box>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction="column"
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={useColorModeValue('gray.500', 'gray.400')}
                  fontSize={'xl'}
                  fontWeight={'300'}
                >
                  {props.dish.description}
                </Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Components
                </Text>
                <SimpleGrid columns={{ base: 1 }} spacing={5}>
                  {components?.map((component: Component) => {
                    return (
                      <Component key={component.id} component={component} />
                    )
                  })}
                </SimpleGrid>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Common Allergens
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <List>
                    {allergenList?.map(allergen => {
                      if (allergen)
                        return (
                          <Allergen
                            key={allergen.id}
                            allergenName={allergen.name}
                          />
                        )
                    })}
                  </List>
                </SimpleGrid>
              </Box>
              <Stack direction={'column'} align={'start'}>
                <Flex align={'center'} gap={2}>
                  <Avatar
                    src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                  />
                  <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                    <Stack direction={'row'} spacing={2} fontSize={'sm'}>
                      <Text color={'gray.500'}>Last edited:</Text>
                      <Text>Feb 08, 2021</Text>
                    </Stack>
                    <Stack direction={'row'} spacing={2} fontSize={'sm'}>
                      <Text color={'gray.500'}>By:</Text>
                      <Text fontWeight={600}>Achim Rolle</Text>
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
