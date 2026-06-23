import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get('posts/featured')
  @ApiOperation({ summary: 'Obtener posts destacados' })
  getFeatured() {
    return this.blogService.getFeatured();
  }

  @Public()
  @Get('posts')
  @ApiOperation({ summary: 'Listar todos los posts' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 9) {
    return this.blogService.findAll(+page, +limit);
  }

  @Public()
  @Get('posts/:slug')
  @ApiOperation({ summary: 'Obtener post por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}
