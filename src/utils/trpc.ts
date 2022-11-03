// src/utils/trpc.ts

import type { AppRouter } from '../server/router'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureOutput, inferProcedureInput } from '@trpc/server'

// Here we're creating hooks to use tRPC on the client side.
// These hooks are strongly typed using our API type signature.
// This is what enables the end-to-end type safety in our code.
// For example, if we change a router's name in the backend,
// it will show an error in the fontend where we're calling the route.
//

export const trpc = createReactQueryHooks<AppRouter>()

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type inferQueryInput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
