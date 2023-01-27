import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Ama DApp',
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})