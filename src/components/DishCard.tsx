import React, { useMemo } from 'react'
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

// this function is used to display the menu name(s) in the DishCard
const HandleDisplayMenuName = (dish: any) => {
  return useMemo(() => {
    if (!dish.menu) {
      return ''
    }
    if (dish.menu.length === 1) {
      return dish.menu[0].name.toUpperCase()
    }
    if (dish.menu?.length > 1) {
      return dish.menu
        ?.map((menu: Menu) => menu.name)
        .join(', ')
        .toUpperCase()
    }
  }, [dish.menu])
}

export default function Index(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate
  } = useDisclosure()

  const URL = `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
  const placeHolderURL =
    'https://res.cloudinary.com/zola-barzola/image/upload/v1663360120/cld-sample-4.jpg'

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
          {HandleDisplayMenuName(props.dish)}
        </Text>
        <Flex alignItems="start" gap="10px">
          <Box
            minH={'60px'}
            minW={'60px'}
            position="relative"
            onClick={onOpen}
            cursor="pointer"
          >
            <Image
              src={props.dish.imageId ? URL : placeHolderURL}
              alt="picture of food"
              width={60}
              height={60}
              style={{
                borderRadius: '50%',
                boxShadow: 'base',
                minHeight: '60px',
                minWidth: '60px'
              }}
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
