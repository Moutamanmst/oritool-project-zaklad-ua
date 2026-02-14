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
exports.SeoController = void 0;
const common_1 = require("@nestjs/common");
const seo_service_1 = require("./seo.service");
let SeoController = class SeoController {
    constructor(seoService) {
        this.seoService = seoService;
    }
    async getSettings() {
        return this.seoService.getSettings();
    }
    async updateSettings(data) {
        return this.seoService.updateSettings(data);
    }
    async getAllPageSeo() {
        return this.seoService.getAllPageSeo();
    }
    async getPageSeo(path) {
        const decodedPath = decodeURIComponent(path);
        return this.seoService.getPageSeo(decodedPath);
    }
    async upsertPageSeo(path, data) {
        const decodedPath = decodeURIComponent(path);
        return this.seoService.upsertPageSeo(decodedPath, data);
    }
    async deletePageSeo(path) {
        const decodedPath = decodeURIComponent(path);
        return this.seoService.deletePageSeo(decodedPath);
    }
};
exports.SeoController = SeoController;
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('pages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getAllPageSeo", null);
__decorate([
    (0, common_1.Get)('pages/:path'),
    __param(0, (0, common_1.Param)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getPageSeo", null);
__decorate([
    (0, common_1.Put)('pages/:path'),
    __param(0, (0, common_1.Param)('path')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "upsertPageSeo", null);
__decorate([
    (0, common_1.Delete)('pages/:path'),
    __param(0, (0, common_1.Param)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "deletePageSeo", null);
exports.SeoController = SeoController = __decorate([
    (0, common_1.Controller)('seo'),
    __metadata("design:paramtypes", [seo_service_1.SeoService])
], SeoController);
//# sourceMappingURL=seo.controller.js.map