import { UserPasswordInfoV1 } from '../data/version1/UserPasswordInfoV1';

export interface IPasswordsController {
    getPasswordInfo(correlationId: string, userId: string): Promise<UserPasswordInfoV1>;
    
    validatePassword(correlationId: string, password: string): Promise<void>;
    
    setPassword(correlationId: string, userId: string, password: string): Promise<void>;

    setTempPassword(correlationId: string, userId: string): Promise<string>;

    deletePassword(correlationId: string, userId: string): Promise<void>;

    authenticate(correlationId: string, userId: string, password: string): Promise<boolean>;

    changePassword(correlationId: string, userId: string, oldPassword: string, newPassword: string): Promise<void>;

    validateCode(correlationId: string, userId: string, code: string): Promise<boolean>;

    resetPassword(correlationId: string, userId: string, code: string, password: string): Promise<void>;

    recoverPassword(correlationId: string, userId: string): Promise<void>;

}
