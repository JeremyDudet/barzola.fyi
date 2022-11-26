import Image from 'next/image'
import FoodNoteModal from './FoodNoteModal'
import UpdateFoodNoteModal from './UpdateFoodNoteModal'
import {
  Box,
  Heading,
  Text,
  Flex,
  useDisclosure,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react'
import { Menu, UpdateDish } from '../types'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface Props {
  dish: any
  userAuth: string
  handleDishUpdate: (data: UpdateDish) => Promise<void>
  uid: string
  allergens: any
  menus: any
  handleDishDelete: (id: string) => Promise<void>
}

export default function Index(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate
  } = useDisclosure()

  const handleDisplayedImage = () => {
    if (props.dish.imageId) {
      return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
    } else {
      return '/images/placeholder.png'
    }
  }

  const handleDisplayMenuName = (dish: any) => {
    // if there is only one menu, return the name of that menu
    if (dish.menu?.length === 1) {
      return dish.menu[0].name.toUpperCase()
    }
    // if there are multiple menus, return the name of all the menus
    if (dish.menu?.length > 1) {
      return dish.menu
        ?.map((menu: Menu) => menu.name)
        .join(', ')
        .toUpperCase()
    }
  }

  return (
    <>
      <FoodNoteModal dish={props.dish} isOpen={isOpen} onClose={onClose} />
      <UpdateFoodNoteModal
        uid={props.uid}
        dish={props.dish}
        isOpen={isOpenUpdate}
        onClose={onCloseUpdate}
        handleDishUpdate={props.handleDishUpdate}
        menus={props.menus}
        allergens={props.allergens}
        handleDishDelete={props.handleDishDelete}
      />
      <Flex flexDirection="column">
        <Text
          pl="60px"
          fontSize="xs"
          textColor={useColorModeValue('gray.400', 'gray.500')}
        >
          {handleDisplayMenuName(props.dish)}
        </Text>
        <Flex alignItems="start" gap="10px">
          <Box
            minW="3rem"
            minH="3rem"
            maxW="3rem"
            maxH="3rem"
            width="3rem"
            height="3rem"
            borderRadius="50%"
            overflow="hidden"
            position="relative"
            boxShadow="base"
            onClick={onOpen}
            cursor="pointer"
          >
            <Image
              src={handleDisplayedImage()}
              layout="responsive"
              alt="picture of food"
              width="3rem"
              height="3rem"
            />
          </Box>
          <Flex
            flexDir="column"
            width="100%"
            height="100%"
            onClick={onOpen}
            cursor={'pointer'}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              marginTop="-3px"
            >
              <Heading fontSize="lg" textTransform="uppercase">
                {props.dish.name}
              </Heading>
              <Text
                justifySelf="flex-end"
                fontSize="16px"
                fontWeight="semibold"
              >{`${props.dish.price}`}</Text>
            </Flex>
            <Text fontSize="xs" textTransform="uppercase">
              {props.dish.advertisedDescription}
            </Text>
          </Flex>
          <Flex>
            <IconButton
              aria-label="edit"
              onClick={onOpenUpdate}
              style={{
                display: `${
                  props.userAuth === 'admin' || props.userAuth === 'kitchen'
                    ? ''
                    : 'none'
                }`
              }}
            >
              <BsThreeDotsVertical />
            </IconButton>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
