import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Event } from './entities/event.entity';
import { TicketTier } from '../tickets/entities/ticket-tier.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(TicketTier) private readonly tierRepo: Repository<TicketTier>,
  ) {}

  private mapEvent(e: Event) {
    return {
      ...e,
      startDate: e.date,
      genres: e.genre ? [e.genre] : [],
      gallery: [],
      isFeatured: e.featured,
      isInternational: e.country !== 'Colombia',
      totalCapacity: e.capacity,
      ticketsSold: 0,
      totalRevenue: 0,
      viewsCount: 0,
      likesCount: 0,
      artists: [],
    };
  }

  async findAll(filters?: any) {
    const { search, city, genre, page = 1 } = filters || {};
    const limit = Math.min(+(filters?.limit ?? 10), 100);
    const where: any = { status: 'published' };
    if (city) where.city = ILike(`%${city}%`);
    if (genre) where.genre = ILike(`%${genre}%`);

    const [data, total] = await this.eventRepo.findAndCount({
      where: search ? [{ ...where, title: ILike(`%${search}%`) }, { ...where, city: ILike(`%${search}%`) }] : where,
      order: { date: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return { data: data.map(e => this.mapEvent(e)), total, page: +page, limit: +limit, totalPages, hasNext: +page < totalPages, hasPrev: +page > 1 };
  }

  async getFeatured() {
    const events = await this.eventRepo.find({ where: { featured: true, status: 'published' }, order: { date: 'ASC' }, take: 6 });
    return events.map(e => this.mapEvent(e));
  }

  async getUpcoming() {
    const events = await this.eventRepo.find({ where: { status: 'published' }, order: { date: 'ASC' }, take: 10 });
    return events.map(e => this.mapEvent(e));
  }

  async findBySlug(slug: string) {
    const event = await this.eventRepo.findOne({ where: { slug } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return this.mapEvent(event);
  }

  async getArtists(eventId: string) { return []; }
  async getTicketTiers(eventId: string) {
    return this.tierRepo.find({ where: { eventId, isActive: true }, order: { price: 'ASC' } });
  }
  async getStats(eventId: string, user: any) { return { sold: 0, revenue: 0 }; }

  async create(data: any, userId: string) {
    const slug = await this.generateSlug(data.title);
    const partial: Partial<Event> = { ...data, slug, status: 'draft' };
    const entity = this.eventRepo.create(partial as Event);
    const saved = await this.eventRepo.save(entity);
    return this.mapEvent(saved as Event);
  }

  private async generateSlug(title: string): Promise<string> {
    const base = title
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = base;
    let counter = 1;
    while (await this.eventRepo.findOne({ where: { slug } })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  async update(id: string, data: any, user?: any) {
    await this.eventRepo.update(id, data);
    return this.eventRepo.findOne({ where: { id } });
  }

  async remove(id: string, user?: any) {
    await this.eventRepo.delete(id);
    return { id };
  }

  async publish(id: string, user: any) {
    await this.eventRepo.update(id, { status: 'published' });
    return this.eventRepo.findOne({ where: { id } });
  }

  uploadBanner(id: string, file: any) { return { id, bannerUrl: null }; }
  uploadGallery(id: string, files: any[]) { return { id, gallery: [] }; }
}
