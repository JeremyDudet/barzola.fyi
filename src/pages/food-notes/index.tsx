/*
  This page is the main page for the food notes.
  Here authorized users can add, edit, and delete food notes.
*/

import { useState, useEffect, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import {
  Heading,
  Stack,
  Flex,
  Button,
  Spinner,
  Center,
  useDisclosure
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import SearchBar from '../../components/SearchBar'
import DishCard from '../../components/DishCard'
import LoginForm from '../../components/LoginForm'
import NewDishModal from '../../components/NewDishModal'
import { useAuthContext } from '../../context/AuthContext'
import type { Dish, NewDish } from '../../types'

export default function Index() {
  const { user } = useAuthContext()
  const utils = trpc.useContext()
  const getAllergens = trpc.useQuery(['allergens.getAllergens'])
  const createDish = trpc.useMutation('dishes.createDish')
  const getDishes = trpc.useQuery(['dishes.getDishes'])
  const updateDish = trpc.useMutation('dishes.updateDish')
  // const deleteDish = trpc.useMutation('dishes.deleteDish')
  const [search, setSearch] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  // const handleDishDelete = useCallback(
  //   async (uid: string) => {
  //     await deleteDish.mutateAsync(
  //       { id: uid },
  //       {
  //         onSuccess: () => {
  //           utils.invalidateQueries(['dishes.getDishes'])
  //         }
  //       }
  //     )
  //   },
  //   [deleteDish, utils]
  // )

  // update the dishes state and also grab the image id for cloudinary
  const handleDishUpdate = async (data: Dish) => {
    await updateDish.mutateAsync(data, {
      onSuccess: () => {
        utils.invalidateQueries(['dishes.getDishes'])
      }
    })
  }

  const handleCreateDish = useCallback(
    async (data: NewDish) => {
      await createDish.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['dishes.getDishes'])
        }
      })
    },
    [createDish, utils]
  )

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  if (!getDishes.data || !getAllergens.data) {
    return (
      <Center paddingTop={16}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <>
      <NewDishModal
        isOpen={isOpen}
        onClose={onClose}
        handleCreateDish={handleCreateDish}
        allergens={getAllergens.data}
        uid={user.id}
      />
      <Stack>
        <Flex justify="space-between">
          <Heading>{'Food Notes'}</Heading>
          <Button
            onClick={onOpen}
            variant="outline"
            leftIcon={<AddIcon />}
            colorScheme="green"
          >
            New Dish
          </Button>
        </Flex>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search by name, component, allergen, or menu"
        />

        {getDishes.data?.map((dish: any) => (
          <DishCard
            key={dish.id}
            dish={dish}
            handleDishUpdate={handleDishUpdate}
          />
        ))}
      </Stack>
    </>
  )
}
