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


export const dishesRouter = createRouter()
  .query("getDishes", {
    async resolve({ ctx }) {
      return await ctx.prisma.dish.findMany();
    }
  })
  .mutation("deleteDish", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.dish.delete({
        where: {
          id: input.id,
        },
      }
    )
  }
  })
  .mutation("updateDish", {
    // validate input with Zod
    input: z.object({
      id: z.string(), 
      name: z.string(), 
      description: z.string(), 
      advertisedDescription: z.string(), 
      price: z.number(), 
      imageId: z.string(),
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const dish = await ctx.prisma.dish.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          advertisedDescription: input.advertisedDescription,
          price: input.price,
          imageId: input.imageId,
        },
      })
      return dish
    }
  })
  .mutation("updateDishImage", {
    // validate input with Zod
    input: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const dish = await ctx.prisma.dish.update({
        where: {
          id: input.id,
        },
        data: {
          imageId: input.imageId,
        },
      })
      return dish
    }
  })
  .mutation("createDish", {
    // validate input with Zod
    input: z.object({ 
      name: z.string(), 
      description: z.string(), 
      advertisedDescription: z.string(),
      price: z.number(), 
      imageId: z.string(),
      allergens: z.array(z.string()).optional(),
      lastEditedById: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.dish.create({
        data: {
          name: input.name,
          description: input.description,
          advertisedDescription: input.advertisedDescription,
          price: input.price,
          imageId: input.imageId,
          // add the allergens to the dish
          allergens: {
            connect: input.allergens?.map((id) => ({ id })),
          },
          // add the lastEditedBy to the dish
          lastEditedBy: {
            connect: {
              id: input.lastEditedById,
            }
          }
      }})    
    }
  })

