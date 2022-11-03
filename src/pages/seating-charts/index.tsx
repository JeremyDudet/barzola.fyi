import React from 'react'
import LoginForm from '../../components/LoginForm'
import Image from 'next/image'
import { Box, Heading } from '@chakra-ui/react'
import { useAuthContext } from '../../context/AuthContext' // import User state
import dinning_room_map from '../../../images/dinning-room-map.png'
import bar_map from '../../../images/bar-map.png'
import outdoor_map from '../../../images/outdoor-map.png'

// todo
// [] save images to database

export default function Index() {
  const { user } = useAuthContext()

  if (!user.firstName) return <LoginForm />

  return (
    <Box display="flex" flexDirection="column" mt={10} gap="2rem">
      <Box>
        <Heading>Bar and Lounge</Heading>
        <Image layout="responsive" src={bar_map} alt="dinning room map" />
      </Box>
      <Box>
        <Heading>Dinning Room</Heading>
        <Image
          layout="responsive"
          src={dinning_room_map}
          alt="dinning room map"
        />
      </Box>
      <Box>
        <Heading>Outdoors</Heading>
        <Image layout="responsive" src={outdoor_map} alt="dinning room map" />
      </Box>
    </Box>
  )
}
