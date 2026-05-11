import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        title: dto.title,
        description: dto.description,
        cost: dto.cost,
        quantity: dto.quantity,
        active: dto.active ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.reward
      .findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { redemptions: true } } },
      })
      .then((rewards) =>
        rewards.map(({ _count, ...r }) => ({
          ...r,
          redeemed: _count.redemptions,
          remaining: r.quantity - _count.redemptions,
        })),
      );
  }

  async findActive() {
    const rewards = await this.prisma.reward.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { redemptions: true } } },
    });
    return rewards
      .map(({ _count, ...r }) => ({
        ...r,
        redeemed: _count.redemptions,
        remaining: r.quantity - _count.redemptions,
      }))
      .filter((r) => r.remaining > 0);
  }

  async update(id: number, dto: UpdateRewardDto) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Recompensa não encontrada.');
    return this.prisma.reward.update({ where: { id }, data: dto });
  }

  async toggleActive(id: number) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Recompensa não encontrada.');
    return this.prisma.reward.update({ where: { id }, data: { active: !reward.active } });
  }

  async redeem(userId: number, rewardId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.role !== 'FUNCIONARIO') {
      throw new ForbiddenException('Apenas funcionários podem resgatar recompensas.');
    }

    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Recompensa não encontrada.');
    if (!reward.active) throw new BadRequestException('Recompensa não está ativa.');

    const redeemed = await this.prisma.rewardRedemption.count({ where: { rewardId } });
    if (redeemed >= reward.quantity) throw new BadRequestException('Recompensa esgotada.');

    if (user.points < reward.cost) {
      throw new BadRequestException('Pontos insuficientes para resgatar esta recompensa.');
    }

    const [, updatedUser] = await this.prisma.$transaction([
      this.prisma.rewardRedemption.create({
        data: { userId, rewardId, cost: reward.cost },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: reward.cost } },
      }),
    ]);

    return {
      message: 'Recompensa resgatada com sucesso!',
      reward: { id: reward.id, title: reward.title },
      cost: reward.cost,
      remainingPoints: updatedUser.points,
    };
  }

  getMyRedemptions(userId: number) {
    return this.prisma.rewardRedemption.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reward: { select: { id: true, title: true, description: true } },
      },
    });
  }
}
