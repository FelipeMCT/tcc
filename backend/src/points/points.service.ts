import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MissionType } from '@prisma/client';
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

    const now = new Date();

    if (mission.startDate && now < mission.startDate) {
      throw new BadRequestException('Esta missão ainda não começou.');
    }
    if (mission.endDate && now > mission.endDate) {
      throw new BadRequestException('O prazo desta missão encerrou.');
    }

    if (mission.type === MissionType.STANDARD) {
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
        bonusEarned: 0,
        totalUserPoints: updatedUser.points,
        completions: 1,
        requiredCompletions: null,
      };
    }

    // WEEKLY_DAILY
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const todayCompletion = await this.prisma.pointTransaction.findFirst({
      where: {
        userId,
        missionId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    });
    if (todayCompletion) {
      throw new BadRequestException('Você já concluiu esta missão hoje.');
    }

    const completionCount = await this.prisma.pointTransaction.count({
      where: { userId, missionId },
    });
    const requiredCompletions = mission.requiredCompletions ?? 7;
    const newCompletionCount = completionCount + 1;

    // Check if bonus should be granted on this completion
    let bonusEarned = 0;
    let shouldGiveBonus = false;
    if (newCompletionCount >= requiredCompletions) {
      const bonusAlreadyGiven = await this.prisma.missionBonus.findFirst({
        where: { userId, missionId },
      });
      if (!bonusAlreadyGiven) {
        shouldGiveBonus = true;
        const totalBase = mission.points * requiredCompletions;
        const pct = mission.bonusPercentage ?? 25;
        bonusEarned = Math.round(totalBase * (pct / 100));
      }
    }

    // Award daily points
    const [, updatedUser] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: { userId, missionId, points: mission.points },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { points: { increment: mission.points } },
      }),
    ]);

    let finalPoints = updatedUser.points;

    // Award bonus if earned
    if (shouldGiveBonus) {
      const [, bonusUser] = await this.prisma.$transaction([
        this.prisma.missionBonus.create({
          data: { userId, missionId, points: bonusEarned },
        }),
        this.prisma.user.update({
          where: { id: userId },
          data: { points: { increment: bonusEarned } },
        }),
      ]);
      finalPoints = bonusUser.points;
    }

    const message = shouldGiveBonus
      ? `Parabéns! Você completou a missão semanal e ganhou bônus de ${mission.bonusPercentage ?? 25}%!`
      : `Missão concluída! ${newCompletionCount}/${requiredCompletions} dias completados.`;

    return {
      message,
      mission: { id: mission.id, title: mission.title },
      pointsEarned: mission.points,
      bonusEarned,
      totalUserPoints: finalPoints,
      completions: newCompletionCount,
      requiredCompletions,
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
