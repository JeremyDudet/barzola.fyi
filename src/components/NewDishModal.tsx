import React from 'react'
import { Flex } from '@chakra-ui/react'
import { NewDish } from '../types'

interface Props {
  handleCreateDish: (data: NewDish) => Promise<void>
  isOpen: boolean
  onClose: () => void
}

export default function Index(props: Props) {
  return <Flex>New Dish Modal</Flex>
}
