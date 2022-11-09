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


export const menusRouter = createRouter()
// query to get all menus and their dishes
    .query("getMenus", {
        async resolve({ ctx }) {
            return await ctx.prisma.menu.findMany({
                include: {
                    dishes: true,
                    menuSections: true,
                }
            });
        }
    })
// get all menus of type food
    .query("getFoodMenus", {
        async resolve({ ctx }) {
            return await ctx.prisma.menu.findMany({
                where: {
                    menuType: "food"
                },
                include: {
                    dishes: true,
                    menuSections: true,
                }
            });
        }
    })
// create a new menu
    .mutation("createMenu", {
        // validate input with Zod
        input: z.object({
            name: z.string(),
        }),
        async resolve({ ctx, input }) {
            // create a new menu in the database
            const menu = await ctx.prisma.menu.create({
                data: {
                    name: input.name,
                },
            })
            return menu
        }
    })
// delete a menu
    .mutation("deleteMenu", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.menu.delete({
                where: {
                    id: input.id,
                },
            }
            )
        }
    })
// // update a menu
//     .mutation("updateMenu", {
//         // validate input with Zod
//         input: z.object({
//             id: z.string(),
//             name: z.string(),
//             description: z.string(),
//             imageId: z.string(),
//         }),
//         async resolve({ ctx, input }) {
//             await ctx.prisma.menu.update({
//                 where: {
//                     id: input.id,
//                 },
//                 data: {
//                     name: input.name,
//                     description: input.description,
//                     imageId: input.imageId,
//                 },
//             })
//         }
//     })
    