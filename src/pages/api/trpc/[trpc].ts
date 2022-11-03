// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'

// Here we implement ouf tRPC router. Our server is deployed
// as a Next.js API routes.

// We're passing it our router, our createContet function, and
// enabling batching and logging errors.

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  batching: {
    enabled: true
  },
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error)
    }
  }
})
