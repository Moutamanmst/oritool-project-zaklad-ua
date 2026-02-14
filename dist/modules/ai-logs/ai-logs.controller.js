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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AILogsController = void 0;
const common_1 = require("@nestjs/common");
const ai_logs_service_1 = require("./ai-logs.service");
let AILogsController = class AILogsController {
    constructor(aiLogsService) {
        this.aiLogsService = aiLogsService;
    }
    async create(data) {
        return this.aiLogsService.create(data);
    }
    async findAll(category, dateFrom, dateTo, helpful, search, page, limit) {
        return this.aiLogsService.findAll({
            category,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            helpful: helpful === 'true' ? true : helpful === 'false' ? false : undefined,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 50,
        });
    }
    async getStats() {
        return this.aiLogsService.getStats();
    }
    async getCategories() {
        return this.aiLogsService.getCategories();
    }
    async updateHelpful(id, helpful) {
        return this.aiLogsService.updateHelpful(id, helpful);
    }
};
exports.AILogsController = AILogsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AILogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __param(3, (0, common_1.Query)('helpful')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AILogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AILogsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AILogsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Patch)(':id/helpful'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('helpful')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AILogsController.prototype, "updateHelpful", null);
exports.AILogsController = AILogsController = __decorate([
    (0, common_1.Controller)('ai-logs'),
    __metadata("design:paramtypes", [ai_logs_service_1.AILogsService])
], AILogsController);
//# sourceMappingURL=ai-logs.controller.js.map