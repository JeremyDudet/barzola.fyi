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


export const juiceRequestsRouter = createRouter()
  .query("getJuiceRequests", {
    async resolve({ ctx }) {
      return await ctx.prisma.juiceRequest.findMany();
    }
  })
  .mutation("createJuiceRequest", {
    // validate input with Zod
    input: z.object({
      requestFromId: z.string(),
      lemonAmount: z.number(),
      orangeAmount: z.number(),
      grapefruitAmount: z.number(),
      notes: z.string().nullable(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.juiceRequest.create({
        data: {
          requestFromId: input.requestFromId,
          lemonAmount: input.lemonAmount,
          orangeAmount: input.orangeAmount,
          grapefruitAmount: input.grapefruitAmount,
          notes: input.notes,
        },
      })
    }
  })
  .mutation("updateJuiceRequest", {
    // validate input with Zod
    input: z.object({
      id: z.string(),
      lemonAmount: z.number(),
      orangeAmount: z.number(),
      grapefruitAmount: z.number(),
      notes: z.string().nullable(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.juiceRequest.update({
        where: {
          id: input.id,
        },
        data: {
          lemonAmount: input.lemonAmount,
          orangeAmount: input.orangeAmount,
          grapefruitAmount: input.grapefruitAmount,
          notes: input.notes,
        },
      })
    }
  })

  .mutation("deleteJuiceRequest", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.juiceRequest.delete({
        where: {
          id: input.id,
        },
      }
      )
    }
  })


  // .mutation("createUser", {
  //   // validate input with Zod
  //   input: z.object({ 
  //     firstName: z.string(), 
  //     lastName: z.string(), 
  //     alias: z.string(), 
  //     password: z.string().max(4), 
  //     auth: z.string()
  //   }),
  //   async resolve({ ctx, input }) {
  //     await ctx.prisma.user.create({
  //       data: {
  //         firstName: input.firstName,
  //         lastName: input.lastName,
  //         alias: input.alias,
  //         password: input.password,
  //         auth: input.auth
  //       },
  //     })    
  //   }
  // })

  // EXAMPLE
  // model JuiceRequest {
  //   id                String   @id @default(cuid())
  //   requestFrom       User     @relation(name: "UserOnRequest", fields: [requestFromId], references: [id])
  //   requestFromId     String
  //   lemonAmount       Float
  //   orangeAmount      Float
  //   grapefruitAmount  Float
  //   notes             String
  //   createdAt         DateTime @default(now())
  //   lastEdited        DateTime @updatedAt
  // }
  