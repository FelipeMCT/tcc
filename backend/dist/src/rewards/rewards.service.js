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
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RewardsService = class RewardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
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
            .then((rewards) => rewards.map(({ _count, ...r }) => ({
            ...r,
            redeemed: _count.redemptions,
            remaining: r.quantity - _count.redemptions,
        })));
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
    async update(id, dto) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Recompensa não encontrada.');
        return this.prisma.reward.update({ where: { id }, data: dto });
    }
    async toggleActive(id) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Recompensa não encontrada.');
        return this.prisma.reward.update({ where: { id }, data: { active: !reward.active } });
    }
    async redeem(userId, rewardId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        if (user.role !== 'FUNCIONARIO') {
            throw new common_1.ForbiddenException('Apenas funcionários podem resgatar recompensas.');
        }
        const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new common_1.NotFoundException('Recompensa não encontrada.');
        if (!reward.active)
            throw new common_1.BadRequestException('Recompensa não está ativa.');
        const redeemed = await this.prisma.rewardRedemption.count({ where: { rewardId } });
        if (redeemed >= reward.quantity)
            throw new common_1.BadRequestException('Recompensa esgotada.');
        if (user.points < reward.cost) {
            throw new common_1.BadRequestException('Pontos insuficientes para resgatar esta recompensa.');
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
    getMyRedemptions(userId) {
        return this.prisma.rewardRedemption.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                reward: { select: { id: true, title: true, description: true } },
            },
        });
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map