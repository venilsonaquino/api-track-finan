import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PayloadResponse } from './dto/login-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: PayloadResponse) {
    return await user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto.refresh_token);
  }
}
