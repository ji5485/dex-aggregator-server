import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Is,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Source from './source.model'
import Token from './token.model'
import PairToken from './pair_token.model'
import { convertChecksumAddress, isAddress } from '../../utils'

export interface CreateAttributes {
  address: string
  factory: string
}

export interface PairAttributes extends CreateAttributes {
  createdAt: Date
  updatedAt: Date
}

@Table({ timestamps: true, tableName: 'pair' })
export default class Pair extends Model<PairAttributes, CreateAttributes> {
  /* Column */

  @PrimaryKey
  @Is(isAddress)
  @Column(DataType.STRING)
  declare address: string

  @ForeignKey(() => Source)
  @Column(DataType.STRING)
  declare factory: Source

  /* Relation */

  @BelongsTo(() => Source)
  declare source: Source

  @BelongsToMany(() => Token, () => PairToken)
  declare tokens: Token[]

  /* Hooks */

  @BeforeCreate
  @BeforeUpdate
  static convertAddress(instance: Pair) {
    instance.address = convertChecksumAddress(instance.address)
  }
}
