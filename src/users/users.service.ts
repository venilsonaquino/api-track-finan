import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}
  
  async create(createUserDto: CreateUserDto) {

    const {password} = createUserDto

    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;
  
    return this.userModel.create(createUserDto);
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: string) {
    return this.userModel.findOne({where: {id}});
  }

  findEmail(email: string) {
    return this.userModel.findOne({where: {email}});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const {password} = updateUserDto

    const hashedPassword = await bcrypt.hash(password, 10);
    updateUserDto.password = hashedPassword;

    return this.userModel.update(updateUserDto, {
      where: { id } ,
      returning: true
    });
  }

  remove(id: string) {
    return this.userModel.destroy({ where: { id } });
  }

  updateRefreshToken(id: string, refreshToken: string) {
    this.userModel.update(
      { refreshToken },
      { where: { id } }
    );
  }

  findByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ where: { refreshToken } });
  }
}
