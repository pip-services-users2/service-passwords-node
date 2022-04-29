"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsCommandableGrpcServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
class PasswordsCommandableGrpcServiceV1 extends pip_services3_grpc_nodex_1.CommandableGrpcService {
    constructor() {
        super('v1/passwords');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-passwords', 'controller', 'default', '*', '1.0'));
    }
}
exports.PasswordsCommandableGrpcServiceV1 = PasswordsCommandableGrpcServiceV1;
//# sourceMappingURL=PasswordsCommandableGrpcServiceV1.js.map