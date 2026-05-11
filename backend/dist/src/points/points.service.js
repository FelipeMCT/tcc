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
exports.PointsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let PointsService = class PointsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async completeMission(userId, missionId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        if (user.role !== 'FUNCIONARIO') {
            throw new common_1.BadRequestException('Apenas funcionários podem concluir missões.');
        }
        const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
        if (!mission)
            throw new common_1.NotFoundException('Missão não encontrada.');
        if (!mission.active)
            throw new common_1.BadRequestException('Missão não está ativa.');
        const now = new Date();
        if (mission.startDate && now < mission.startDate) {
            throw new common_1.BadRequestException('Esta missão ainda não começou.');
        }
        if (mission.endDate && now > mission.endDate) {
            throw new common_1.BadRequestException('O prazo desta missão encerrou.');
        }
        if (mission.type === client_1.MissionType.STANDARD) {
            const existing = await this.prisma.pointTransaction.findFirst({
                where: { userId, missionId },
            });
            if (existing)
                throw new common_1.BadRequestException('Você já concluiu esta missão.');
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
            throw new common_1.BadRequestException('Você já concluiu esta missão hoje.');
        }
        const completionCount = await this.prisma.pointTransaction.count({
            where: { userId, missionId },
        });
        const requiredCompletions = mission.requiredCompletions ?? 7;
        const newCompletionCount = completionCount + 1;
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
    getMyHistory(userId) {
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
};
exports.PointsService = PointsService;
exports.PointsService = PointsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointsService);
//# sourceMappingURL=points.service.js.map