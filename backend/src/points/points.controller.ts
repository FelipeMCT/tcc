import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  @Get('my-history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  getMyHistory(@CurrentUser() user: { id: number }) {
    return this.pointsService.getMyHistory(user.id);
  }

  @Post('complete-mission/:missionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  completeMission(
    @CurrentUser() user: { id: number },
    @Param('missionId', ParseIntPipe) missionId: number,
  ) {
    return this.pointsService.completeMission(user.id, missionId);
  }
}
