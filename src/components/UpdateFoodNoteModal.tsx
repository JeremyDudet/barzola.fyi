import React, { useEffect, useState, memo, useMemo } from 'react'
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
  Flex,
  useToast
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
import type { UpdateDish } from '../types'

function ImageComponent(props: any) {
  console.log('image component re-rendered')
  return (
    <Image
      src={props.src}
      layout={props.layout}
      width={props.width}
      height={props.height}
      alt={props.alt}
      priority={props.priority}
      placeholder={props.placeholder}
      blurDataURL={props.blurDataURL}
      objectFit={props.objectFit}
    />
  )
}
// prevent un-necessary re-rendering of ImageComponent
const MemoedImageComponent = memo(ImageComponent, (prevProps, nextProps) => {
  return prevProps.src === nextProps.src
})

interface UpdateFoodModalProps {
  isOpen: boolean
  onClose: () => void
  handleDishUpdate: (data: UpdateDish) => Promise<void>
  dish: UpdateDish
  uid: string
  allergens: any
  menus: any
  handleDishDelete: (id: string) => Promise<void>
}

function UpdateFoodNoteModal(props: UpdateFoodModalProps) {
  const toast = useToast()

  const [selectedFile, setSelectedFile] = useState<any | null>() // the image file
  const [name, setName] = useState(props.dish.name)
  const [description, setDescription] = useState(props.dish.description)
  const [advertisedDescription, setAdvertisedDescription] = useState(
    props.dish.advertisedDescription
  )
  // loop through all allergens and set the state to an array of their ids

  const allergenIds = useMemo(
    () => props.dish?.allergens?.map((allergen: any) => allergen.id),
    [props.dish]
  )
  const [allergens, setAllergens] = useState(allergenIds)

  // loop through all menus and set the state to an array of their ids
  const menuIds = useMemo(
    () => props.dish?.menu?.map((menu: any) => menu.id),
    [props.dish]
  )
  const [menus, setMenus] = useState(menuIds)

  const [price, setPrice] = useState(props.dish.price)
  const format = (val: number) => `$` + val
  const [isWritting, setIsWritting] = useState(false)

  useEffect(() => {
    // check if the form has been edited
    if (
      selectedFile ||
      name !== props.dish.name ||
      description !== props.dish.description ||
      advertisedDescription !== props.dish.advertisedDescription ||
      price !== props.dish.price ||
      menus !== menuIds ||
      allergens !== allergenIds
    ) {
      setIsWritting(true) // set isWritting to true if the form has been edited
    } else {
      setIsWritting(false) // set isWritting to false if the form has not been edited
    }
  }, [
    selectedFile,
    name,
    description,
    advertisedDescription,
    price,
    menus,
    allergens,
    props.dish,
    menuIds,
    allergenIds
  ]) // add any dependencies as the second argument

  // reset the form to the original values when the user clicks cancel
  const clearForm = () => {
    setName(props.dish.name)
    setDescription(props.dish.description)
    setAdvertisedDescription(props.dish.advertisedDescription)
    setAllergens(props.dish?.allergens?.map((allergen: any) => allergen.id))
    setMenus(props.dish?.menu?.map((menu: any) => menu.id))
    setPrice(props.dish.price)
    setSelectedFile(null)
    setIsWritting(false)
  }

  // check if the user has edited the dish, and if so, confirm that they want to discard their changes
  const handleClose = () => {
    // if the user has edited the form, ask them if they want to close the modal
    if (isWritting) {
      const confirmClose = confirm(
        'Are you sure you want to close? Your changes will not be saved.'
      )
      if (confirmClose) {
        props.onClose()
        clearForm()
        return
      }
      return
    }
    props.onClose()
  }

  // this function is called when the user selects a file it only works with one file at a time
  const onSelectFile = (e: any) => {
    e.preventDefault()
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0])
  }

  // this function gets called every time the Image component is rendered
  const handleImageDisplay = useMemo(() => {
    // if there is a new image selected, preview it
    // if user has selected an image, display the image
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      return objectUrl
    } else {
      // else, display the image from the database
      return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
    }
  }, [selectedFile, props.dish.imageId])

  // this function is called when the user clicks the submit button
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

  // this function gets called when the user clicks the submit button
  const handleUpdate = async () => {
    try {
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
          menu: formatIntoArrayOfObjects(menus),
          menuSection: props.dish.menuSection,
          lastEditedById: props.uid,
          allergens: formatIntoArrayOfObjects(allergens)
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
          menu: formatIntoArrayOfObjects(menus),
          menuSection: props.dish.menuSection,
          lastEditedById: props.uid,
          allergens: formatIntoArrayOfObjects(allergens)
        }
        props.handleDishUpdate(data).then(() => {
          console.log('Dish updated')
        })
        props.onClose()
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error updating dish',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  // this function gets called when the user clicks the delete button
  const handleDelete = async () => {
    props.handleDishDelete(props.dish.id).then(() => {
      console.log('Dish deleted')
    })
    props.onClose()
    // display a success toast
    toast({
      title: 'Dish Deleted',
      description: 'Your dish has been deleted',
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top'
    })
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

  const ImageParams = useMemo(() => {
    return {
      src: handleImageDisplay,
      alt: 'Dish Image',
      layout: 'responsive',
      width: '400px',
      height: '283.5px',
      priority: true,
      placeholder: 'blur',
      objectFit: 'contain',
      blurDataURL: handleImageDisplay
    }
  }, [handleImageDisplay])

  // take string[] and return array of objects {id: string}
  const formatIntoArrayOfObjects = (ids: any) => {
    return ids.map((id: any) => {
      return { id: id }
    })
  }

  async function handleSubmit(event: any) {
    event.preventDefault()

    // update the dish
    await handleUpdate()

    // reset the form
    clearForm()

    // set isWriting to false after updating the dish
    setIsWritting(false)

    // close the modal
    props.onClose()

    // display a success toast
    toast({
      title: 'Dish Updated',
      description: 'Your dish has been created',
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top'
    })
  }

  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={props.isOpen}
      onClose={handleClose}
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
                <MemoedImageComponent {...ImageParams} />
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
              <FormLabel as="legend">Menus</FormLabel>
              <FormHelperText>{'Please select all that apply'}</FormHelperText>
              <CheckboxGroup value={menus} onChange={value => setMenus(value)}>
                <Flex wrap={'wrap'} gap="4" pt="4">
                  {/* loop through allergens in database */}
                  {props.menus?.map((menu: any) => (
                    <Checkbox key={menu.id} value={menu.id} colorScheme="blue">
                      <Flex gap={1} alignItems="center">
                        {menu.name?.charAt(0).toUpperCase() +
                          menu.name?.slice(1)}
                        {assignIcons[menu.name]}
                      </Flex>
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </FormControl>
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
              <FormLabel as="legend">Descrption</FormLabel>
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
                  {props.allergens?.map((allergen: any) => (
                    <Checkbox
                      key={allergen.id}
                      value={allergen.id}
                      colorScheme="blue"
                    >
                      <Flex gap={1} alignItems="center">
                        {allergen.name?.charAt(0).toUpperCase() +
                          allergen.name?.slice(1)}
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
          <Flex justify="space-between" width="full">
            <Button
              colorScheme={'red'}
              variant="outline"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Box>
              <Button colorScheme="gray" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateFoodNoteModal
