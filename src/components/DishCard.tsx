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
import { Dish, Menu, UpdateDish } from '../types'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface Props {
  dish: Dish
  userAuth: string
  handleDishUpdate: (data: UpdateDish) => Promise<void>
  uid: string
  allergens: any
}

export default function Index({
  dish,
  userAuth,
  handleDishUpdate,
  uid
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate
  } = useDisclosure()

  // // in an array of menus - add an & before the last menu instead of a comma
  // const menuList = () => {
  //   const menus = dish.menu
  //   let menuString = ''
  //   menus?.forEach((menu: Menu, index?: number) => {
  //     // if this is the first one, don't add an & or comma
  //     if (index === 0) {
  //       menuString += menu.name
  //     }
  //     // if menus.length is longer than 1, and this is the last one, add an & before it
  //     if (menus.length !== 1 && index === menus.length - 1) {
  //       menuString += ` & ${menu.name}`
  //     }
  //     // if this is neither the first nor last, add a comma
  //     if (index !== 0 && index !== menus.length - 1) {
  //       menuString += `, ${menu.name}`
  //     }
  //   })
  //   return (menuString += ' menu')
  // }

  const handleDisplayedImage = () => {
    if (dish.imageId) {
      return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${dish.imageId}`
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
      <FoodNoteModal dish={dish} isOpen={isOpen} onClose={onClose} />
      <UpdateFoodNoteModal
        uid={uid}
        dish={dish}
        isOpen={isOpenUpdate}
        onClose={onCloseUpdate}
        handleDishUpdate={handleDishUpdate}
      />
      <Flex flexDirection="column">
        <Text
          pl="60px"
          fontSize="xs"
          textColor={useColorModeValue('gray.400', 'gray.500')}
        >
          {handleDisplayMenuName(dish)}
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
          >
            <Image
              src={handleDisplayedImage()}
              layout="responsive"
              alt="picture of food"
              width="3rem"
              height="3rem"
            />
          </Box>
          <Flex flexDir="column" width="100%" height="100%" onClick={onOpen}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              marginTop="-3px"
            >
              <Heading fontSize="lg" textTransform="uppercase">
                {dish.name}
              </Heading>
              <Text
                justifySelf="flex-end"
                fontSize="16px"
                fontWeight="semibold"
              >{`${dish.price}`}</Text>
            </Flex>
            <Text fontSize="xs" textTransform="uppercase">
              {dish.advertisedDescription}
            </Text>
          </Flex>
          <Flex>
            <IconButton
              aria-label="edit"
              onClick={onOpenUpdate}
              style={{
                display: `${
                  userAuth === 'admin' || userAuth === 'kitchen' ? '' : 'none'
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
