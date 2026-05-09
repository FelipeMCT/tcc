"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const get_user_level_1 = require("../common/utils/get-user-level");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        const completionsByEmployee = new Map();
        for (const t of transactions) {
            completionsByEmployee.set(t.userId, (completionsByEmployee.get(t.userId) ?? 0) + 1);
        }
        const completionsByMission = new Map();
        for (const t of transactions) {
            completionsByMission.set(t.missionId, (completionsByMission.get(t.missionId) ?? 0) + 1);
        }
        const sortedByPoints = [...employees].sort((a, b) => b.points - a.points);
        const topByPoints = sortedByPoints[0] ?? null;
        const sortedByCompletions = [...employees].sort((a, b) => (completionsByEmployee.get(b.id) ?? 0) - (completionsByEmployee.get(a.id) ?? 0));
        const topByCompletions = sortedByCompletions[0] ?? null;
        let mostCompletedMission = null;
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
        const activeMissionCount = activeMissions.length;
        const employeeParticipation = employees.map((e) => {
            const completed = completionsByEmployee.get(e.id) ?? 0;
            const rate = activeMissionCount > 0 ? (completed / activeMissionCount) * 100 : 0;
            return {
                id: e.id,
                name: e.name,
                email: e.email,
                points: e.points,
                level: (0, get_user_level_1.getUserLevel)(e.points),
                completedMissions: completed,
                participationRate: Math.min(Math.round(rate * 10) / 10, 100),
            };
        });
        employeeParticipation.sort((a, b) => b.completedMissions - a.completedMissions);
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
                ? { ...topByPoints, level: (0, get_user_level_1.getUserLevel)(topByPoints.points) }
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map