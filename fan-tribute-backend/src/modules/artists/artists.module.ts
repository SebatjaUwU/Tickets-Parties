import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistsController } from './artists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  controllers: [ArtistsController],
  exports: [TypeOrmModule],
})
export class ArtistsModule {}
