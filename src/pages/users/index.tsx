import { useAuthContext } from '../../context/AuthContext' // import User state
import LoginForm from '../../components/LoginForm'

export default function Index() {
  const { user } = useAuthContext()

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  return <div>Users</div>
}
