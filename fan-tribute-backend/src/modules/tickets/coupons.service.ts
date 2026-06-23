import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
  ) {}

  async validate(code: string, subtotal: number): Promise<{ coupon: Coupon; discount: number }> {
    const coupon = await this.couponRepo.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) throw new NotFoundException('Cupón no encontrado o inactivo');

    const now = new Date();
    if (now < coupon.validFrom) throw new BadRequestException('El cupón aún no es válido');
    if (coupon.validUntil && now > coupon.validUntil) throw new BadRequestException('El cupón ha expirado');
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('El cupón ha alcanzado su límite de uso');
    }
    if (subtotal < Number(coupon.minPurchase)) {
      throw new BadRequestException(`Compra mínima de $${Number(coupon.minPurchase).toLocaleString('es-CO')} COP requerida`);
    }

    let discount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
      discount = subtotal * (Number(coupon.value) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
    } else {
      discount = Number(coupon.value);
    }
    discount = Math.min(discount, subtotal);

    return { coupon, discount: Math.round(discount) };
  }

  async apply(couponId: string): Promise<void> {
    await this.couponRepo.increment({ id: couponId }, 'usageCount', 1);
  }

  async create(data: Partial<Coupon>): Promise<Coupon> {
    if (data.code) data.code = data.code.toUpperCase();
    return this.couponRepo.save(this.couponRepo.create(data));
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepo.find({ order: { createdAt: 'DESC' } });
  }

  async toggle(id: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOneOrFail({ where: { id } });
    await this.couponRepo.update(id, { isActive: !coupon.isActive });
    return this.couponRepo.findOneOrFail({ where: { id } });
  }
}
