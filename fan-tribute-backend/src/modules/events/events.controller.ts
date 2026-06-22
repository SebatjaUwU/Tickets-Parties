import {
  Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards,
  UploadedFile, UploadedFiles, UseInterceptors, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar eventos con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() filters: EventFiltersDto) {
    return this.eventsService.findAll(filters);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Obtener eventos destacados' })
  getFeatured() {
    return this.eventsService.getFeatured();
  }

  @Public()
  @Get('upcoming')
  @ApiOperation({ summary: 'Próximos eventos' })
  getUpcoming() {
    return this.eventsService.getUpcoming();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Detalle de evento por slug' })
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Public()
  @Get(':id/artists')
  getArtists(@Param('id') id: string) {
    return this.eventsService.getArtists(id);
  }

  @Public()
  @Get(':id/tickets')
  getTicketTiers(@Param('id') id: string) {
    return this.eventsService.getTicketTiers(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Get(':id/stats')
  @ApiBearerAuth()
  getStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.getStats(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo evento' })
  create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Put(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateEventDto, @CurrentUser() user: any) {
    return this.eventsService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Patch(':id/publish')
  @ApiBearerAuth()
  publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.publish(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Post(':id/banner')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  uploadBanner(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.eventsService.uploadBanner(id, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'super_admin')
  @Post(':id/gallery')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiBearerAuth()
  uploadGallery(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.eventsService.uploadGallery(id, files);
  }
}
