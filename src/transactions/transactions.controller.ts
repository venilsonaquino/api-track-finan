import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PayloadResponse } from 'src/auth/dto/login-response.dto';
import { DateRangeDto } from './dto/date-range.dto';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const { user } = req;
    return await this.transactionsService.create(createTransactionDto, user.id);
  }

  @Post('create-batch')
  async createMany(
    @Body() createTransactionDto: CreateTransactionDto[],
    @Request() req,
  ) {
    const { user } = req;
    return await this.transactionsService.createMany(
      createTransactionDto,
      user.id,
    );
  }

  @Get()
  async findAll(
    @CurrentUser() user: PayloadResponse,
    @Query() query: DateRangeDto,
  ) {
    const { id } = user;
    return await this.transactionsService.findAllAndDateRange(id, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const { user } = req;
    return await this.transactionsService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    const { user } = req;
    return await this.transactionsService.update(
      id,
      updateTransactionDto,
      user.id,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const { user } = req;
    return await this.transactionsService.remove(id, user.id);
  }
}
