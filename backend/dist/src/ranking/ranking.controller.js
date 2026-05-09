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
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const ranking_service_1 = require("./ranking.service");
let RankingController = class RankingController {
    rankingService;
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    getRanking() {
        return this.rankingService.getRanking();
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getRanking", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)('ranking'),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map