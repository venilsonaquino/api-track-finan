import { Table, Column, Model, DataType, PrimaryKey, BeforeCreate } from 'sequelize-typescript';
import { ulid } from 'ulid';

@Table({
  tableName: 'transactions',
})
export class TransactionModel extends Model<TransactionModel> {
  
  @PrimaryKey
  @Column({
    type: DataType.STRING(26),
    defaultValue: ulid(),
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  balanceAfter: number;

  @Column({
    field: 'user_id',
    type: 'VARCHAR(26)',
    allowNull: false,
  })
  userId: string;

  @Column({
    field: 'category_id',
    type: 'VARCHAR(26)',
    allowNull: true,
  })
  categoryId: string;
}
