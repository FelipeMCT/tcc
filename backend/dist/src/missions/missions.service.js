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
exports.MissionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let MissionsService = class MissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.mission.findMany();
    }
    findActive() {
        return this.prisma.mission.findMany({ where: { active: true } });
    }
    create(dto) {
        const type = dto.type ?? client_1.MissionType.STANDARD;
        let startDate;
        let endDate;
        let bonusPercentage;
        let requiredCompletions;
        if (type === client_1.MissionType.WEEKLY_DAILY) {
            requiredCompletions = 7;
            bonusPercentage = 25;
            startDate = dto.startDate ? new Date(dto.startDate) : new Date();
            endDate = dto.endDate
                ? new Date(dto.endDate)
                : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
        else {
            if (dto.startDate)
                startDate = new Date(dto.startDate);
            if (dto.endDate)
                endDate = new Date(dto.endDate);
        }
        return this.prisma.mission.create({
            data: {
                title: dto.title,
                description: dto.description,
                points: dto.points,
                active: dto.active ?? true,
                type,
                startDate,
                endDate,
                bonusPercentage,
                requiredCompletions,
            },
        });
    }
    async update(id, dto) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Missão não encontrada.');
        const data = {};
        if (dto.title !== undefined)
            data.title = dto.title;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.points !== undefined)
            data.points = dto.points;
        if (dto.active !== undefined)
            data.active = dto.active;
        if (dto.type !== undefined)
            data.type = dto.type;
        if (dto.startDate !== undefined)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined)
            data.endDate = new Date(dto.endDate);
        if (dto.bonusPercentage !== undefined)
            data.bonusPercentage = dto.bonusPercentage;
        if (dto.requiredCompletions !== undefined)
            data.requiredCompletions = dto.requiredCompletions;
        return this.prisma.mission.update({ where: { id }, data });
    }
    async toggleActive(id) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Missão não encontrada.');
        return this.prisma.mission.update({
            where: { id },
            data: { active: !mission.active },
        });
    }
    async remove(id) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Missão não encontrada.');
        await this.prisma.$transaction([
            this.prisma.missionBonus.deleteMany({ where: { missionId: id } }),
            this.prisma.pointTransaction.deleteMany({ where: { missionId: id } }),
            this.prisma.mission.delete({ where: { id } }),
        ]);
        return { message: 'Missão excluída com sucesso.' };
    }
    async getMyProgress(userId) {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        const [missions, transactions, bonuses] = await Promise.all([
            this.prisma.mission.findMany({ where: { active: true } }),
            this.prisma.pointTransaction.findMany({
                where: { userId },
                select: { missionId: true, createdAt: true },
            }),
            this.prisma.missionBonus.findMany({
                where: { userId },
                select: { missionId: true },
            }),
        ]);
        const bonusSet = new Set(bonuses.map((b) => b.missionId));
        return missions.map((m) => {
            const txs = transactions.filter((t) => t.missionId === m.id);
            const completions = txs.length;
            const completedToday = txs.some((t) => t.createdAt >= startOfToday && t.createdAt <= endOfToday);
            const bonusReceived = bonusSet.has(m.id);
            let canCompleteToday = false;
            if (m.active) {
                if (m.type === client_1.MissionType.STANDARD) {
                    canCompleteToday =
                        completions === 0 &&
                            (!m.startDate || now >= m.startDate) &&
                            (!m.endDate || now <= m.endDate);
                }
                else {
                    const req = m.requiredCompletions ?? 7;
                    canCompleteToday =
                        !completedToday &&
                            completions < req &&
                            (!m.startDate || now >= m.startDate) &&
                            (!m.endDate || now <= m.endDate);
                }
            }
            return {
                missionId: m.id,
                type: m.type,
                completions,
                completedToday,
                bonusReceived,
                requiredCompletions: m.requiredCompletions,
                canCompleteToday,
            };
        });
    }
};
exports.MissionsService = MissionsService;
exports.MissionsService = MissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MissionsService);
//# sourceMappingURL=missions.service.js.map