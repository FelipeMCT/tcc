import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getUserLevel } from '../common/utils/get-user-level';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user
      .findMany({
        select: { id: true, name: true, email: true, role: true, points: true, createdAt: true },
      })
      .then((users) => users.map((u) => ({ ...u, level: getUserLevel(u.points) })));
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user
      .findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, points: true, createdAt: true },
      })
      .then((u) => (u ? { ...u, level: getUserLevel(u.points) } : null));
  }
}
