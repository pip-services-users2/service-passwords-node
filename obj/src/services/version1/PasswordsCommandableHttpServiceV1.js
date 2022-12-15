"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class PasswordsCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/passwords');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-passwords', 'controller', 'default', '*', '1.0'));
    }
}
exports.PasswordsCommandableHttpServiceV1 = PasswordsCommandableHttpServiceV1;
//# sourceMappingURL=PasswordsCommandableHttpServiceV1.js.map