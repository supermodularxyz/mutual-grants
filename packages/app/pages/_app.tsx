import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi';
import { wagmiClient, chains } from '../utils/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import ContractsProvider from '../providers/ContractsProvider/ContractProvider'
import { Nav } from '../components';

const mainnetSugraph = new HttpLink({
  uri: "https://gateway.thegraph.com/api/86c0d7accfff88bb2e3da5503af4c2d7/subgraphs/id/BQXTJRLZi7NWGq5AXzQQxvYNa5i1HmqALEJwy3gGJHCr"
})

const goerliSubgraph = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/ghostffcode/grants-manager"
})

const client = new ApolloClient({
  link: ApolloLink.split((operation) => operation.getContext().clientName === '5', goerliSubgraph, mainnetSugraph),
  cache: new InMemoryCache()
})

function MyApp({ Component, pageProps }: AppProps) {
  return (<ApolloProvider client={client}>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContractsProvider>
          <Nav />
          <Component {...pageProps} />
          <ToastContainer />
        </ContractsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </ApolloProvider>)
}

export default MyApp
