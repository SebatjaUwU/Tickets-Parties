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
}
