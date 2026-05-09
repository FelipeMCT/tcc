import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getUserLevel } from '../common/utils/get-user-level';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  getRanking() {
    return this.prisma.user
      .findMany({
        orderBy: { points: 'desc' },
        select: { id: true, name: true, role: true, points: true },
      })
      .then((users) => users.map((u) => ({ ...u, level: getUserLevel(u.points) })));
  }
}
