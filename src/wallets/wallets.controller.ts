import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @CurrentUser() user) {
    return this.walletsService.create(createWalletDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user) {
    return this.walletsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string,  @CurrentUser() user) {
    return this.walletsService.findOne(id, user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto, @CurrentUser() user) {
    return this.walletsService.update(id, updateWalletDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.walletsService.remove(id, user.id);
  }
}
