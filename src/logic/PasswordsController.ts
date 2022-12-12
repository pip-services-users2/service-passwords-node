const crypto = require('crypto');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { IdGenerator } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { NotFoundException } from 'pip-services3-commons-nodex';

import { MessageResolverV1 } from 'client-msgdistribution-node';
import { IMessageDistributionClientV1 } from 'client-msgdistribution-node';
import { MessageConnector } from './MessageConnector';

import { IActivitiesClientV1 } from 'client-activities-node';
import { ActivitiesConnector } from './ActivitiesConnector';

import { UserPasswordV1 } from '../data/version1/UserPasswordV1';
import { UserPasswordInfoV1 } from '../data/version1/UserPasswordInfoV1';
import { IPasswordsPersistence } from '../persistence/IPasswordsPersistence';
import { IPasswordsController } from './IPasswordsController';
import { PasswordsCommandSet } from './PasswordsCommandSet';

export class PasswordsController implements IConfigurable, IReferenceable, ICommandable, IPasswordsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-passwords:persistence:*:*:1.0',
        'dependencies.activities', 'service-activities:client:*:*:1.0',
        'dependencies.msgdistribution', 'service-msgdistribution:client:*:*:1.0',

        'message_templates.account_locked.subject', 'Account was locked',
        'message_templates.account_locked.text', '{{name}} account was locked for 30 minutes after several failed signin attempts.',
        'message_templates.password_changed.subject', 'Password was changed',
        'message_templates.password_changed.text', '{{name}} password was changed.',
        'message_templates.recover_password.subject', 'Reset password',
        'message_templates.recover_password.text', '{{name}} password reset code is {{code}}',

        'options.lock_timeout', 1800000, // 30 mins
        'options.attempt_timeout', 60000, // 1 min
        'options.attempt_count', 4, // 4 times
        'options.rec_expire_timeout', 24 * 3600000, // 24 hours
        'options.lock_enabled', false, // set to TRUE to enable locking logic
        'options.magic_code', null, // Universal code
        'options.code_length', 9 // Generated code length (3 - 9, default 9)
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(PasswordsController._defaultConfig);
    private _messageResolver: MessageResolverV1 = new MessageResolverV1();
    private _logger: CompositeLogger = new CompositeLogger();
    private _persistence: IPasswordsPersistence;
    private _activitiesClient: IActivitiesClientV1;
    private _activitiesConnector: ActivitiesConnector;
    private _messageDistributionClient: IMessageDistributionClientV1;
    private _messageConnector: MessageConnector;
    private _commandSet: PasswordsCommandSet;

    private _lockTimeout: number = 1800000; // 30 mins
    private _attemptTimeout: number = 60000; // 1 min
    private _attemptCount: number = 4; // 4 times
    private _recExpireTimeout: number = 24 * 3600000; // 24 hours
    private _lockEnabled: boolean = false;
    private _magicCode: string = null;
    private _code_length: number = 9; // Generated code length

    private _maxPasswordLen: number = 20;
    private _minPasswordLen: number = 5;

    private _oldPasswordsCheck: boolean = false;
    private _oldPasswordsCount: number = 6;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(PasswordsController._defaultConfig)
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

        this._maxPasswordLen = config.getAsIntegerWithDefault('options.max_password_len', this._maxPasswordLen);
        this._minPasswordLen = config.getAsIntegerWithDefault('options.min_password_len', this._minPasswordLen);

        this._oldPasswordsCheck = config.getAsBooleanWithDefault('options.old_passwords_check', this._oldPasswordsCheck);
        this._oldPasswordsCount = config.getAsIntegerWithDefault('options.old_passwords_count', this._oldPasswordsCount);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IPasswordsPersistence>('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional<IActivitiesClientV1>('activities');
        this._messageDistributionClient = this._dependencyResolver.getOneOptional<IMessageDistributionClientV1>('msgdistribution');

        this._activitiesConnector = new ActivitiesConnector(this._logger, this._activitiesClient);
        this._messageConnector = new MessageConnector(this._logger, this._messageResolver, this._messageDistributionClient);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new PasswordsCommandSet(this);
        return this._commandSet;
    }

    private generateVerificationCode(): string {
        return IdGenerator.nextShort().substr(0, this._code_length);
    }

    private hashPassword(password: string): string {
        if (!password) return null;

        let shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        return shaSum.digest('hex');
    }


    private addOldPassword(passwordObject: UserPasswordV1, oldPassword: string): UserPasswordV1 {
        if (passwordObject.custom_dat == null)
            passwordObject.custom_dat = { old_passwords: [] };
        if (passwordObject.custom_dat.old_passwords.length >= this._oldPasswordsCount)
            passwordObject.custom_dat.old_passwords = passwordObject.custom_dat.old_passwords.slice(1)

        passwordObject.custom_dat.old_passwords.push(oldPassword);

        return passwordObject;
    }


    private async verifyPassword(correlationId: string, password: string, userId?: string): Promise<void> {
        if (!password) {
            throw new BadRequestException(
                correlationId,
                'NO_PASSWORD',
                'Missing user password'
            );
        }
        
        if (password.length < this._minPasswordLen || password.length > this._maxPasswordLen) {
            throw new BadRequestException(
                correlationId,
                'BAD_PASSWORD',
                'User password should be ' + this._minPasswordLen +' to ' + this._maxPasswordLen + ' symbols long'
            );
        }

        if (userId != null && userId.length > 0 && this._oldPasswordsCheck) {
            let oldPasswordErr: BadRequestException;
            let userPassword: UserPasswordV1;

            try {
                userPassword = await this.readUserPassword(correlationId, userId);
            } catch (err) {
                if (err instanceof NotFoundException) return;
                else throw err;
            }

            if (userPassword != null) {
                if (userPassword.custom_dat == null)
                    userPassword.custom_dat = { old_passwords: [] };
                if (userPassword.custom_dat.old_passwords == null)
                    userPassword.custom_dat.old_passwords = [];

                password = this.hashPassword(password);
                for (let oldPass of userPassword.custom_dat.old_passwords) {
                    if (oldPass === password) {
                        oldPasswordErr = new BadRequestException(
                            correlationId,
                            'OLD_PASSWORD',
                            'Old password used'
                        )
                    }
                }
            }

            if (oldPasswordErr) throw oldPasswordErr;
        }
    }

    public async validatePasswordForUser(correlationId: string, userId: string, password: string): Promise<void> {
        await this.verifyPassword(correlationId, password, userId)
    }

    private async readUserPassword(correlationId: string, userId: string): Promise<UserPasswordV1> {
        let item = await this._persistence.getOneById(
            correlationId,
            userId
        );

        if (item == null) {
            throw new NotFoundException(
                correlationId,
                'USER_NOT_FOUND',
                'User ' + userId + ' was not found'
            ).withDetails('user_id', userId);
        }

        return item;
    }

    public async validatePassword(correlationId: string, password: string): Promise<void> {
        await this.verifyPassword(correlationId, password);
    }

    public async getPasswordInfo(correlationId: string, userId: string): Promise<UserPasswordInfoV1> {
        let data = await this._persistence.getOneById(correlationId, userId);

        if (data != null) {
            let info = <UserPasswordInfoV1>{
                id: data.id,
                change_time: data.change_time,
                locked: data.locked,
                lock_time: data.lock_time
            };
            return info;
        }
    }

    public async setPassword(correlationId: string, userId: string, password: string): Promise<void> {
        await this.verifyPassword(correlationId, password, userId);

        let userPassword = await this._persistence.getOneById(correlationId, userId);
        
        password = this.hashPassword(password);

        if (userPassword != null) {
            userPassword = this.addOldPassword(userPassword, userPassword.password);
        } else {
            userPassword = new UserPasswordV1(userId, password);
        }
        
        await this._persistence.create(correlationId, userPassword);
    }

    private geterateRandomPassword(length?: number): string {
        let randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

        // Creating an empty array
        let result = [];
        length ??= randInt(12, 16);
        
        
        for (let i = 0; i < length; i++) {
            result.push(
                // 33-126 UTF-8 code symbols
                String.fromCharCode(randInt(33, 127))
            );
        }

        return result.join("");
    }

    public async setTempPassword(correlationId: string, userId: string): Promise<string> {
        // Todo: Improve password generation
        let password = this.geterateRandomPassword();
        let passwordHash = this.hashPassword(password);

        let userPassword = new UserPasswordV1(userId, passwordHash);
        userPassword.change_time = new Date();

        await this._persistence.create(correlationId, userPassword);

        return password;

    }

    public async deletePassword(correlationId: string, userId: string): Promise<void> {
        // todo: add validate
        await this._persistence.deleteById(correlationId, userId);
    }

    public async authenticate(correlationId: string, userId: string, password: string): Promise<boolean> {
        let hashedPassword = this.hashPassword(password);
        let currentTime = new Date();
        let userPassword: UserPasswordV1;

        // Retrieve user password
        userPassword = await this.readUserPassword(correlationId, userId);

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
                throw new BadRequestException(
                    correlationId,
                    'ACCOUNT_LOCKED',
                    'Account for user ' + userId + ' is locked'
                ).withDetails('user_id', userId)
            }

            if (!passwordMatch) {
                if (lastFailureTimeout < this._attemptTimeout)
                    userPassword.fail_count = userPassword.fail_count ? userPassword.fail_count + 1 : 1;

                userPassword.fail_time = currentTime;

                try {
                    await this._persistence.update(
                        correlationId,
                        userPassword
                    );
                } catch (err) {
                    this._logger.error(correlationId, err, 'Failed to save user password');
                }

                if (userPassword.fail_count >= this._attemptCount) {
                    userPassword.locked = true;

                    await this._messageConnector.sendAccountLockedEmail(correlationId, userId);

                    throw new BadRequestException(
                        correlationId,
                        'ACCOUNT_LOCKED',
                        'Number of attempts exceeded. Account for user ' + userId + ' was locked'
                    ).withDetails('user_id', userId)
                   
                } else {
                    throw new BadRequestException(
                        correlationId,
                        'WRONG_PASSWORD',
                        'Invalid password'
                    ).withDetails('user_id', userId);
                }
            }
        }

        // Perform authentication and save user
        // Update user last signin date
        userPassword.fail_count = 0;
        userPassword.fail_time = null;

        await this._persistence.update(
            correlationId,
            userPassword
        );

        // Asynchronous post-processing
        this._activitiesConnector.logSigninActivity(correlationId, userId);

        return userPassword != null;
    }

    public async changePassword(correlationId: string, userId: string, oldPassword: string, newPassword: string): Promise<void> {
        let userPassword;

        await this.verifyPassword(correlationId, newPassword, userId);

        oldPassword = this.hashPassword(oldPassword);
        newPassword = this.hashPassword(newPassword);

        // Retrieve user
        userPassword = await this.readUserPassword(correlationId, userId);

        // Verify and reset password
        // Password must be different then the previous one
        if (userPassword.password != oldPassword) {
            throw new BadRequestException(
                correlationId,
                'WRONG_PASSWORD',
                'Invalid password'
            ).withDetails('user_id', userId)
        }

        if (oldPassword === newPassword) {
            throw new BadRequestException(
                correlationId,
                'PASSWORD_NOT_CHANGED',
                'Old and new passwords are identical'
            ).withDetails('user_id', userId);
        }

        // Save old password
        userPassword = this.addOldPassword(userPassword, oldPassword);

        // Reset password
        userPassword.password = newPassword;
        userPassword.pwd_rec_code = null;
        userPassword.pwd_rec_expire = null;
        userPassword.lock = false;
        // Todo: Add change password policy
        userPassword.change_time = null;

        // Save the new password
        await this._persistence.update(correlationId, userPassword);

        // Asynchronous post-processing
        await this._activitiesConnector.logPasswordChangedActivity(correlationId, userId);
        await this._messageConnector.sendPasswordChangedEmail(correlationId, userId);
    }

    public async validateCode(correlationId: string, userId: string, code: string): Promise<boolean> {

        let data = await this.readUserPassword(correlationId, userId);

        if (data != null) {
            let valid = code == this._magicCode
                || (data.rec_code == code && data.rec_expire_time > new Date());
            return valid;
        } else {
            return false;
        }
    }

    public async resetPassword(correlationId: string, userId: string, code: string, password: string): Promise<void> {

        await this.verifyPassword(correlationId, password, userId);

        let userPassword: UserPasswordV1;

        password = this.hashPassword(password);

        // Retrieve user
        userPassword = await this.readUserPassword(correlationId, userId);

        // Validate reset code and reset the password
        // Todo: Remove magic code
        if (userPassword.rec_code != code && code != this._magicCode) {
            throw new BadRequestException(
                correlationId,
                'WRONG_CODE',
                'Invalid password recovery code ' + code
            ).withDetails('user_id', userId)
        }

        // Check if code already expired
        if (!(userPassword.rec_expire_time > new Date()) && code != this._magicCode) {
            throw new BadRequestException(
                correlationId,
                'CODE_EXPIRED',
                'Password recovery code ' + code + ' expired'
            ).withDetails('user_id', userId)
        }

        // Reset the password
        userPassword.password = password;
        userPassword.rec_code = null;
        userPassword.rec_expire_time = null;
        userPassword.locked = false;
        // Todo: Add change password policy
        userPassword.change_time = null;

        // Save the new password
        await this._persistence.update(correlationId, userPassword);

        // Asynchronous post-processing
        await this._activitiesConnector.logPasswordChangedActivity(correlationId, userId);
        await this._messageConnector.sendPasswordChangedEmail(correlationId, userId);
    }

    public async recoverPassword(correlationId: string, userId: string): Promise<void> {

        let userPassword: UserPasswordV1;

        // Retrieve user
        userPassword = await this.readUserPassword(correlationId, userId);

        // Update and save recovery code
        let currentTicks = new Date().getTime();
        let expireTicks = currentTicks + this._recExpireTimeout;
        let expireTime = new Date(expireTicks);

        userPassword.rec_code = this.generateVerificationCode();
        userPassword.rec_expire_time = expireTime;

        await this._persistence.update(correlationId, userPassword);

        // Asynchronous post-processing
        await this._activitiesConnector.logPasswordRecoveredActivity(correlationId, userId);
        await this._messageConnector.sendRecoverPasswordEmail(correlationId, userId, userPassword.rec_code);
    }
}
