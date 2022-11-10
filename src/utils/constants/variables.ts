import { Token } from '@hi-protocol/router-sdk'

export const BASE_TOKENS = {
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
  },
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
  },
}

export const BASE_TOKENS_ADDRESS = Object.values(BASE_TOKENS).map(
  ({ address }) => address,
)

export const BASE_TOKENS_INSTANCE = Object.values(BASE_TOKENS).reduce<{
  [key: string]: Token
}>((instances, { address, decimals }) => {
  instances[address] = new Token(address, decimals)
  return instances
}, {})

export const CONTRACT_ADDRESS = {
  multicall: '0xda3c19c6fe954576707fa24695efb830d9cca1ca',
  oracle: '0x07d91f5fb9bf7798734c3f606db065549f6893bb',
}

export const CACHE_KEY = {
  allPairs: 'allPairs',
  baseContainedPairs: 'baseContainedPairs',
  baseTokenPrice: 'baseTokenPrice',
  convertedBaseContainedPairs: 'convertedBaseContainedPairs',
}
