import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  HasMany,
  Is,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import { convertChecksumAddress, isAddress } from '../../utils'
import Pair from './pair.model'

export interface CreateAttributes {
  address: string
  name: string
}

export interface SourceAttributes extends CreateAttributes {
  createdAt: Date
  updatedAt: Date
}

@Table({ timestamps: true, tableName: 'source' })
export default class Source extends Model<SourceAttributes, CreateAttributes> {
  /* Column */

  @PrimaryKey
  @Is(isAddress)
  @Column(DataType.STRING)
  declare address: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string

  /* Relations */

  @HasMany(() => Pair)
  declare pairs: Pair[]

  /* Hooks */

  @BeforeCreate
  @BeforeUpdate
  static convertAddress(instance: Source) {
    instance.address = convertChecksumAddress(instance.address)
  }
}
