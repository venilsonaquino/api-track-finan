import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto copy';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
