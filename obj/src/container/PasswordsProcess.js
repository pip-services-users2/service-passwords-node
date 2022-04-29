"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const PasswordsServiceFactory_1 = require("../build/PasswordsServiceFactory");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
class PasswordsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("passwords", "User passwords microservice");
        this._factories.add(new PasswordsServiceFactory_1.PasswordsServiceFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_grpc_nodex_1.DefaultGrpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.PasswordsProcess = PasswordsProcess;
//# sourceMappingURL=PasswordsProcess.js.map