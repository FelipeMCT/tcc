import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async completeMission(userId: number, missionId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.role !== 'FUNCIONARIO') {
      throw new BadRequestException('Apenas funcionários podem concluir missões.');
    }

    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Missão não encontrada.');
    if (!mission.active) throw new BadRequestException('Missão não está ativa.');

    const existing = await this.prisma.pointTransaction.findFirst({
      where: { userId, missionId },
    });
    if (existing) throw new BadRequestException('Você já concluiu esta missão.');

    const [, updatedUser] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: { userId, missionId, points: mission.points },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { points: { increment: mission.points } },
      }),
    ]);

    return {
      message: 'Missão concluída com sucesso!',
      mission: { id: mission.id, title: mission.title },
      pointsEarned: mission.points,
      totalPoints: updatedUser.points,
    };
  }

  getMyHistory(userId: number) {
    return this.prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        points: true,
        createdAt: true,
        missionId: true,
        mission: {
          select: { title: true, description: true },
        },
      },
    });
  }
}
