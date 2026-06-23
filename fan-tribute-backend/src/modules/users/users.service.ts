import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findById(id: string) { return this.userRepo.findOneBy({ id }); }
  findByEmail(email: string) { return this.userRepo.findOneBy({ email }); }
  create(data: Partial<User>) { return this.userRepo.save(this.userRepo.create(data as any)); }
  update(id: string, data: Partial<User>) { return this.userRepo.update(id, data as any); }

  async addPoints(userId: string, points: number, type: string, description: string): Promise<void> {
    await this.userRepo.increment({ id: userId }, 'points', points);
  }

  async findAll(page = 1, limit = 50, search?: string) {
    const qb = this.userRepo.createQueryBuilder('u')
      .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.role', 'u.status', 'u.createdAt', 'u.avatarUrl'])
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('(LOWER(u.firstName) LIKE :q OR LOWER(u.lastName) LIKE :q OR LOWER(u.email) LIKE :q)', {
        q: `%${search.toLowerCase()}%`,
      });
    }
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async updateStatus(id: string, status: string) {
    await this.userRepo.update(id, { status: status as any });
    return this.userRepo.findOneBy({ id });
  }
}
