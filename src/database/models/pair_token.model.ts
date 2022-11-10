import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript'
import Pair from './pair.model'
import Token from './token.model'

@Table({ timestamps: true, tableName: 'pair_token' })
export default class PairToken extends Model {
  @ForeignKey(() => Pair)
  @Column(DataType.STRING)
  declare pairAddress: string

  @ForeignKey(() => Token)
  @Column(DataType.STRING)
  declare tokenAddress: string
}
