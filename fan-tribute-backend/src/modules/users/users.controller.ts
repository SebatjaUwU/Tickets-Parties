import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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
}
