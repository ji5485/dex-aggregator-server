import { ethers } from 'ethers'
import Web3WsProvider from 'web3-providers-ws'
import config from 'config'

export const httpProvider = new ethers.providers.JsonRpcProvider(
  config.get<string>('HTTP_NODE_PROVIDER_LINK'),
)

export const websocketProvider = new ethers.providers.Web3Provider(
  new (Web3WsProvider as any)(
    config.get<string>('WEBSOCKET_NODE_PROVIDER_LINK'),
    {
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
      },
      reconnect: {
        auto: true,
        delay: 1000,
        maxAttempts: 5,
        onTimeout: false,
      },
    },
  ),
)
