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
        return this.prisma.mission.create({
            data: {
                title: dto.title,
                description: dto.description,
                points: dto.points,
                active: dto.active ?? true,
            },
        });
    }
    async update(id, dto) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Missão não encontrada.');
        return this.prisma.mission.update({
            where: { id },
            data: dto,
        });
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
            this.prisma.pointTransaction.deleteMany({ where: { missionId: id } }),
            this.prisma.mission.delete({ where: { id } }),
        ]);
        return { message: 'Missão excluída com sucesso.' };
    }
};
exports.MissionsService = MissionsService;
exports.MissionsService = MissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MissionsService);
//# sourceMappingURL=missions.service.js.map