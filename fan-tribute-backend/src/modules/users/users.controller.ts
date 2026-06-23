import { Controller, Get, Put, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  updateMe(@Request() req: any, @Body() body: any) {
    return this.usersService.update(req.user.id, body);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(+page, +limit, search);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(id, status);
  }
}
