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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const get_user_level_1 = require("../common/utils/get-user-level");
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
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.user
            .findMany({ select: userSelect })
            .then((users) => users.map((u) => ({ ...u, level: (0, get_user_level_1.getUserLevel)(u.points) })));
    }
    findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    findById(id) {
        return this.prisma.user
            .findUnique({ where: { id }, select: userSelect })
            .then((u) => (u ? { ...u, level: (0, get_user_level_1.getUserLevel)(u.points) } : null));
    }
    async updateUserStreak(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== client_1.Role.FUNCIONARIO)
            return null;
        const now = new Date();
        const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (user.lastActivityDate) {
            const last = user.lastActivityDate;
            const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
            const diffDays = Math.round((todayDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 0)
                return user;
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map