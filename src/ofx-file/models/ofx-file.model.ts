import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ulid } from "ulid";

@Table({
    tableName: "ofx_files"
})
export class OfxFileModel extends Model<OfxFileModel> {
  @PrimaryKey
  @Column({
    type: 'VARCHAR(26)',
    defaultValue: ulid(),
  })
  id: string;

  @Column({
    field: 'user_id',
    type: 'VARCHAR(26)',
  })
  userId: string;

  @Column({
    field: 'file_name',
    type: DataType.STRING,
  })
  fileName: string;

  @Column({
    field: 'file_name',
    type: DataType.DATE,
  })
  uploadDate: string;
}