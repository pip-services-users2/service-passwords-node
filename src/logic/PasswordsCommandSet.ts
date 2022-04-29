import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';

import { IPasswordsController } from './IPasswordsController';

export class PasswordsCommandSet extends CommandSet {
    private _logic: IPasswordsController;

    constructor(logic: IPasswordsController) {
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

	private makeGetPasswordInfoCommand(): ICommand {
		return new Command(
			"get_password_info",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                return await this._logic.getPasswordInfo(correlationId, userId);
            }
		);
	}

	private makeSetPasswordCommand(): ICommand {
		return new Command(
			"set_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String)
				.withRequiredProperty('password', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                let password = args.getAsNullableString("password");
                await this._logic.setPassword(correlationId, userId, password);
            }
		);
	}

	private makeSetTempPasswordCommand(): ICommand {
		return new Command(
			"set_temp_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                return await this._logic.setTempPassword(correlationId, userId);
            }
		);
	}

	private makeDeletePasswordCommand(): ICommand {
		return new Command(
			"delete_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                await this._logic.deletePassword(correlationId, userId);
            }
		);
	}

	private makeAuthenticateCommand(): ICommand {
		return new Command(
			"authenticate",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String)
				.withRequiredProperty('password', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                let password = args.getAsNullableString("password");
				let authenticated = await this._logic.authenticate(correlationId, userId, password);
				return { authenticated: authenticated };
            }
		);
	}

	private makeChangePasswordCommand(): ICommand {
		return new Command(
			"change_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String)
				.withRequiredProperty('old_password', TypeCode.String)
				.withRequiredProperty('new_password', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                let oldPassword = args.getAsNullableString("old_password");
                let newPassword = args.getAsNullableString("new_password");
                await this._logic.changePassword(correlationId, userId, oldPassword, newPassword);
            }
		);
	}

	private makeValidateCodeCommand(): ICommand {
		return new Command(
			"validate_code",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String)
				.withRequiredProperty('code', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                let code = args.getAsNullableString("code");
				let valid = await this._logic.validateCode(correlationId, userId, code);
				return { valid: valid };
            }
		);
	}

	private makeResetPasswordCommand(): ICommand {
		return new Command(
			"reset_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String)
				.withRequiredProperty('code', TypeCode.String)
				.withRequiredProperty('password', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                let code = args.getAsNullableString("code");
                let password = args.getAsNullableString("password");
                await this._logic.resetPassword(correlationId, userId, code, password);
            }
		);
	}

	private makeRecoverPasswordCommand(): ICommand {
		return new Command(
			"recover_password",
			new ObjectSchema(true)
				.withRequiredProperty('user_id', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let userId = args.getAsNullableString("user_id");
                await this._logic.recoverPassword(correlationId, userId);
            }
		);
	}

}