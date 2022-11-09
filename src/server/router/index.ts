// src/server/router/index.ts

// this is the root route
// here we also merge all the other routes

import { createRouter } from './context'
import superjson from 'superjson'
import { usersRouter } from './users'
// import { tasksRouter } from './tasks'
import { juiceRequestsRouter } from './juiceRequests'
import { dishesRouter } from './dishes'
import { allergensRouter } from './allergens'
import { menusRouter } from './menus'


export const appRouter = createRouter() // centralized point for all of our resolvers
  .transformer(superjson)
  .merge("users.", usersRouter) // merge the user router into the app router
  // .merge("tasks.", tasksRouter) // merge the task router into the app router
  .merge("juiceRequests.", juiceRequestsRouter) // merge the juiceRequests router into the app router")
  .merge("dishes.", dishesRouter) // merge the dish router into the app router")
  .merge("menus.", menusRouter) // merge the menu router into the app router")
  .merge("allergens.", allergensRouter) // merge the allergens router into the app router")
// export type definition of API
export type AppRouter = typeof appRouter
