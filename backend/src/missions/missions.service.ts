import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.mission.findMany();
  }

  findActive() {
    return this.prisma.mission.findMany({ where: { active: true } });
  }

  create(dto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        title: dto.title,
        description: dto.description,
        points: dto.points,
        active: dto.active ?? true,
      },
    });
  }

  async update(id: number, dto: UpdateMissionDto) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Missão não encontrada.');

    return this.prisma.mission.update({
      where: { id },
      data: dto,
    });
  }

  async toggleActive(id: number) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Missão não encontrada.');

    return this.prisma.mission.update({
      where: { id },
      data: { active: !mission.active },
    });
  }

  async remove(id: number) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Missão não encontrada.');

    await this.prisma.$transaction([
      this.prisma.pointTransaction.deleteMany({ where: { missionId: id } }),
      this.prisma.mission.delete({ where: { id } }),
    ]);

    return { message: 'Missão excluída com sucesso.' };
  }
}
