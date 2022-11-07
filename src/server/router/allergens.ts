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


export const allergensRouter = createRouter()
  .query("getAllergens", {
    async resolve({ ctx }) {
      return await ctx.prisma.allergen.findMany();
    }
  })
  // create a new allergen
  .mutation("createAllergen", {
    // validate input with Zod
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      // create a new allergen in the database
      const allergen = await ctx.prisma.allergen.create({
        data: {
          name: input.name,
        },
      })
      return allergen
    }
  })
  // delete an allergen
  .mutation("deleteAllergen", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.allergen.delete({
        where: {
          id: input.id,
        },
      }
    )
  }
  })
  // update an allergen
  .mutation("updateAllergen", {
    // validate input with Zod
    input: z.object({
      id: z.string(),
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const allergen = await ctx.prisma.allergen.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
      return allergen
    }
  })
  