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
exports.EstablishmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const establishments_service_1 = require("./establishments.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const lang_decorator_1 = require("../../common/decorators/lang.decorator");
const client_1 = require("@prisma/client");
let EstablishmentsController = class EstablishmentsController {
    constructor(establishmentsService) {
        this.establishmentsService = establishmentsService;
    }
    async findAll(filters) {
        return this.establishmentsService.findAll(filters);
    }
    async compare(ids, lang) {
        const idArray = Array.isArray(ids) ? ids : ids.split(',');
        return this.establishmentsService.compare(idArray, lang);
    }
    async findMyEstablishments(user, filters) {
        if (!user.businessProfile) {
            return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
        }
        return this.establishmentsService.findByBusiness(user.businessProfile.id, filters);
    }
    async findOne(idOrSlug, lang) {
        return this.establishmentsService.findOne(idOrSlug, lang);
    }
    async create(userId, dto) {
        return this.establishmentsService.create(userId, dto);
    }
    async update(id, userId, dto) {
        return this.establishmentsService.update(id, userId, dto);
    }
    async adminUpdate(id, dto) {
        return this.establishmentsService.adminUpdate(id, dto);
    }
    async delete(id, userId, userRole) {
        return this.establishmentsService.delete(id, userId, userRole);
    }
};
exports.EstablishmentsController = EstablishmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all establishments with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of establishments' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FilterEstablishmentDto]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('compare'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Compare multiple establishments' }),
    (0, swagger_1.ApiQuery)({ name: 'ids', type: [String], description: 'Array of establishment IDs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparison data' }),
    __param(0, (0, common_1.Query)('ids')),
    __param(1, (0, lang_decorator_1.Lang)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "compare", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.BUSINESS),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current business establishments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of business establishments' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.FilterEstablishmentDto]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "findMyEstablishments", null);
__decorate([
    (0, common_1.Get)(':idOrSlug'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get establishment by ID or slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Establishment details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Establishment not found' }),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __param(1, (0, lang_decorator_1.Lang)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.BUSINESS),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new establishment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Establishment created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateEstablishmentDto]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.BUSINESS),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update establishment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Establishment updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateEstablishmentDto]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin update establishment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Establishment updated by admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AdminUpdateEstablishmentDto]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete establishment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Establishment deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EstablishmentsController.prototype, "delete", null);
exports.EstablishmentsController = EstablishmentsController = __decorate([
    (0, swagger_1.ApiTags)('establishments'),
    (0, common_1.Controller)('establishments'),
    __metadata("design:paramtypes", [establishments_service_1.EstablishmentsService])
], EstablishmentsController);
//# sourceMappingURL=establishments.controller.js.map