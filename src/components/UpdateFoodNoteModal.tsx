import React, { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  IconButton,
  Button,
  Divider,
  CheckboxGroup,
  Checkbox,
  Flex
} from '@chakra-ui/react'
import { BiEdit } from 'react-icons/bi'
import {
  GiPeanut,
  GiSesame,
  GiSewedShell,
  GiMilkCarton,
  GiRawEgg,
  GiFriedFish,
  GiJellyBeans,
  GiWheat,
  GiAlmond,
  GiGarlic
} from 'react-icons/gi'
import Image from 'next/image'
import type { Dish, Allergen } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  handleDishUpdate: (data: Dish) => Promise<void>
  dish: Dish
  uid: string
}

function UpdateFoodNoteModal(props: Props) {
  const [selectedFile, setSelectedFile] = useState<any | null>() // the image file
  const [name, setName] = useState(props.dish.name)
  const [description, setDescription] = useState(props.dish.description)
  const [advertisedDescription, setAdvertisedDescription] = useState(
    props.dish.advertisedDescription
  )
  // loop through all allergens and set the state to an array of their ids
  const [allergens, setAllergens] = useState(
    props.dish?.allergens?.map((allergen: any) => allergen.id)
  )

  const [price, setPrice] = useState(props.dish.price)
  const format = (val: number) => `$` + val
  // grab allergens from database
  const getAllergens = trpc.useQuery(['allergens.getAllergens'])

  // console.log('allergens', allergens) on change
  useEffect(() => {
    console.log('allergens', allergens)
  }, [allergens])

  // this function is called when the user selects a file it only works with one file at a time
  const onSelectFile = (e: any) => {
    e.preventDefault()
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0])
  }

  const uploadImage = async (files: any) => {
    const data: any = new FormData()
    data.append('file', files)
    data.append('api_key', process.env.API_KEY)
    data.append('upload_preset', 'faoqsdvt')
    const cloudinaryResponse = await fetch(
      'https://api.cloudinary.com/v1_1/zola-barzola/auto/upload',
      {
        method: 'POST',
        body: data
      }
    )
    const cloudinaryResponseJson = await cloudinaryResponse.json()
    console.log('cloudinaryResponseJson', cloudinaryResponseJson)
    return cloudinaryResponseJson.public_id
  }

  // if there is a new image selected, preview it
  const handleImageDisplay = () => {
    // if user has selected an image, display the image
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      return objectUrl
    }
    // else, display the image from the database
    return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
  }

  const handleUpdate = async () => {
    if (selectedFile) {
      // if there is a new image selected, upload it to cloudinary
      // upload the image to cloudinary
      const imageid = await uploadImage(selectedFile)
      // update the dish in the database
      const data = {
        id: props.dish.id,
        name,
        description,
        advertisedDescription,
        price,
        imageId: imageid,
        menu: props.dish.menu,
        menuSection: props.dish.menuSection,
        lastEditedById: props.uid,
        allergens: allergens
      }
      props.handleDishUpdate(data).then(() => {
        console.log('Dish updated')
      })
      props.onClose()
    } else {
      console.log('no image selected')
      // update the dish in the database
      const data = {
        id: props.dish.id,
        name,
        description,
        advertisedDescription,
        price,
        imageId: props.dish.imageId,
        menu: props.dish.menu,
        menuSection: props.dish.menuSection,
        lastEditedById: props.uid,
        allergens: allergens
      }
      props.handleDishUpdate(data).then(() => {
        console.log('Dish updated')
      })
      props.onClose()
    }
  }

  const assignIcons: any = {
    allium: <GiGarlic />,
    dairy: <GiMilkCarton />,
    egg: <GiRawEgg />,
    fish: <GiFriedFish />,
    gluten: <GiWheat />,
    peanut: <GiPeanut />,
    sesame: <GiSesame />,
    shellfish: <GiSewedShell />,
    soy: <GiJellyBeans />,
    treenut: <GiAlmond />
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
        <ModalHeader>Update Food Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="25px">
            <FormControl padding="10px" borderRadius={'md'}>
              <Box
                marginX={'auto'}
                display="relative"
                mb={6}
                w={'100%'}
                h="auto"
                borderRadius="lg"
                overflow="hidden"
                boxShadow={'xl'}
              >
                <Image
                  src={handleImageDisplay()}
                  layout="responsive"
                  width="400px"
                  height="283.5px"
                  // fit="cover"
                  // rounded={'md'}
                  // align={'center'}
                  alt={'product image'}
                  quality="100"
                  priority={true}
                  placeholder="blur"
                  blurDataURL={handleImageDisplay()}
                />
                <IconButton
                  colorScheme={'blue'}
                  aria-label="upload new image"
                  icon={<BiEdit />}
                  size="lg"
                  position="absolute"
                  bottom="20px"
                  right="0px"
                  as={'label'}
                  htmlFor="file"
                  boxShadow={'xl'}
                  borderRadius={'full'}
                />
                <input
                  id="file"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={event =>
                    onSelectFile(event as React.ChangeEvent<HTMLInputElement>)
                  }
                  multiple={false}
                />
              </Box>
            </FormControl>
            <Divider />
            <FormControl isRequired>
              <FormLabel as="legend">Name</FormLabel>
              <Input
                placeholder="Name"
                variant="outline"
                onChange={event => setName(event.target.value)}
                value={name}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Price</FormLabel>
              <NumberInput
                variant="outline"
                value={format(price)}
                onChange={value => setPrice(Number(value))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Advertised Description</FormLabel>
              <FormHelperText>
                {`How it reads on the actual menu`}
              </FormHelperText>
              <Textarea
                placeholder="Advertised Description"
                variant="outline"
                onChange={event => setAdvertisedDescription(event.target.value)}
                value={advertisedDescription}
              />
            </FormControl>
            <FormControl>
              <FormLabel as="legend">Description</FormLabel>
              <FormHelperText>
                {`How you would describe it to a customer`}
              </FormHelperText>
              <Textarea
                placeholder="Advertised Description"
                variant="outline"
                onChange={event => setDescription(event.target.value)}
                value={description}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Common Allergens</FormLabel>
              <FormHelperText>{'Please select all that apply'}</FormHelperText>
              <CheckboxGroup
                value={allergens}
                onChange={value => setAllergens(value)}
              >
                <Flex wrap={'wrap'} gap="4" pt="4">
                  {/* loop through allergens in database */}
                  {getAllergens.data?.map((allergen: any) => (
                    <Checkbox
                      key={allergen.id}
                      value={allergen.id}
                      colorScheme="blue"
                    >
                      <Flex gap={1} alignItems="center">
                        {allergen.name.charAt(0).toUpperCase() +
                          allergen.name.slice(1)}
                        {assignIcons[allergen.name]}
                      </Flex>
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={handleUpdate}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateFoodNoteModal
