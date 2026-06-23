import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { Public } from '../../common/decorators/public.decorator';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectRepository(Artist) private readonly artistRepo: Repository<Artist>,
  ) {}

  private mapArtist(a: Artist) {
    return {
      id: a.id,
      name: a.name,
      slug: a.slug ?? a.name.toLowerCase().replace(/\s+/g, '-'),
      bio: a.bio,
      avatarUrl: a.imageUrl,
      country: a.country,
      genres: a.genre ? [a.genre] : [],
      followersCount: Number(a.followers),
      ranking: a.rank,
      isFeatured: a.rank <= 5,
      isActive: a.isActive,
      socialLinks: {
        spotify: a.spotifyUrl ?? null,
        instagram: a.instagramUrl ?? null,
      },
      famousSongs: [],
      createdAt: a.createdAt,
    };
  }

  @Public()
  @Get()
  async findAll(@Query('limit') limit = 20) {
    const artists = await this.artistRepo.find({
      where: { isActive: true },
      order: { rank: 'ASC' },
      take: +limit,
    });
    return artists.map(a => this.mapArtist(a));
  }

  @Public()
  @Get('top20')
  async getTop20() {
    const artists = await this.artistRepo.find({
      where: { isActive: true },
      order: { rank: 'ASC' },
      take: 20,
    });
    return artists.map(a => this.mapArtist(a));
  }
}
