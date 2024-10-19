import { IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsDateString({}, { message: 'Invalid start_date format. Expected format: YYYY-MM-DD' })
  start_date: string;

  @IsDateString({}, { message: 'Invalid end_date format. Expected format: YYYY-MM-DD' })
  end_date: string;
}
