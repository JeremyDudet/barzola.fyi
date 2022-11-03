import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { MutableRefObject } from 'react'

interface Props {
  handleDelete: (uid: string) => void
  id: string
  isOpen: boolean
  onClose: () => void
  cancelRef: MutableRefObject<null>
  actionDescriptor: string
}

export default function AlertDelete({
  handleDelete,
  id,
  isOpen,
  onClose,
  cancelRef,
  actionDescriptor
}: Props) {
  const onDelete = () => {
    handleDelete(id)
    onClose()
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {actionDescriptor}
          </AlertDialogHeader>

          <AlertDialogBody>
            {"Are you sure? You can't undo this action afterwards."}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={onDelete}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
