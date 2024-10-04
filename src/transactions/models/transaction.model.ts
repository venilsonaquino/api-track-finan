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

  @ForeignKey(() => UserModel)
  @Column({
    field: 'user_id',
    type: 'VARCHAR(26)',
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => CategoryModel)
  @Column({
    field: 'category_id',
    type: 'VARCHAR(26)',
    allowNull: true,
  })
  categoryId: string;

  @BelongsTo(() => UserModel)
  user: UserEntity;

  @BelongsTo(() => CategoryModel)
  category: CategoryEntity;
}
