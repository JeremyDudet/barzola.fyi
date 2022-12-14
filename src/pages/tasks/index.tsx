// /*
//   This page is where we'll have all the tasks laid out.
//   If you are an admin, there will be a link to a task/admin page
//   where you can create, update or delete tasks.

//   If you are a user, you will be able to see all the tasks
//   and you can mark them as done or not done.

//   Users can view tasks by role.

//   Tasks will be sorted by increasing priority.
//   Priorities are defined by the admin.
//     Priorities: {
//       0: 'Pre-Opening',
//       1: 'Service / Ongoing',
//       2: 'Pre-Closing',
//       3: 'Closing'
//     }
// */

// import React from 'react'
// import LoginForm from '../../components/LoginForm'
// import { useAuthContext } from '../../context/AuthContext'
// import { trpc } from '../../utils/trpc'
// import {
//   Text,
//   Select,
//   Box,
//   Heading,
//   Flex,
//   Checkbox,
//   IconButton,
//   Divider
// } from '@chakra-ui/react'
// import { AddIcon } from '@chakra-ui/icons'

// function TaskItem({ task }) {
//   return (
//     <Box flex="1" textAlign="left" fontSize="1.1rem">
//       {task.name}
//     </Box>
//   )
// }

// function Index() {
//   const getTasks = trpc.useQuery(['tasks.getTasks'])
//   const { user } = useAuthContext()

//   // const sortByPriority = tasks => {
//   //   const sortedTasks = tasks.sort((a, b) => {
//   //     return a.priority - b.priority
//   //   })
//   //   return sortedTasks
//   // }

//   if (!user.firstName) return <LoginForm />
//   return (
//     <Box maxW="container.md">
//       <Heading>Tasks</Heading>
//       <Flex alignItems="center" gap="10px">
//         <Text minW="fit-content">Select role:</Text>
//         <Select w="400px">
//           <option value="all">Opening - Server</option>
//           <option value="all">Opening - Backserver</option>
//           <option value="all">Opening - Host</option>
//           <option value="all">Opening - Barback</option>
//           <option value="all">Opening - Bartender</option>
//           <option value="" disabled>
//             ------------------------
//           </option>
//           <option value="all">Closing - Server</option>
//           <option value="all">Closing - Backserver</option>
//           <option value="all">Closing - Host</option>
//           <option value="all">Closing - Barback</option>
//           <option value="all">Closing - Bartender</option>
//         </Select>
//       </Flex>
//       {getTasks.data &&
//         getTasks.data.map(task => {
//           return (
//             <>
//               <Flex
//                 key={task.id}
//                 gap="2"
//                 py={2}
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Box w="89%">
//                   <Checkbox size="lg">
//                     <TaskItem task={task} />
//                   </Checkbox>
//                 </Box>
//                 <IconButton
//                   variant="ghost"
//                   aria-label="more information"
//                   icon={<AddIcon />}
//                   size="sm"
//                 />
//               </Flex>
//               <Divider />
//             </>
//           )
//         })}
//     </Box>
//   )
// }

import { useAuthContext } from '../../context/AuthContext' // import User state
import LoginForm from '../../components/LoginForm'
import { trpc } from '../../utils/trpc'
import {
  Box,
  Heading,
  Flex,
  Text,
  Select,
  Divider,
  Checkbox,
  IconButton,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import NewTaskModal from '../../components/NewTaskModal'

export default function Index() {
  const { user } = useAuthContext()
  const getTasks = trpc.useQuery(['tasks.getTasks'])
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  function TaskItem({ task }: { task: any }) {
    return (
      <Box flex="1" textAlign="left" fontSize="1.1rem">
        {task.name}
      </Box>
    )
  }

  return (
    <>
      <NewTaskModal isOpen={isOpen} onClose={onClose} />
      <Box maxW="container.md">
        <Flex justify="space-between">
          <Heading>{'Tasks'}</Heading>
          <Button
            onClick={onOpen}
            variant="outline"
            leftIcon={<AddIcon />}
            colorScheme="green"
            style={{
              display: `${user.auth === 'admin' ? '' : 'none'}`
            }}
          >
            New Task
          </Button>
        </Flex>
        <Flex alignItems="center" gap="10px">
          <Text minW="fit-content">Select role:</Text>
          <Select w="400px">
            <option value="all">Opening - Server</option>
            <option value="all">Opening - Backserver</option>
            <option value="all">Opening - Host</option>
            <option value="all">Opening - Barback</option>
            <option value="all">Opening - Bartender</option>
            <option value="" disabled>
              ------------------------
            </option>
            <option value="all">Closing - Server</option>
            <option value="all">Closing - Backserver</option>
            <option value="all">Closing - Host</option>
            <option value="all">Closing - Barback</option>
            <option value="all">Closing - Bartender</option>
          </Select>
        </Flex>
        <div>tasks</div>
      </Box>
    </>
  )
}
