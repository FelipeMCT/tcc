import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('activity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  async recordActivity(@CurrentUser() user: { id: number }) {
    const updated = await this.usersService.updateUserStreak(user.id);
    return {
      currentStreak: updated?.currentStreak ?? 0,
      longestStreak: updated?.longestStreak ?? 0,
      lastActivityDate: updated?.lastActivityDate ?? null,
    };
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}
