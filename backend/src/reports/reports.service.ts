import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getUserLevel } from '../common/utils/get-user-level';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getManagerSummary() {
    const [employees, missions, transactions] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'FUNCIONARIO' },
        select: { id: true, name: true, email: true, points: true },
      }),
      this.prisma.mission.findMany({
        select: { id: true, title: true, description: true, points: true, active: true },
      }),
      this.prisma.pointTransaction.findMany({
        select: { userId: true, missionId: true, points: true },
      }),
    ]);

    const activeMissions = missions.filter((m) => m.active);
    const inactiveMissions = missions.filter((m) => !m.active);
    const totalPointsDistributed = transactions.reduce((acc, t) => acc + t.points, 0);

    // completions per employee
    const completionsByEmployee = new Map<number, number>();
    for (const t of transactions) {
      completionsByEmployee.set(t.userId, (completionsByEmployee.get(t.userId) ?? 0) + 1);
    }

    // completions per mission
    const completionsByMission = new Map<number, number>();
    for (const t of transactions) {
      completionsByMission.set(t.missionId, (completionsByMission.get(t.missionId) ?? 0) + 1);
    }

    // top employee by points
    const sortedByPoints = [...employees].sort((a, b) => b.points - a.points);
    const topByPoints = sortedByPoints[0] ?? null;

    // top employee by completions
    const sortedByCompletions = [...employees].sort(
      (a, b) => (completionsByEmployee.get(b.id) ?? 0) - (completionsByEmployee.get(a.id) ?? 0),
    );
    const topByCompletions = sortedByCompletions[0] ?? null;

    // most completed mission
    let mostCompletedMission: {
      id: number;
      title: string;
      description: string;
      completions: number;
      points: number;
    } | null = null;
    let maxCompletions = 0;
    for (const m of missions) {
      const count = completionsByMission.get(m.id) ?? 0;
      if (count > maxCompletions) {
        maxCompletions = count;
        mostCompletedMission = {
          id: m.id,
          title: m.title,
          description: m.description,
          completions: count,
          points: m.points,
        };
      }
    }

    // employee participation
    const activeMissionCount = activeMissions.length;
    const employeeParticipation = employees.map((e) => {
      const completed = completionsByEmployee.get(e.id) ?? 0;
      const rate = activeMissionCount > 0 ? (completed / activeMissionCount) * 100 : 0;
      return {
        id: e.id,
        name: e.name,
        email: e.email,
        points: e.points,
        level: getUserLevel(e.points),
        completedMissions: completed,
        participationRate: Math.min(Math.round(rate * 10) / 10, 100),
      };
    });
    employeeParticipation.sort((a, b) => b.completedMissions - a.completedMissions);

    // employees without any completion
    const employeesWithoutCompletions = employees
      .filter((e) => !completionsByEmployee.has(e.id))
      .map((e) => ({ id: e.id, name: e.name, email: e.email, points: e.points }));

    return {
      totalEmployees: employees.length,
      totalMissions: missions.length,
      activeMissions: activeMissions.length,
      inactiveMissions: inactiveMissions.length,
      totalMissionCompletions: transactions.length,
      totalPointsDistributed,
      topEmployeeByPoints: topByPoints
        ? { ...topByPoints, level: getUserLevel(topByPoints.points) }
        : null,
      topEmployeeByCompletions: topByCompletions
        ? {
            ...topByCompletions,
            completedMissions: completionsByEmployee.get(topByCompletions.id) ?? 0,
          }
        : null,
      mostCompletedMission,
      employeeParticipation,
      employeesWithoutCompletions,
    };
  }
}
