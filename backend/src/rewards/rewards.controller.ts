import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rewards')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  findActive() {
    return this.rewardsService.findActive();
  }

  @Get('my-redemptions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  getMyRedemptions(@CurrentUser() user: { id: number }) {
    return this.rewardsService.getMyRedemptions(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRewardDto) {
    return this.rewardsService.update(id, dto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.rewardsService.toggleActive(id);
  }

  @Post(':id/redeem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  redeem(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) rewardId: number,
  ) {
    return this.rewardsService.redeem(user.id, rewardId);
  }
}
