"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class PasswordsHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/passwords');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-passwords', 'controller', 'default', '*', '1.0'));
    }
}
exports.PasswordsHttpServiceV1 = PasswordsHttpServiceV1;
//# sourceMappingURL=PasswordsHttpServiceV1.js.map