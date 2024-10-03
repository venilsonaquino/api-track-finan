import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfxFileService } from './ofx-file.service';
import { CreateOfxFileDto } from './dto/create-ofx-file.dto';
import { UpdateOfxFileDto } from './dto/update-ofx-file.dto';

@Controller('ofx-file')
export class OfxFileController {
  constructor(private readonly ofxFileService: OfxFileService) {}

  @Post()
  create(@Body() createOfxFileDto: CreateOfxFileDto) {
    return this.ofxFileService.create(createOfxFileDto);
  }

  @Get()
  findAll() {
    return this.ofxFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofxFileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfxFileDto: UpdateOfxFileDto) {
    return this.ofxFileService.update(id, updateOfxFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofxFileService.remove(id);
  }
}
