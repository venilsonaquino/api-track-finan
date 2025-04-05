import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async signIn(userDTO: SignInDto): Promise<LoginResponseDto> {

    const user = await this.usersService.findEmail(userDTO.email);
    
    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await bcrypt.compare(userDTO.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { 
      id: user.id, 
      email: user.email,
      fullNname: user.fullName, 
      plan: user.plan
    };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName, 
        plan: user.plan,
      },
      expiresIn: 3600
    };
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const new_refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    this.usersService.updateRefreshToken(user.id, new_refresh_token);
    return {
      token,
      refreshToken: new_refresh_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        plan: user.plan,
      },
      expiresIn: 3600
    };
  }
}