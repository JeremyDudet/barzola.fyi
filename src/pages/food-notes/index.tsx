/*
  This page is the main page for the food notes.
  Here authorized users can add, edit, and delete food notes.
*/

import { useState, useCallback, useEffect } from 'react'
import { trpc } from '../../utils/trpc'
import {
  Heading,
  Stack,
  Flex,
  Button,
  Spinner,
  Center,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  CheckboxGroup,
  Checkbox,
  Text
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import SearchBar from '../../components/SearchBar'
import DishCard from '../../components/DishCard'
import LoginForm from '../../components/LoginForm'
import NewDishModal from '../../components/NewDishModal'
import { useAuthContext } from '../../context/AuthContext'
import type { Dish, Menu, NewDish, UpdateDish } from '../../types'

const FilterAccordion = (props: any) => {
  const menuIds: string[] = []
  props.menus.forEach((menu: Menu) => menuIds.push(menu.id))

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Filters
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box>
            <Heading size="xs">Filter By Menu</Heading>
          </Box>
          <CheckboxGroup
            defaultValue={menuIds}
            onChange={value => props.setFilteredMenus(value)}
          >
            <Flex gap="12px" wrap="wrap">
              {props.menus.map((menu: any) => (
                <Checkbox
                  textTransform="capitalize"
                  key={menu.id}
                  value={menu.id}
                  isChecked={props.filteredMenus?.includes(menu.id)}
                >
                  {menu.name}
                </Checkbox>
              ))}
            </Flex>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const MenuSection = (props: any) => {
  return <Heading>{props.name}</Heading>
}

export default function Index() {
  const { user } = useAuthContext()
  const utils = trpc.useContext()
  const getFoodMenus = trpc.useQuery(['menus.getFoodMenus']) // grab all the menus that are of menuType 'food'
  const getAllergens = trpc.useQuery(['allergens.getAllergens'])
  const createDish = trpc.useMutation('dishes.createDish')
  const getActiveDishes = trpc.useQuery(['dishes.getActiveDishes'])
  const updateDish = trpc.useMutation('dishes.updateDish')
  const deleteDish = trpc.useMutation('dishes.deleteDish')

  const allergens = getAllergens.data // grab all the allergens

  const [search, setSearch] = useState<string>('')
  const [filteredMenuIds, setFilteredMenuIds] = useState<string[]>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // when food menus are loaded, set all of them to filteredMenus
    const menuIds: string[] = []
    getFoodMenus.data?.forEach((menu: any) => menuIds.push(menu.id))
    setFilteredMenuIds(menuIds)
  }, [getFoodMenus.data])

  const handleDishDelete = useCallback(
    async (uid: string) => {
      await deleteDish.mutateAsync(
        { id: uid },
        {
          onSuccess: () => {
            getActiveDishes.refetch()
          }
        }
      )
    },
    [deleteDish, getActiveDishes]
  )

  // update the dishes state and also grab the image id for cloudinary
  const handleDishUpdate = useCallback(
    async (data: UpdateDish) => {
      await updateDish.mutateAsync(data, {
        onSuccess: () => {
          getActiveDishes.refetch()
        }
      })
    },
    [updateDish, getActiveDishes]
  )

  const handleCreateDish = useCallback(
    async (data: NewDish) => {
      await createDish.mutateAsync(data, {
        onSuccess: () => {
          getActiveDishes.refetch()
        }
      })
    },
    [createDish, getActiveDishes]
  )

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  if (!getFoodMenus.data || !getActiveDishes.data || !allergens) {
    return (
      <Center paddingTop={16}>
        <Spinner size="xl" />
      </Center>
    )
  }

  // grab all the dishes that belong to a specific menu
  function grabFilteredDishes(menuId: any) {
    const filteredDishesByMenu: Dish[] = [] // array of dishes that are in the assigned menu section
    // loop through all the active dishes
    getActiveDishes.data?.forEach((dish: any) => {
      // loop through all the menus in each dish
      dish.menu?.forEach((menu: Menu) => {
        // if the dish is in the menu, push it to the filtered dishes array
        if (menu.id === menuId) {
          filteredDishesByMenu.push(dish)
        }
      })
    })
    return filteredDishesByMenu
  }

  // grab a menu's name from the menu id
  function grabMenuName(menuId: string) {
    let menuName = ''
    getFoodMenus.data?.forEach((menu: any) => {
      if (menu.id === menuId) {
        menuName = menu.name
      }
    })
    return menuName
  }

  return (
    <>
      <NewDishModal
        isOpen={isOpen}
        onClose={onClose}
        handleCreateDish={handleCreateDish}
        uid={user.id}
        allergens={allergens}
        menus={getFoodMenus.data}
      />
      <Stack>
        <Flex justify="space-between">
          <Heading>{'Food Notes'}</Heading>
          <Button
            onClick={onOpen}
            variant="outline"
            leftIcon={<AddIcon />}
            colorScheme="green"
            style={{
              display: `${
                user.auth === 'admin' || user.auth === 'kitchen' ? '' : 'none'
              }`
            }}
          >
            New Dish
          </Button>
        </Flex>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search by name, component, allergen, or menu"
        />
        <FilterAccordion
          menus={getFoodMenus.data}
          setFilteredMenus={setFilteredMenuIds}
          filteredMenus={filteredMenuIds}
        />
        <Stack spacing={8} pt={4}>
          {filteredMenuIds?.map(id => (
            <Box key={id}>
              <Heading>{grabMenuName(id)}</Heading>
              <Stack spacing={4}>
                {grabFilteredDishes(id).length > 0 ? (
                  grabFilteredDishes(id).map((dish: any) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      handleDishUpdate={handleDishUpdate}
                      userAuth={user.auth}
                      allergens={allergens}
                      menus={getFoodMenus.data}
                      uid={user.id}
                      handleDishDelete={handleDishDelete}
                    />
                  ))
                ) : (
                  <Text>No dishes in this menu</Text>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </>
  )
}
