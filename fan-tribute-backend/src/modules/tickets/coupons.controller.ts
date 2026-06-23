import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CouponsService } from './coupons.service';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar un cupón y obtener el descuento' })
  validate(@Body() body: { code: string; subtotal: number }) {
    return this.couponsService.validate(body.code, body.subtotal);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear cupón (admin)' })
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los cupones (admin)' })
  findAll() {
    return this.couponsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch(':id/toggle')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/desactivar cupón (admin)' })
  toggle(@Param('id') id: string) {
    return this.couponsService.toggle(id);
  }
}
