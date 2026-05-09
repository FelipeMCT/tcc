import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('missions')
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Get()
  findAll() {
    return this.missionsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.missionsService.findActive();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(createMissionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    return this.missionsService.update(id, updateMissionDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.missionsService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.missionsService.remove(id);
  }
}
