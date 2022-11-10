import UniswapPairProvider from './uniswapPairProvider'

const PAIR_PROVIDER_MAP = {
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f': UniswapPairProvider,
  '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac': UniswapPairProvider,
}

export default function getPairProvider(factory: string) {
  return PAIR_PROVIDER_MAP[factory as keyof typeof PAIR_PROVIDER_MAP]
}
