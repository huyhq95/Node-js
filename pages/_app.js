import { ApolloProvider } from '@apollo/react-hooks';
import { client } from '../client'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} client={client} />
    </ApolloProvider>
  )
}

export default MyApp