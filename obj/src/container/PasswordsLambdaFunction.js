"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.PasswordsLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const PasswordsServiceFactory_1 = require("../build/PasswordsServiceFactory");
class PasswordsLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("passwords", "User passwords function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-passwords', 'controller', 'default', '*', '*'));
        this._factories.add(new PasswordsServiceFactory_1.PasswordsServiceFactory());
    }
}
exports.PasswordsLambdaFunction = PasswordsLambdaFunction;
exports.handler = new PasswordsLambdaFunction().getHandler();
//# sourceMappingURL=PasswordsLambdaFunction.js.map