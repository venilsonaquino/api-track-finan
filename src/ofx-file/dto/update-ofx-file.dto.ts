import { PartialType } from '@nestjs/swagger';
import { CreateOfxFileDto } from './create-ofx-file.dto';

export class UpdateOfxFileDto extends PartialType(CreateOfxFileDto) {}
