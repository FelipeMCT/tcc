import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { getUserLevel } from '../common/utils/get-user-level';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateFeedbackDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.role !== 'FUNCIONARIO') throw new ForbiddenException('Apenas funcionários podem enviar feedback.');

    return this.prisma.feedback.create({
      data: { userId, title: dto.title, message: dto.message },
    });
  }

  getMyFeedbacks(userId: number) {
    return this.prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.feedback
      .findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, points: true },
          },
        },
      })
      .then((feedbacks) =>
        feedbacks.map((f) => ({
          ...f,
          user: { ...f.user, level: getUserLevel(f.user.points) },
        })),
      );
  }
}
