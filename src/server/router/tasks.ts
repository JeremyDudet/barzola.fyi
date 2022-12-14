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


export const tasksRouter = createRouter()
  .query("getTasks", {
    async resolve({ ctx }) {
      return await ctx.prisma.task.findMany({
        include: {
          doTime: true,
          role: true,
        }
      });
    }
  })
  .mutation("createTask", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      doTimeId: z.string(),
      roleId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.task.create({
        data: {
          name: input.name,
          description: input.description,
          doTime: {
            connect: {
              id: input.doTimeId,
            },
          },
          role: {
            connect: {
              id: input.roleId,
            }
          },
        },
      });
    },
  })
  