/* 
  This is the homepage of the website.
  It is the first page that users see when they open the website.
  This will hold a few dashboard for 
*/

import { Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
// import { trpc } from '../utils/trpc'
import { useAuthContext } from '../context/AuthContext' // import User state
import LoginForm from '../components/LoginForm'

// todo
// integrate login check

const Home: NextPage = () => {
  const { user } = useAuthContext()
  // const userQuery = trpc.useQuery(['users.getUsers'])

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  return (
    <>
      <Heading pb={2}>{`Welcome, ${
        user.alias ? user.alias : user.firstName
      }.`}</Heading>
      <Heading size="sm" pb={2}>
        I want to say that this project is still under development.
      </Heading>
      <Text>
        {
          "You'll find a lot of tabs in the menu navigation that currently don't work. I'll be rolling out updates soon."
        }
      </Text>
    </>
  )
}

export default Home
