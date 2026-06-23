import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost) private readonly postRepo: Repository<BlogPost>,
  ) {}

  async getFeatured(): Promise<BlogPost[]> {
    return this.postRepo.find({
      where: { isFeatured: true, status: 'published' },
      order: { publishedAt: 'DESC' },
      take: 3,
    });
  }

  async findAll(page = 1, limit = 9): Promise<any> {
    const [data, total] = await this.postRepo.findAndCount({
      where: { status: 'published' },
      order: { publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.postRepo.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Artículo no encontrado');
    await this.postRepo.increment({ id: post.id }, 'viewsCount', 1);
    return post;
  }
}
