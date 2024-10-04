import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto.refresh_token);
  }
}
