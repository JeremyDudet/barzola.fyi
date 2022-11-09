import React, { useEffect, useState } from 'react'
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
  Checkbox,
  CheckboxGroup,
  Flex,
  useToast
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
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
import { BiEdit } from 'react-icons/bi'
import Image from 'next/image'
import type { NewDish, Allergen } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  handleCreateDish: (data: NewDish) => Promise<void>
  // allergens: Allergen[]
  uid: string
  allergens: any
}

function UpdateFoodNoteModal(props: Props) {
  const [selectedFile, setSelectedFile] = useState<any | null>() // the image file
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [advertisedDescription, setAdvertisedDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [allergens, setAllergens] = useState<any>([])
  const format = (val: number) => `$` + val
  const toast = useToast()

  useEffect(() => {
    console.log(allergens)
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

  const removeSelectedImage = () => {
    setSelectedFile(null)
  }

  // if there is a new image selected, preview it
  const handleImageDisplay = () => {
    // if user has selected an image, display the image
    if (selectedFile) {
      const objectUrl: any = URL.createObjectURL(selectedFile)
      return objectUrl
    }
    // else, display the image from the database
    // return `https://res.cloudinary.com/zola-barzola/image/upload/v1665788285/${props.dish.imageId}`
  }

  const handleSubmit = async () => {
    // check if there if all required fields are filled
    if (!name || !advertisedDescription || !price) {
      // alert('Please fill in all required fields')
      toast({
        title: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })

      return
    }
    // if there is a new image selected, upload it to cloudinary
    let imageId = null
    if (selectedFile) {
      imageId = await uploadImage(selectedFile)
    }

    // if there is no image selected, use a placeholder image
    if (!selectedFile) {
      imageId = 'placeholder'
    }

    // if there are no allergies, set allergies to null
    if (allergens && allergens.length === 0) {
      setAllergens(null)
    }

    // create the dish in the database with the image id
    const data = {
      name,
      description,
      advertisedDescription,
      price,
      imageId: imageId,
      allergens: allergens,
      lastEditedById: props.uid
    }
    props.handleCreateDish(data).then(() => {
      console.log('Dish Created')
      // reset the form
      clearForm()
      // close the modal
      props.onClose()
      // display a success toast
      toast({
        title: 'Dish Created',
        description: 'Your dish has been created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    })
    props.onClose()
  }

  const clearForm = () => {
    setName('')
    setDescription('')
    setAdvertisedDescription('')
    setPrice(0)
    setSelectedFile(null)
  }

  const handleClose = () => {
    clearForm()
    props.onClose()
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
    <>
      {console.log(props.uid)}
      <Modal
        blockScrollOnMount={true}
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={{ base: 'full', md: 'xl' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Dish</ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <ModalBody>
            <VStack spacing="25px">
              <FormControl padding="10px" borderRadius={'md'} isRequired>
                <FormLabel>Image</FormLabel>
                <Box
                  marginX={'auto'}
                  display="relative"
                  mb={6}
                  w={'100%'}
                  h="auto"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  {selectedFile ? (
                    <>
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
                      <IconButton
                        aria-label="remove image"
                        borderRadius={'full'}
                        colorScheme={'red'}
                        size="lg"
                        position="absolute"
                        bottom="20px"
                        right="60px"
                        icon={<CloseIcon />}
                        onClick={removeSelectedImage}
                      />
                      <input
                        id="file"
                        style={{ display: 'none' }}
                        type="file"
                        onChange={event =>
                          onSelectFile(
                            event as React.ChangeEvent<HTMLInputElement>
                          )
                        }
                        multiple={false}
                      />
                    </>
                  ) : (
                    <input
                      id="file"
                      type="file"
                      onChange={event =>
                        onSelectFile(
                          event as React.ChangeEvent<HTMLInputElement>
                        )
                      }
                      multiple={false}
                    />
                  )}
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
                  onChange={event =>
                    setAdvertisedDescription(event.target.value)
                  }
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
                <FormHelperText>
                  {'Please select all that apply'}
                </FormHelperText>
                <Flex wrap={'wrap'} gap="4" pt="4">
                  {/* loop through allergens in database */}
                  {props.allergens?.map((allergen: any) => (
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
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outline" colorScheme="blue" onClick={handleSubmit}>
              Publish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateFoodNoteModal
