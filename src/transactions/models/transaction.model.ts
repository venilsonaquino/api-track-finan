import { Table, Column, Model, DataType, PrimaryKey, BeforeCreate, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { CategoryModel } from 'src/categories/models/category.model';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserModel } from 'src/users/models/user.model';
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
    field: 'diposted_date',
    type: DataType.DATE,
    allowNull: false,
  })
  dipostedDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    field: 'tranfer_type',
    type: DataType.STRING,
    allowNull: false,
  })
  tranferType: string;

  @Column({
    field: 'transaction_amount',
    type: DataType.FLOAT,
    allowNull: false,
  })
  transactionAmount: number;

  @Column({
    field: 'fit_id',
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  fitId: string;

  @Column({
    field: 'balance_after',
    type: DataType.FLOAT,
    allowNull: true,
  })
  balanceAfter: number;

  @Column({
    field: 'is_recurring',
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isRecurring: boolean;

  @Column({
    field: 'recurring_months',
    type: DataType.INTEGER,
    allowNull: true,
  })
  recurringMonths: number;

  @ForeignKey(() => UserModel)
  @Column({
    field: 'user_id',
    type: DataType.STRING(26),
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => CategoryModel)
  @Column({
    field: 'category_id',
    type: DataType.STRING(26),
    allowNull: true,
  })
  categoryId: string;

  @BelongsTo(() => UserModel)
  user: UserEntity;

  @BelongsTo(() => CategoryModel)
  category: CategoryEntity;
}
