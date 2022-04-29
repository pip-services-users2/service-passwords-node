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
exports.PasswordsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
class PasswordsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetPasswordInfoCommand());
        this.addCommand(this.makeSetPasswordCommand());
        this.addCommand(this.makeSetTempPasswordCommand());
        this.addCommand(this.makeDeletePasswordCommand());
        this.addCommand(this.makeAuthenticateCommand());
        this.addCommand(this.makeChangePasswordCommand());
        this.addCommand(this.makeValidateCodeCommand());
        this.addCommand(this.makeResetPasswordCommand());
        this.addCommand(this.makeRecoverPasswordCommand());
    }
    makeGetPasswordInfoCommand() {
        return new pip_services3_commons_nodex_2.Command("get_password_info", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            return yield this._logic.getPasswordInfo(correlationId, userId);
        }));
    }
    makeSetPasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("set_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('password', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            let password = args.getAsNullableString("password");
            yield this._logic.setPassword(correlationId, userId, password);
        }));
    }
    makeSetTempPasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("set_temp_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            return yield this._logic.setTempPassword(correlationId, userId);
        }));
    }
    makeDeletePasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            yield this._logic.deletePassword(correlationId, userId);
        }));
    }
    makeAuthenticateCommand() {
        return new pip_services3_commons_nodex_2.Command("authenticate", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('password', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            let password = args.getAsNullableString("password");
            let authenticated = yield this._logic.authenticate(correlationId, userId, password);
            return { authenticated: authenticated };
        }));
    }
    makeChangePasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("change_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('old_password', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('new_password', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            let oldPassword = args.getAsNullableString("old_password");
            let newPassword = args.getAsNullableString("new_password");
            yield this._logic.changePassword(correlationId, userId, oldPassword, newPassword);
        }));
    }
    makeValidateCodeCommand() {
        return new pip_services3_commons_nodex_2.Command("validate_code", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('code', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            let code = args.getAsNullableString("code");
            let valid = yield this._logic.validateCode(correlationId, userId, code);
            return { valid: valid };
        }));
    }
    makeResetPasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("reset_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('code', pip_services3_commons_nodex_4.TypeCode.String)
            .withRequiredProperty('password', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            let code = args.getAsNullableString("code");
            let password = args.getAsNullableString("password");
            yield this._logic.resetPassword(correlationId, userId, code, password);
        }));
    }
    makeRecoverPasswordCommand() {
        return new pip_services3_commons_nodex_2.Command("recover_password", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('user_id', pip_services3_commons_nodex_4.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let userId = args.getAsNullableString("user_id");
            yield this._logic.recoverPassword(correlationId, userId);
        }));
    }
}
exports.PasswordsCommandSet = PasswordsCommandSet;
//# sourceMappingURL=PasswordsCommandSet.js.map