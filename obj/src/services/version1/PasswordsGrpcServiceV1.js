"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsGrpcServiceV1 = void 0;
const services = require('../../../../src/protos/passwords_v1_grpc_pb');
const messages = require('../../../../src/protos/passwords_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const PasswordsGrpcConverterV1_1 = require("./PasswordsGrpcConverterV1");
class PasswordsGrpcServiceV1 extends pip_services3_grpc_nodex_1.GrpcService {
    constructor() {
        super(services.PasswordsService);
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor("service-passwords", "controller", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getPasswordInfo(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let response = new messages.PasswordInfoReply();
            try {
                let result = yield this._controller.getPasswordInfo(correlationId, userId);
                let info = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromPasswordInfo(result);
                response.setInfo(info);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    validatePassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let password = call.request.getPassword();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.validatePassword(correlationId, password);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setPassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let password = call.request.getPassword();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.setPassword(correlationId, userId, password);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setTempPassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let response = new messages.PasswordValueReply();
            try {
                let password = yield this._controller.setTempPassword(correlationId, userId);
                response.setPassword(password);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    authenticate(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let password = call.request.getPassword();
            let response = new messages.PasswordAuthenticateReply();
            try {
                let authenticated = yield this._controller.authenticate(correlationId, userId, password);
                response.setAuthenticated(authenticated);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    deletePassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.deletePassword(correlationId, userId);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    changePassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let oldPassword = call.request.getOldPassword();
            let newPassword = call.request.getNewPassword();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.changePassword(correlationId, userId, oldPassword, newPassword);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    validateCode(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let code = call.request.getCode();
            let response = new messages.PasswordValidReply();
            try {
                let valid = yield this._controller.validateCode(correlationId, userId, code);
                response.setValid(valid);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    resetPassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let code = call.request.getCode();
            let password = call.request.getPassword();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.resetPassword(correlationId, userId, code, password);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    recoverPassword(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let userId = call.request.getUserId();
            let response = new messages.PasswordEmptyReply();
            try {
                yield this._controller.recoverPassword(correlationId, userId);
            }
            catch (err) {
                let error = PasswordsGrpcConverterV1_1.PasswordsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    register() {
        this.registerMethod('get_password_info', null, this.getPasswordInfo);
        this.registerMethod('validate_password', null, this.validatePassword);
        this.registerMethod('set_password', null, this.setPassword);
        this.registerMethod('set_temp_password', null, this.setTempPassword);
        this.registerMethod('delete_password', null, this.deletePassword);
        this.registerMethod('authenticate', null, this.authenticate);
        this.registerMethod('change_password', null, this.changePassword);
        this.registerMethod('validate_code', null, this.validateCode);
        this.registerMethod('reset_password', null, this.resetPassword);
        this.registerMethod('recover_password', null, this.recoverPassword);
    }
}
exports.PasswordsGrpcServiceV1 = PasswordsGrpcServiceV1;
//# sourceMappingURL=PasswordsGrpcServiceV1.js.map