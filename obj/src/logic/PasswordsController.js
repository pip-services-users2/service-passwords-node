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
exports.PasswordsController = void 0;
const crypto = require('crypto');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const client_msgdistribution_node_1 = require("client-msgdistribution-node");
const MessageConnector_1 = require("./MessageConnector");
const ActivitiesConnector_1 = require("./ActivitiesConnector");
const UserPasswordV1_1 = require("../data/version1/UserPasswordV1");
const PasswordsCommandSet_1 = require("./PasswordsCommandSet");
class PasswordsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(PasswordsController._defaultConfig);
        this._messageResolver = new client_msgdistribution_node_1.MessageResolverV1();
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._lockTimeout = 1800000; // 30 mins
        this._attemptTimeout = 60000; // 1 min
        this._attemptCount = 4; // 4 times
        this._recExpireTimeout = 24 * 3600000; // 24 hours
        this._lockEnabled = false;
        this._magicCode = null;
        this._code_length = 9; // Generated code length
    }
    configure(config) {
        config = config.setDefaults(PasswordsController._defaultConfig);
        this._dependencyResolver.configure(config);
        this._messageResolver.configure(config);
        this._lockTimeout = config.getAsIntegerWithDefault('options.lock_timeout', this._lockTimeout);
        this._attemptTimeout = config.getAsIntegerWithDefault('options.attempt_timeout', this._attemptTimeout);
        this._attemptCount = config.getAsIntegerWithDefault('options.attempt_count', this._attemptCount);
        this._recExpireTimeout = config.getAsIntegerWithDefault('options.rec_expire_timeout', this._recExpireTimeout);
        this._lockEnabled = config.getAsBooleanWithDefault('options.lock_enabled', this._lockEnabled);
        this._magicCode = config.getAsStringWithDefault('options.magic_code', this._magicCode);
        this._code_length = config.getAsIntegerWithDefault('options.code_length', this._code_length);
        this._code_length = this._code_length <= 9 ? this._code_length : 9;
        this._code_length = this._code_length >= 3 ? this._code_length : 3;
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional('activities');
        this._messageDistributionClient = this._dependencyResolver.getOneOptional('msgdistribution');
        this._activitiesConnector = new ActivitiesConnector_1.ActivitiesConnector(this._logger, this._activitiesClient);
        this._messageConnector = new MessageConnector_1.MessageConnector(this._logger, this._messageResolver, this._messageDistributionClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new PasswordsCommandSet_1.PasswordsCommandSet(this);
        return this._commandSet;
    }
    generateVerificationCode() {
        return pip_services3_commons_nodex_3.IdGenerator.nextShort().substr(0, this._code_length);
    }
    hashPassword(password) {
        if (!password)
            return null;
        let shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        return shaSum.digest('hex');
    }
    verifyPassword(correlationId, password) {
        if (!password) {
            throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'NO_PASSWORD', 'Missing user password');
        }
        if (password.length < 6 || password.length > 20) {
            throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'BAD_PASSWORD', 'User password should be 5 to 20 symbols long');
        }
    }
    readUserPassword(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield this._persistence.getOneById(correlationId, userId);
            if (item == null) {
                throw new pip_services3_commons_nodex_5.NotFoundException(correlationId, 'USER_NOT_FOUND', 'User ' + userId + ' was not found').withDetails('user_id', userId);
            }
            return item;
        });
    }
    validatePassword(correlationId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.verifyPassword(correlationId, password);
        });
    }
    getPasswordInfo(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this._persistence.getOneById(correlationId, userId);
            if (data != null) {
                let info = {
                    id: data.id,
                    change_time: data.change_time,
                    locked: data.locked,
                    lock_time: data.lock_time
                };
                return info;
            }
        });
    }
    setPassword(correlationId, userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            password = this.hashPassword(password);
            let userPassword = new UserPasswordV1_1.UserPasswordV1(userId, password);
            yield this._persistence.create(correlationId, userPassword);
        });
    }
    geterateRandomPassword(length) {
        let randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
        // Creating an empty array
        let result = [];
        length !== null && length !== void 0 ? length : (length = randInt(12, 16));
        for (let i = 0; i < length; i++) {
            result.push(
            // 33-126 UTF-8 code symbols
            String.fromCharCode(randInt(33, 127)));
        }
        return result.join("");
    }
    setTempPassword(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: Improve password generation
            let password = this.geterateRandomPassword();
            let passwordHash = this.hashPassword(password);
            let userPassword = new UserPasswordV1_1.UserPasswordV1(userId, passwordHash);
            userPassword.change_time = new Date();
            yield this._persistence.create(correlationId, userPassword);
            return password;
        });
    }
    deletePassword(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._persistence.deleteById(correlationId, userId);
        });
    }
    authenticate(correlationId, userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let hashedPassword = this.hashPassword(password);
            let currentTime = new Date();
            let userPassword;
            // Retrieve user password
            userPassword = yield this.readUserPassword(correlationId, userId);
            // Check password and process failed attempts
            let passwordMatch = userPassword.password == hashedPassword;
            let lastFailureTimeout = userPassword.fail_time
                ? currentTime.getTime() - userPassword.fail_time.getTime() : null;
            // verify user account is still locked from last authorization failure or just tell user that it's user is locked
            if (!this._lockEnabled && passwordMatch)
                userPassword.locked = false;
            else {
                if (passwordMatch && userPassword.locked && lastFailureTimeout > this._lockTimeout)
                    userPassword.locked = false; // unlock user
                else if (userPassword.locked) {
                    throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'ACCOUNT_LOCKED', 'Account for user ' + userId + ' is locked').withDetails('user_id', userId);
                }
                if (!passwordMatch) {
                    if (lastFailureTimeout < this._attemptTimeout)
                        userPassword.fail_count = userPassword.fail_count ? userPassword.fail_count + 1 : 1;
                    userPassword.fail_time = currentTime;
                    try {
                        yield this._persistence.update(correlationId, userPassword);
                    }
                    catch (err) {
                        this._logger.error(correlationId, err, 'Failed to save user password');
                    }
                    if (userPassword.fail_count >= this._attemptCount) {
                        userPassword.locked = true;
                        yield this._messageConnector.sendAccountLockedEmail(correlationId, userId);
                        throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'ACCOUNT_LOCKED', 'Number of attempts exceeded. Account for user ' + userId + ' was locked').withDetails('user_id', userId);
                    }
                    else {
                        throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'WRONG_PASSWORD', 'Invalid password').withDetails('user_id', userId);
                    }
                }
            }
            // Perform authentication and save user
            // Update user last signin date
            userPassword.fail_count = 0;
            userPassword.fail_time = null;
            yield this._persistence.update(correlationId, userPassword);
            // Asynchronous post-processing
            this._activitiesConnector.logSigninActivity(correlationId, userId);
            return userPassword != null;
        });
    }
    changePassword(correlationId, userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPassword;
            this.verifyPassword(correlationId, newPassword);
            oldPassword = this.hashPassword(oldPassword);
            newPassword = this.hashPassword(newPassword);
            // Retrieve user
            userPassword = yield this.readUserPassword(correlationId, userId);
            // Verify and reset password
            // Password must be different then the previous one
            if (userPassword.password != oldPassword) {
                throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'WRONG_PASSWORD', 'Invalid password').withDetails('user_id', userId);
            }
            if (oldPassword === newPassword) {
                throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'PASSWORD_NOT_CHANGED', 'Old and new passwords are identical').withDetails('user_id', userId);
            }
            // Reset password
            userPassword.password = newPassword;
            userPassword.pwd_rec_code = null;
            userPassword.pwd_rec_expire = null;
            userPassword.lock = false;
            // Todo: Add change password policy
            userPassword.change_time = null;
            // Save the new password
            yield this._persistence.update(correlationId, userPassword);
            // Asynchronous post-processing
            yield this._activitiesConnector.logPasswordChangedActivity(correlationId, userId);
            yield this._messageConnector.sendPasswordChangedEmail(correlationId, userId);
        });
    }
    validateCode(correlationId, userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.readUserPassword(correlationId, userId);
            if (data != null) {
                let valid = code == this._magicCode
                    || (data.rec_code == code && data.rec_expire_time > new Date());
                return valid;
            }
            else {
                return false;
            }
        });
    }
    resetPassword(correlationId, userId, code, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPassword;
            this.verifyPassword(correlationId, password);
            password = this.hashPassword(password);
            // Retrieve user
            userPassword = yield this.readUserPassword(correlationId, userId);
            // Validate reset code and reset the password
            // Todo: Remove magic code
            if (userPassword.rec_code != code && code != this._magicCode) {
                throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'WRONG_CODE', 'Invalid password recovery code ' + code).withDetails('user_id', userId);
            }
            // Check if code already expired
            if (!(userPassword.rec_expire_time > new Date()) && code != this._magicCode) {
                throw new pip_services3_commons_nodex_4.BadRequestException(correlationId, 'CODE_EXPIRED', 'Password recovery code ' + code + ' expired').withDetails('user_id', userId);
            }
            // Reset the password
            userPassword.password = password;
            userPassword.rec_code = null;
            userPassword.rec_expire_time = null;
            userPassword.locked = false;
            // Todo: Add change password policy
            userPassword.change_time = null;
            // Save the new password
            yield this._persistence.update(correlationId, userPassword);
            // Asynchronous post-processing
            yield this._activitiesConnector.logPasswordChangedActivity(correlationId, userId);
            yield this._messageConnector.sendPasswordChangedEmail(correlationId, userId);
        });
    }
    recoverPassword(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPassword;
            // Retrieve user
            userPassword = yield this.readUserPassword(correlationId, userId);
            // Update and save recovery code
            let currentTicks = new Date().getTime();
            let expireTicks = currentTicks + this._recExpireTimeout;
            let expireTime = new Date(expireTicks);
            userPassword.rec_code = this.generateVerificationCode();
            userPassword.rec_expire_time = expireTime;
            yield this._persistence.update(correlationId, userPassword);
            // Asynchronous post-processing
            yield this._activitiesConnector.logPasswordRecoveredActivity(correlationId, userId);
            yield this._messageConnector.sendRecoverPasswordEmail(correlationId, userId, userPassword.rec_code);
        });
    }
}
exports.PasswordsController = PasswordsController;
PasswordsController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-passwords:persistence:*:*:1.0', 'dependencies.activities', 'service-activities:client:*:*:1.0', 'dependencies.msgdistribution', 'service-msgdistribution:client:*:*:1.0', 'message_templates.account_locked.subject', 'Account was locked', 'message_templates.account_locked.text', '{{name}} account was locked for 30 minutes after several failed signin attempts.', 'message_templates.password_changed.subject', 'Password was changed', 'message_templates.password_changed.text', '{{name}} password was changed.', 'message_templates.recover_password.subject', 'Reset password', 'message_templates.recover_password.text', '{{name}} password reset code is {{code}}', 'options.lock_timeout', 1800000, // 30 mins
'options.attempt_timeout', 60000, // 1 min
'options.attempt_count', 4, // 4 times
'options.rec_expire_timeout', 24 * 3600000, // 24 hours
'options.lock_enabled', false, // set to TRUE to enable locking logic
'options.magic_code', null, // Universal code
'options.code_length', 9 // Generated code length (3 - 9, default 9)
);
//# sourceMappingURL=PasswordsController.js.map