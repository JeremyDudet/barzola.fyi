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


export const usersRouter = createRouter()
  .query("getUsers", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    }
  })
  .mutation("deleteUser", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      }
    )
  }
  })
  .mutation("createUser", {
    // validate input with Zod
    input: z.object({ 
      firstName: z.string(), 
      lastName: z.string(), 
      alias: z.string().nullable(), 
      password: z.string().max(4), 
      auth: z.string()
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          alias: input.alias,
          password: input.password,
          auth: input.auth,
        },
      })    
    }
  })
  .mutation("updateUser", {
    input: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      alias: z.string().nullable(),
      password: z.string(),
      auth: z.string() 
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          alias: input.alias,
          password: input.password,
          auth: input.auth
        },
      })
      return user
    }
  })

