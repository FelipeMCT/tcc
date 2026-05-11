import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { getUserLevel } from '../common/utils/get-user-level';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  points: true,
  createdAt: true,
  currentStreak: true,
  longestStreak: true,
  lastActivityDate: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user
      .findMany({ select: userSelect })
      .then((users) => users.map((u) => ({ ...u, level: getUserLevel(u.points) })));
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user
      .findUnique({ where: { id }, select: userSelect })
      .then((u) => (u ? { ...u, level: getUserLevel(u.points) } : null));
  }

  async updateUserStreak(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.FUNCIONARIO) return null;

    const now = new Date();
    const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (user.lastActivityDate) {
      const last = user.lastActivityDate;
      const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      const diffDays = Math.round((todayDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return user;

      const newStreak = diffDays === 1 ? user.currentStreak + 1 : 1;
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
          lastActivityDate: todayDay,
        },
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(1, user.longestStreak),
        lastActivityDate: todayDay,
      },
    });
  }
}
