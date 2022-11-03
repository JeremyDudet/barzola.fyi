/*
  This component is used in the _app.tsx file.
  This component is used to wrap the Layout component.
  This is used to prevent the Layout component from rendering on the server.
  Which causes a hydration mismatch error.

  If you intentionally need to render something different on the server and the clinet,
  you can do a two-pass rendering. 
  However, the tradeoff is that your page will be slower to load.
  Because the server will render the page, then the client will render the page again.
  Rendering the page twice is not ideal.
*/

import React from 'react'
import { Box } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

function ClientOnly({ children, ...delegated }: Props) {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return <div>Loading...</div>
  }
  return <Box {...delegated}>{children}</Box>
}

export default ClientOnly
