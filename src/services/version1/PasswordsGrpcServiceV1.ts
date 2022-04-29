const services = require('../../../../src/protos/passwords_v1_grpc_pb');
const messages = require('../../../../src/protos/passwords_v1_pb');

import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';

import { IPasswordsController } from '../../logic/IPasswordsController';
import { PasswordsGrpcConverterV1 } from './PasswordsGrpcConverterV1';

export class PasswordsGrpcServiceV1 extends GrpcService {
    private _controller: IPasswordsController;
	
    public constructor() {
        super(services.PasswordsService);
        this._dependencyResolver.put('controller', new Descriptor("service-passwords", "controller", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IPasswordsController>('controller');
    }
    
    private async getPasswordInfo(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();

        let response = new messages.PasswordInfoReply();

        try {
            let result = await this._controller.getPasswordInfo(correlationId, userId);
            let info = PasswordsGrpcConverterV1.fromPasswordInfo(result);
            response.setInfo(info);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async validatePassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let password = call.request.getPassword();

        let response = new messages.PasswordEmptyReply();

        try {
            await this._controller.validatePassword(correlationId, password);
        } catch (err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async setPassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();
        let password = call.request.getPassword();

        let response = new messages.PasswordEmptyReply();

        try {
            await this._controller.setPassword(correlationId, userId, password);
        } catch (err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async setTempPassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();

        let response = new messages.PasswordValueReply();

        try {
            let password = await this._controller.setTempPassword(correlationId, userId);
            response.setPassword(password);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async authenticate(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();
        let password = call.request.getPassword();

        let response = new messages.PasswordAuthenticateReply();

        try {
            let authenticated = await this._controller.authenticate(correlationId, userId, password);
            response.setAuthenticated(authenticated);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async deletePassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();

        let response = new messages.PasswordEmptyReply();

        try {
            await this._controller.deletePassword(correlationId, userId);
        } catch (err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async changePassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();
        let oldPassword = call.request.getOldPassword();
        let newPassword = call.request.getNewPassword();

        let response = new messages.PasswordEmptyReply();

        try {
            await this._controller.changePassword(correlationId, userId, oldPassword, newPassword);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async validateCode(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();
        let code = call.request.getCode();

        let response = new messages.PasswordValidReply();

        try {
            let valid = await this._controller.validateCode(correlationId, userId, code);
            response.setValid(valid);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async resetPassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();
        let code = call.request.getCode();
        let password = call.request.getPassword();

        let response = new messages.PasswordEmptyReply();

        try {
            await this._controller.resetPassword(correlationId, userId, code, password);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async recoverPassword(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let userId = call.request.getUserId();

        let response = new messages.PasswordEmptyReply();

        try {   
            await this._controller.recoverPassword(correlationId, userId);
        } catch(err) {
            let error = PasswordsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    public register() {
        this.registerMethod(
            'get_password_info', 
            null,
            this.getPasswordInfo
        );

        this.registerMethod(
            'validate_password', 
            null,
            this.validatePassword
        );

        this.registerMethod(
            'set_password', 
            null,
            this.setPassword
        );

        this.registerMethod(
            'set_temp_password', 
            null,
            this.setTempPassword
        );

        this.registerMethod(
            'delete_password', 
            null,
            this.deletePassword
        );

        this.registerMethod(
            'authenticate', 
            null,
            this.authenticate
        );

        this.registerMethod(
            'change_password',
            null, 
            this.changePassword
        );

        this.registerMethod(
            'validate_code',
            null, 
            this.validateCode
        );

        this.registerMethod(
            'reset_password',
            null, 
            this.resetPassword
        );

        this.registerMethod(
            'recover_password',
            null, 
            this.recoverPassword
        );

    }
}
