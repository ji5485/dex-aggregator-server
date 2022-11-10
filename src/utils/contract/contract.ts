import { ContractInterface, ethers, utils } from 'ethers'
import TOKEN_ABI from '../abi/token.json'
import { httpProvider } from './provider'

export const isAddress = (address: string) => utils.isAddress(address)

export const convertChecksumAddress = (address: string) =>
  utils.getAddress(address)

export const convertFromWei = (value: string, decimal: number): string => {
  return utils.formatUnits(value, decimal)
}

export const convertToWei = (value: string, decimal: number): string => {
  return utils.parseUnits(value, decimal).toString()
}

export const createTokenContract = (address: string) =>
  new ethers.Contract(address, TOKEN_ABI as ContractInterface, httpProvider)

export const getBlockNumber = () => httpProvider.getBlockNumber()

export const getTokenInfo = async (address: string) => {
  const contract = createTokenContract(address)

  const [symbol, name, decimal] = await Promise.all([
    contract.functions.symbol(),
    contract.functions.name(),
    contract.functions.decimals(),
  ]).then(result => result.map(data => data[0]))

  return { address: convertChecksumAddress(address), symbol, name, decimal }
}
