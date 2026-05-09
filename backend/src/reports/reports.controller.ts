import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('manager-summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  getManagerSummary() {
    return this.reportsService.getManagerSummary();
  }
}
