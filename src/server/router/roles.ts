import { createRouter } from './context'
import { z } from 'zod'

// export const userRouter = createRouter()
//   .query('getAll', {
//     async resolve({ ctx }) {
//       return await ctx.prisma.users.findMany()
//     }
//   })

// just like GraphQl, tRPC uses queries and mutations.
// A query is used for fetching data and mutations are used to
// create, update, or delete data.

// Here we are creating a query to get a user by their id.


export const rolesRouter = createRouter()
  .query("getRoles", {
    async resolve({ ctx }) {
      return await ctx.prisma.role.findMany();
    }
  })


