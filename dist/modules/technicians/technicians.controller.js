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
exports.TechniciansController = void 0;
const common_1 = require("@nestjs/common");
const technicians_service_1 = require("./technicians.service");
let TechniciansController = class TechniciansController {
    constructor(techniciansService) {
        this.techniciansService = techniciansService;
    }
    async findAll(city, specialization, status, limit, page) {
        return this.techniciansService.findAll({
            city,
            specialization,
            status,
            limit: limit ? parseInt(limit) : undefined,
            page: page ? parseInt(page) : undefined,
        });
    }
    async getSpecializations() {
        return this.techniciansService.getSpecializations();
    }
    async getCities() {
        return this.techniciansService.getCities();
    }
    async findOne(id) {
        return this.techniciansService.findOne(id);
    }
    async create(data) {
        return this.techniciansService.create(data);
    }
    async update(id, data) {
        return this.techniciansService.update(id, data);
    }
    async delete(id) {
        return this.techniciansService.delete(id);
    }
};
exports.TechniciansController = TechniciansController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('specialization')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('specializations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getSpecializations", null);
__decorate([
    (0, common_1.Get)('cities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "delete", null);
exports.TechniciansController = TechniciansController = __decorate([
    (0, common_1.Controller)('technicians'),
    __metadata("design:paramtypes", [technicians_service_1.TechniciansService])
], TechniciansController);
//# sourceMappingURL=technicians.controller.js.map