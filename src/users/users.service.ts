import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { generateShortHash } from 'src/common/utils/generate-short-hash';
import { LoggerService } from '../config/logging/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private eventEmitter: EventEmitter2,
    @Inject(LoggerService)
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(
      `Tentativa de criação de usuário com email: ${createUserDto.email}`,
      'UsersService',
    );

    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      this.logger.warn(
        `Tentativa de criar usuário com email já existente: ${email}`,
        'UsersService',
      );
      throw new ConflictException('E-mail is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;

    const user = new UserEntity({
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      password: hashedPassword,
      emailVerificationToken: generateShortHash(),
    });

    const newUser = await this.userModel.create(user);
    this.logger.log(
      `Usuário criado com sucesso. ID: ${newUser.id}`,
      'UsersService',
    );

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(newUser.id, newUser.email, newUser.fullName),
    );

    return newUser;
  }

  async findAll() {
    this.logger.log('Buscando todos os usuários', 'UsersService');
    return await this.userModel.findAll();
  }

  async findOne(id: string) {
    this.logger.log(`Buscando usuário com ID: ${id}`, 'UsersService');
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`Usuário não encontrado. ID: ${id}`, 'UsersService');
      throw new NotFoundException();
    }

    return user;
  }

  async findEmail(email: string) {
    this.logger.log(`Buscando usuário por email: ${email}`, 'UsersService');
    return await this.userModel.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Atualizando usuário com ID: ${id}`, 'UsersService');

    const { password } = updateUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    updateUserDto.password = hashedPassword;

    const [affectedCount, updated] = await this.userModel.update(
      updateUserDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount == 0 && updated.length == 0) {
      this.logger.warn(
        `Tentativa de atualizar usuário não encontrado. ID: ${id}`,
        'UsersService',
      );
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.logger.log(
      `Usuário atualizado com sucesso. ID: ${id}`,
      'UsersService',
    );
    return updated[0];
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo usuário com ID: ${id}`, 'UsersService');
    const deletedCount = await this.userModel.destroy({ where: { id } });

    if (deletedCount === 0) {
      this.logger.warn(
        `Tentativa de remover usuário não encontrado. ID: ${id}`,
        'UsersService',
      );
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`Usuário removido com sucesso. ID: ${id}`, 'UsersService');
    return;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    this.logger.log(
      `Atualizando refresh token para usuário ID: ${id}`,
      'UsersService',
    );
    await this.userModel.update({ refreshToken }, { where: { id } });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
    this.logger.log('Buscando usuário por refresh token', 'UsersService');
    const user = await this.userModel.findOne({ where: { refreshToken } });
    return user;
  }
}
