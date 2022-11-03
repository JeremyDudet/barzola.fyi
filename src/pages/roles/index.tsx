import React from 'react'
import { useAuthContext } from '../../context/AuthContext' // import User state
import LoginForm from '../../components/LoginForm'

function Index() {
  const { user } = useAuthContext()

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  return <div>Roles Info</div>
}

export default Index
