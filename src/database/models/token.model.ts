import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  DataType,
  Is,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { convertChecksumAddress, isAddress } from '../../utils'
import Pair from './pair.model'
import PairToken from './pair_token.model'

export interface CreateAttributes {
  address: string
  symbol: string
  name: string
  decimal: number
}

export interface TokenAttributes extends CreateAttributes {
  createdAt: Date
  updatedAt: Date
}

@Table({ timestamps: true, tableName: 'token' })
export default class Token extends Model<TokenAttributes, CreateAttributes> {
  /* Column */

  @PrimaryKey
  @Is(isAddress)
  @Column(DataType.STRING)
  declare address: string

  @AllowNull(false)
  @Column(DataType.STRING)
  declare symbol: string

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare decimal: number

  /* Relations */

  @BelongsToMany(() => Pair, () => PairToken)
  declare pairs: Pair[]

  /* Hooks */

  @BeforeCreate
  @BeforeUpdate
  static convertAddress(instance: Token) {
    instance.address = convertChecksumAddress(instance.address)
  }
}
