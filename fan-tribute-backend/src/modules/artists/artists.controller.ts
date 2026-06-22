import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectRepository(Artist) private readonly artistRepo: Repository<Artist>,
  ) {}

  @Get()
  findAll(@Query('limit') limit = 20) {
    return this.artistRepo.find({
      where: { isActive: true },
      order: { rank: 'ASC' },
      take: +limit,
    });
  }

  @Get('top20')
  getTop20() {
    return this.artistRepo.find({
      where: { isActive: true },
      order: { rank: 'ASC' },
      take: 20,
    });
  }
}
