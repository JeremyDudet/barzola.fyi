// src/pages/_app.tsx
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '../server/router'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../context/AuthContext'
import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import ClientOnly from '../components/ClientOnly'
import theme from '../lib/theme'
import superjson from 'superjson'
import { AppProps } from 'next/app'
import Head from 'next/head'

// Here we connect our backend to our frontend.
// Here we configure tRPC and React Query.
// We are also setting ssr (Server Side Rendering) to false for now.
// We also wrap our app in Chakra UI and our custom UserProvider.

// todo
// [] fetch users from database
// [] check localstorage for logged in user
// [] if user is not logged in, redirect to login page

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>BarZola</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Fonts />
      <AuthProvider>
        <ClientOnly>
          <Layout router={router}>
            <Component {...pageProps} key={router.route} />
          </Layout>
        </ClientOnly>
      </AuthProvider>
    </ChakraProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false
})(MyApp)
