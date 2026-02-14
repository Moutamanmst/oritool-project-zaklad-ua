"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = void 0;
const common_1 = require("@nestjs/common");
exports.Lang = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-lang'] || request.query.lang || 'uk';
});
//# sourceMappingURL=lang.decorator.js.map