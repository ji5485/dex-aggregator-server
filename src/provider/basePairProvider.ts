/* eslint-disable no-unused-vars */

import { Contract, ContractInterface, ethers } from 'ethers'
import { PAIR_ABI, httpProvider } from '../utils'

export default abstract class BasePairProvider {
  public address: string
  public contract: Contract

  constructor(address: string) {
    this.address = address
    this.contract = new ethers.Contract(
      address,
      PAIR_ABI as unknown as ContractInterface,
      httpProvider,
    )
  }

  public abstract getTokens(address: string): Promise<[string, string]>
}
