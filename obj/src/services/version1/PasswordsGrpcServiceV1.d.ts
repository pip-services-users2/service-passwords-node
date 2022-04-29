import { IReferences } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';
export declare class PasswordsGrpcServiceV1 extends GrpcService {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private getPasswordInfo;
    private validatePassword;
    private setPassword;
    private setTempPassword;
    private authenticate;
    private deletePassword;
    private changePassword;
    private validateCode;
    private resetPassword;
    private recoverPassword;
    register(): void;
}
